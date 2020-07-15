export function getChartData(data) {
    let stats = data.batch.map(action => {
        let timestamp = data.acpTime.find(
            a => a.Stage === action.Stage && a.Index === action.StageIndex
        );
        return {
            Object: timestamp.Succeed ? "Acp" : "Acp Failed",
            ActNum: action.ActNum,
            Name: action.AnalysisName,
            Layer: action.LayerName,
            Stage: action.Stage,
            Index: action.Stage + '_' + action.StageIndex,
            StartTime: timestamp ? timestamp.StartTime : "",
            CompleteTime: timestamp ? timestamp.CompleteTime : "",
            Time: time_diff(timestamp.StartTime, timestamp.CompleteTime),
            StartDate: new Date(`01/01/1970 ${timestamp.StartTime}`),
            EndDate: new Date(`01/01/1970 ${timestamp.CompleteTime}`)
        };
    });

    let uploadObj = {
        Object: "Upload",
        Name: "Upload",
        Index: -1,
        StartDate: new Date(`01/01/1970 ${data.uploadTime.StartTime}`),
        EndDate: new Date(`01/01/1970 ${data.uploadTime.CompleteTime}`)
    };

    let splitterObj = {
        Object: "Splitter",
        Name: "Splitter",
        Index: 0,
        StartDate: new Date(`01/01/1970 ${data.splitterTime.StartTime}`),
        EndDate: new Date(`01/01/1970 ${data.splitterTime.CompleteTime}`)
    };

    let mergerObj;
    if (data.mergerTime.StartTime && data.mergerTime.CompleteTime) {
        mergerObj = {
            Object: "Merger",
            Name: "Merger",
            Index: stats.length + 1,
            StartDate: new Date(`01/01/1970 ${data.mergerTime.StartTime}`),
            EndDate: new Date(`01/01/1970 ${data.mergerTime.CompleteTime}`)
        };
    }

    let downloadObj;
    if (data.downloadTime.StartTime && data.downloadTime.CompleteTime) {
        downloadObj = {
            Object: "Download",
            Name: "Download",
            Index: stats.length + 2,
            StartDate: new Date(`01/01/1970 ${data.downloadTime.StartTime}`),
            EndDate: new Date(`01/01/1970 ${data.downloadTime.CompleteTime}`)
        };
    }

    stats = [uploadObj, splitterObj, ...stats];
    if (mergerObj) stats = [...stats, mergerObj];
    if (downloadObj) stats = [...stats, downloadObj];

    return stats;
}


export function getListData(localData) {
    const actionsNum = localData?.batch[localData.batch.length - 1].ActNum;
    const layersNum = new Set(localData?.batch.map(action => action.LayerName)).size;
    return {
        runningDate: localData?.runningDate,
        jobName: localData?.jobName,
        step: localData?.batch[0].StepName,
        checklist: localData?.batch[0].ChecklistName,
        actionsNum: actionsNum,
        layersNum: layersNum,
        runningTime: localData?.runningTime,
        batchJobsNum: localData?.batch.length,
        key: localData?.key,
        errorTime: localData?.errorTime
    }
}

function time_diff(start_time, complete_time) {
    let start = start_time.split(':').map(t => Number(t));
    let start_sec = start[0] * 3600 + start[1] * 60 + start[2];
    let complete = complete_time.split(':').map(t => Number(t));
    let complete_sec = complete[0] * 3600 + complete[1] * 60 + complete[2];
    let diff_sec = complete_sec - start_sec;
    return diff_sec;
}
