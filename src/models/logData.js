export function getChartData(data) {
    let index = 0;

    let uploadObj = {
        Object: "Upload",
        Name: "Upload",
        Index: index,
        StartDate: data.uploadTime.StartTime,
        EndDate: data.uploadTime.CompleteTime,
        Time: time_diff(data.uploadTime.StartTime, data.uploadTime.CompleteTime)
    };

    index += 1;

    let splitterObj = {
        Object: "Splitter",
        Name: "Splitter",
        Index: index,
        StartDate: data.splitterTime.StartTime,
        EndDate: data.splitterTime.CompleteTime,
        Time: time_diff(data.splitterTime.StartTime, data.splitterTime.CompleteTime)
    };

    // index += 1;

    // let stats = data.batch.map(action => {
    //     let timestamp = data.acpTime.find(
    //         a => (a.Stage === action.Stage || a.Stage === "") &&
    //             a.Index === action.StageIndex
    //     );
    //     return {
    //         Object: timestamp.Succeed ? "Acp" : "Acp Failed",
    //         Stage: action.Stage,
    //         Index: action.Stage + '_' + action.StageIndex,
    //         ActNum: action.ActNum,
    //         Name: action.AnalysisName,
    //         Layer: action.LayerName,
    //         ActParam: action.ActParam,
    //         BeginNf: action.BeginNf,
    //         EndNf: action.EndNf,
    //         ContourGroupId: action.ContourGroupId,
    //         ContourGroupNum: action.ContourGroupNum,
    //         StartDate: timestamp ? timestamp.StartTime : "",
    //         EndDate: timestamp ? timestamp.CompleteTime : "",
    //         Time: time_diff(timestamp.StartTime, timestamp.CompleteTime)
    //     };
    // });

    let acpArray = data.acpTime.map((timestamp) => {
        let objectName =
            timestamp.WorkerCmd === "NULL" ? "ACP Master" : "ACP Worker";
        objectName = timestamp.Succeed ? objectName : `${objectName} Failed`;
        index += 1; //timestamp.BatchId === 1 ? timestamp.Index : timestamp.Index + 1;
        let jobInBatch = data.batch.find((job) => job.Id === timestamp.BatchId);
        return {
            Object: objectName,
            Index: index,
            BatchId: timestamp.BatchId,
            WorkerIndex: timestamp.Index,
            Layer: jobInBatch.LayerName,
            StartDate: timestamp ? timestamp.StartTime : "",
            EndDate: timestamp ? timestamp.CompleteTime : "",
            Time: time_diff(timestamp.StartTime, timestamp.CompleteTime)
        };
    });

    index += 1;

    let mergerObj;
    if (data.mergerTime.StartTime && data.mergerTime.CompleteTime) {
        mergerObj = {
            Object: "Merger",
            Name: "Merger",
            Index: index,
            StartDate: data.mergerTime.StartTime,
            EndDate: data.mergerTime.CompleteTime,
            Time: time_diff(data.mergerTime.StartTime, data.mergerTime.CompleteTime)
        };
    }

    index += 1;

    let downloadObj;
    if (data.downloadTime.StartTime && data.downloadTime.CompleteTime) {
        downloadObj = {
            Object: "Download",
            Name: "Download",
            Index: index,
            StartDate: data.downloadTime.StartTime,
            EndDate: data.downloadTime.CompleteTime,
            Time: time_diff(data.downloadTime.StartTime, data.downloadTime.CompleteTime)
        };
    }

    let stats = [uploadObj, splitterObj, ...acpArray];
    if (mergerObj) stats = [...stats, mergerObj];
    if (downloadObj) stats = [...stats, downloadObj];

    return stats;
}

// export function getListData(localData) {
//     const actionsNum = localData?.batch[localData.batch.length - 1].ActNum;
//     const layersNum = new Set(localData?.batch.map(action => action.LayerName)).size;
//     return {
//         runningDate: localData?.runningDate,
//         jobName: localData?.jobName,
//         step: localData?.batch[0].StepName,
//         checklist: localData?.batch[0].ChecklistName,
//         actionsNum: actionsNum,
//         layersNum: layersNum,
//         runningTime: localData?.runningTime,
//         batchJobsNum: localData?.batch.length,
//         key: localData?.key,
//         errorTime: localData?.errorTime,
//         text: localData?.text,
//         marked: localData?.marked,
//         selected: localData?.selected
//     }
// }

// function time_diff(start_time, complete_time) {
//     let start = start_time.split(':').map(t => Number(t));
//     let start_sec = start[0] * 3600 + start[1] * 60 + start[2];
//     let complete = complete_time.split(':').map(t => Number(t));
//     let complete_sec = complete[0] * 3600 + complete[1] * 60 + complete[2];
//     let diff_sec = complete_sec - start_sec;
//     return diff_sec;
// }

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
