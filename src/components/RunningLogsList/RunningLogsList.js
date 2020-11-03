import React from 'react';
import styles from './RunningLogsList.module.css';
// import RunningLogsListHeader from "./RunningLogsListHeader/RunningLogsListHeader";
import RunningLogsListTable from "./RunningLogsListTable/RunningLogsListTable";
import FileUploadButton from "../FileUploadButton/FileUploadButton";

function RunningLogsList(props) {
    return (
        <div className={styles.RunningLogsList}>
            <FileUploadButton
                onUploadSucceed={props.onUploadSucceed}
            />
            {/*<RunningLogsListHeader*/}
            {/*    awsRegion = {props.awsRegion}*/}
            {/*    loading={props.loading}*/}
            {/*    onRefreshButtonPressed={props.onRefreshButtonPressed}*/}
            {/*/>*/}

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
