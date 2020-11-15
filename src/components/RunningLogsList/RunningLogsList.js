import React from 'react';
import styles from './RunningLogsList.module.css';
import RunningLogsListHeader from "./RunningLogsListHeader/RunningLogsListHeader";
import RunningLogsListTable from "./RunningLogsListTable/RunningLogsListTable";
import {getListData} from "../../models/logData";

function RunningLogsList(props) {
    // Setup data before rendering
    let logsListData = [];
    if (props.logDataArray.length > 0) {
        logsListData = props.logDataArray.map(data => getListData(data))
    }
    return (
        <div className={styles.RunningLogsList}>
            <RunningLogsListHeader
                loading={props.loading}
                onUploadSucceed={props.onUploadSucceed}
                onDeleteButtonPressed={props.onDeleteButtonPressed}
                onRefreshButtonPressed={props.onRefreshButtonPressed}
            />

            <RunningLogsListTable
                logsListData={logsListData}
                selectedIndex={props.selectedIndex}
                logItemClicked={props.logItemClicked}
                checkMarkClicked={props.checkMarkClicked}
                fetchMoreData={props.onRefreshButtonPressed}
            />

        </div>
    );
}

export default RunningLogsList;
