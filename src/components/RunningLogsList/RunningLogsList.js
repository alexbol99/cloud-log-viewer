import React from 'react';
import styles from './RunningLogsList.module.css';
import RunningLogsListHeader from "./RunningLogsListHeader/RunningLogsListHeader";
import RunningLogsListTable from "./RunningLogsListTable/RunningLogsListTable";

function RunningLogsList(props) {
    return (
        <div className={styles.RunningLogsList}>
            <RunningLogsListHeader
                loading={props.loading}
                onRefreshButtonPressed={props.onRefreshButtonPressed}
            />

            <RunningLogsListTable
                logsListData={props.logsListData}
                selectedIndex={props.selectedIndex}
                logItemClicked={props.logItemClicked}
            />

        </div>
    );
}

export default RunningLogsList;
