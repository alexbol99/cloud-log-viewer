export function parse(text) {
    const row_lines = text.split('\n');
    const arrayOfTimestamps = timestamps(row_lines);
    const errorTimeString = errorTime(row_lines, arrayOfTimestamps);
    return {
        runningDate: runningDate(arrayOfTimestamps),
        runningTime: runningTime(arrayOfTimestamps, errorTimeString),
        jobName: jobName(row_lines),
        batch: batch(arrayOfTimestamps),
        uploadTime: uploadTime(arrayOfTimestamps),
        splitterTime: splitterTime(arrayOfTimestamps),
        acpTime: acpTime(row_lines, arrayOfTimestamps),
        mergerTime: mergerTime(arrayOfTimestamps),
        downloadTime: downloadTime(arrayOfTimestamps),
        errorTime: errorTimeString
    };
}

function jobName(row_lines) {
    let job_line = row_lines.filter(line => line.match("Job:"))[0];
    let job_name;

    if (job_line) {
        job_name = job_line.split(' ')[1];
    }
    else {
        let ext_name = row_lines
            .filter((line) => line.match("JobInfo:"))[0]
            .split(" ")[1]
            .split("=")[1];
        job_name = ext_name.slice(6, ext_name.indexOf(".acp_ex"));
    }
    return job_name;
}

function runningDate(arrayOfTimestamps) {
    let job_started = arrayOfTimestamps.filter(
        line => line.message === "Ready for commands"
    )[0];
    return job_started.utcDate.toLocaleString();
}

// function runningDate(row_lines) {
//     let arrayOfLines = row_lines.filter(line => line.match("time"));
//     let splitArray = arrayOfLines[0].split(' ');
//     let [day, month, year] = splitArray[1].split(':')[1].split('/');
//     if (day.length > 2) day = day.substr(1);
//     let [hour, min] = splitArray[2].split(':');
//     if (hour.trim().length > 2) hour = hour.substr(1);
//     if (min.trim().length > 2) min = min.substr(1);
//     return new Date(Date.UTC(year, month - 1, day, hour, min)).toUTCString();
// }

function runningTime(arrayOfTimestamps, errorTime) {
    let job_started = arrayOfTimestamps.filter(
        line => line.message === "Ready for commands"
    )[0];
    let start_time = job_started.utcDate;
    let job_ended_arr = arrayOfTimestamps.filter(
        line => line.message === "Job is ready"
    );
    let end_time = job_ended_arr.length > 0 ? job_ended_arr[0].utcDate : errorTime;

    return end_time ? time_diff(start_time, end_time) : "";
}

function batch(arrayOfTimestamps) {
    let batchObjectList = arrayOfTimestamps.filter(d => d.type === "Batch");
    let messageList = batchObjectList.map(batchObject =>
        batchObject.message.slice(2)
    );
    let message = messageList.join("");
    return JSON.parse(message);
}

function uploadTime(arrayOfTimestamps) {
    let uploadTime = {
        StartTime: arrayOfTimestamps.find(
            d => d.object === "WebClient" && d.message === "Job was registered"
        ).utcDate,
        CompleteTime: arrayOfTimestamps.find(
            d => d.object === "WebClient" && d.message === "After send"
        ).utcDate
    };
    return uploadTime;
}

function splitterTime(arrayOfTimestamps) {
    let splitter = arrayOfTimestamps.filter(d => d.object === "Splitter")
    let s = {
        StartTime: splitter.find(s => s.message === "Splitter started").utcDate,
        CompleteTime: splitter.find(s => s.message === "End of Split").utcDate
    };
    return s;
}

function mergerTime(arrayOfTimestamps) {
    let merger = arrayOfTimestamps.filter(d => d.object === "Merger");
    let mergerStartMessage = merger.find(s => s.message === "Preparing job for merge");
    let mergerCompleteMessage = merger.find(s => s.message === "Moving Job to S3");

    let s = {
        StartTime: mergerStartMessage ? mergerStartMessage.utcDate : null,
        CompleteTime: mergerCompleteMessage ? mergerCompleteMessage.utcDate : null
    };
    return s;
}

function downloadTime(arrayOfTimestamps) {
    let downloadStartMessage = arrayOfTimestamps.find(d => d.object === "WebClient" && d.message === "Download Data");
    let downloadCompleteMessage = arrayOfTimestamps.find(d => d.object === "WebClient" && d.message === "Job is ready");
    let downloadTime = {
        StartTime: downloadStartMessage ? downloadStartMessage.utcDate : null,
        CompleteTime: downloadCompleteMessage ? downloadCompleteMessage.utcDate : null
    };
    return downloadTime;
}

function acpTime(row_lines, arrayOfTimestamps) {
    // let errorTimeStr = errorTime(row_lines, arrayOfTimestamps);
    let acp = arrayOfTimestamps.filter(d => (d.type === "Progress" || d.type === "Info") && d.object === "ACP");
    let acp_transformed = acp.map(action => {
        let message = action.message.split(" ").filter( s => s !== "");
        return {
            Time: action.utcDate,
            Step: message[0],
            Stage: message[1].split(':')[1],
            Index: Number(message[2].split(':')[1]),
            BatchId: Number(message[3].split("=")[1]),
            JobId: action.job_id,
            WorkerCmd: message[4].split("=")[1]
        };
    });
    let acp_started = acp_transformed
        .filter(action => action.Step === "Starting")
        .map(action => {
            return {
                Stage: action.Stage,
                Index: action.Index,
                StartTime: action.Time,
                BatchId: action.BatchId,
                JobId: action.JobId,
                WorkerCmd: action.WorkerCmd
            };
        });
    let acp_completed = acp_transformed
        .filter(action => action.Step === "Completing")
        .map(action => {
            return {
                Stage: action.Stage,
                Index: action.Index,
                CompleteTime: action.Time,
                BatchId: action.BatchId,
                JobId: action.JobId,
                WorkerCmd: action.WorkerCmd
            };
        });
    let acp_timestamps = acp_started.map(started => {
        let acpCompleted = acp_completed.find(
            completed => completed.Stage === started.Stage &&
                completed.Index === started.Index &&
                completed.BatchId === started.BatchId &&
                completed.WorkerCmd === started.WorkerCmd
        );

        let masterCompleted = acp_completed.find(
            (completed) =>
                completed.BatchId === started.BatchId &&
                completed.Index === 0 &&
                completed.WorkerCmd === "NULL"
        );

        return {
            Stage: started.Stage,
            Index: started.Index,
            BatchId: started.BatchId,
            JobId: started.JobId,
            StartTime: started.StartTime,
            CompleteTime: acpCompleted ?
                acpCompleted.CompleteTime :
                masterCompleted.CompleteTime,
            Succeed: !!acpCompleted,
            WorkerCmd: started.WorkerCmd
        };
    });

    acp_timestamps.sort((c1, c2) => {
        return c1.BatchId !== c2.BatchId
            ? c1.BatchId - c2.BatchId
            : c1.Index - c2.Index;
    });
    return acp_timestamps;
}

function errorTime(row_lines, arrayOfTimestamps) {
    let errorMessage = arrayOfTimestamps.find(
        d => d.object === "WebClient" && d.type === "ERROR"
    );

    let errorTime = null;
    if (errorMessage) {
        errorTime = errorMessage.utcDate
    }
    return errorTime;
}

function timestamps(row_lines) {
    let arrayOfLines = row_lines.filter(line => line.match("time"));
    let tmpArrayOfLines = [...arrayOfLines];
    tmpArrayOfLines.splice(0, 1);
    let arrayOfTimestamps = [];
    let timeStamp;
    let utcDate;
    let dateStr = "";
    for (let i = 0; i < tmpArrayOfLines.length; i++) {
        try {
            timeStamp = JSON.parse(tmpArrayOfLines[i]);
            if (timeStamp.message === "Submit Splitter") continue; // bad format
            utcDate = timeStampToDate(timeStamp.time, dateStr);
            dateStr = utcDate.toDateString();
            arrayOfTimestamps.push({ utcDate, ...timeStamp });
        } catch (e) {
            return [i, tmpArrayOfLines[i]];
        }
    }
    return arrayOfTimestamps;
}

function time_diff(start_time, complete_time) {
    if (start_time instanceof Date && !isNaN(start_time) &&
        complete_time instanceof Date && !isNaN(complete_time)) {
        return msecToHHMMSS(complete_time - start_time);
    }
    else {
        return 0;
    }
}

function msecToHHMMSS(time) {
    return new Date(time).toISOString().substr(11, 8);
}

function timeStampToDate(timeStr, dateStr) {
    let splitArray = timeStr.split(', ');
    if (splitArray.length === 1) {   // bad format only time no date
        return new Date(dateStr + ' ' + timeStr)
    }
    else {
        let [month, day, year] = splitArray[0].split('/');
        let [hour, min, sec] = splitArray[1].split(':');
        return new Date(Date.UTC(year, month - 1, day, hour, min, sec)); // .toUTCString();
    }
}
