import React from 'react';
import styles from './RunningLogsList.module.css';
import RunningLogsListHeader from "./RunningLogsListHeader/RunningLogsListHeader";
import RunningLogsListTable from "./RunningLogsListTable/RunningLogsListTable";

function RunningLogsList(props) {
    return (
        <div className={styles.RunningLogsList}>
            <RunningLogsListHeader
                awsRegion = {props.awsRegion}
                loading={props.loading}
                onUploadSucceed={props.onUploadSucceed}
                onDeleteButtonPressed={props.onDeleteButtonPressed}
                onRefreshButtonPressed={props.onRefreshButtonPressed}
            />

            <RunningLogsListTable
                logsListData={props.logsListData}
                selectedIndex={props.selectedIndex}
                logItemClicked={props.logItemClicked}
                fetchMoreData={props.onRefreshButtonPressed}
            />

        </div>
    );
}

export default RunningLogsList;
