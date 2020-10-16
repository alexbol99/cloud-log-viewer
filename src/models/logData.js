export function getChartData(data) {
    let stats = data.batch.map(action => {
        let timestamp = data.acpTime.find(
            a => a.Stage === action.Stage && a.Index === action.StageIndex
        );
        return {
            Object: timestamp.Succeed ? "Acp" : "Acp Failed",
            Stage: action.Stage,
            Index: action.Stage + '_' + action.StageIndex,
            ActNum: action.ActNum,
            Name: action.AnalysisName,
            Layer: action.LayerName,
            ActParam: action.ActParam,
            BeginNf: action.BeginNf,
            EndNf: action.EndNf,
            ContourGroupId: action.ContourGroupId,
            ContourGroupNum: action.ContourGroupNum,
            StartDate: timestamp ? timestamp.StartTime : "",
            EndDate: timestamp ? timestamp.CompleteTime : "",
            Time: time_diff(timestamp.StartTime, timestamp.CompleteTime)
        };
    });

    let uploadObj = {
        Object: "Upload",
        Name: "Upload",
        Index: -1,
        StartDate: data.uploadTime.StartTime,
        EndDate: data.uploadTime.CompleteTime
    };

    let splitterObj = {
        Object: "Splitter",
        Name: "Splitter",
        Index: 0,
        StartDate: data.splitterTime.StartTime,
        EndDate: data.splitterTime.CompleteTime
    };

    let mergerObj;
    if (data.mergerTime.StartTime && data.mergerTime.CompleteTime) {
        mergerObj = {
            Object: "Merger",
            Name: "Merger",
            Index: stats.length + 1,
            StartDate: data.mergerTime.StartTime,
            EndDate: data.mergerTime.CompleteTime
        };
    }

    let downloadObj;
    if (data.downloadTime.StartTime && data.downloadTime.CompleteTime) {
        downloadObj = {
            Object: "Download",
            Name: "Download",
            Index: stats.length + 2,
            StartDate: data.downloadTime.StartTime,
            EndDate: data.downloadTime.CompleteTime
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
        errorTime: localData?.errorTime,
        text: localData?.text
    }
}

// function time_diff(start_time, complete_time) {
//     let start = start_time.split(':').map(t => Number(t));
//     let start_sec = start[0] * 3600 + start[1] * 60 + start[2];
//     let complete = complete_time.split(':').map(t => Number(t));
//     let complete_sec = complete[0] * 3600 + complete[1] * 60 + complete[2];
//     let diff_sec = complete_sec - start_sec;
//     return diff_sec;
// }

function time_diff(start_time, complete_time) {
    return msecToHHMMSS(complete_time - start_time);
}

function msecToHHMMSS(time) {
    return new Date(time).toISOString().substr(11, 8);
}
