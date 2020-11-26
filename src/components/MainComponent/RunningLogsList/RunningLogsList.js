import React from 'react';
import RunningLogsListHeader from "./RunningLogsListHeader/RunningLogsListHeader";
import RunningLogsListTable from "./RunningLogsListTable/RunningLogsListTable";
import {getListData} from "../../../models/logData";
import SearchInputComponent from "./SearchInputComponent/SearchInputComponent";
import styles from './RunningLogsList.module.css';

function RunningLogsList(props) {
    return (
        <div className={styles.RunningLogsList}>
            <RunningLogsListHeader
                loading={props.loading}
                onUploadSucceed={props.onUploadSucceed}
                onDeleteButtonPressed={props.onDeleteButtonPressed}
                onRefreshButtonPressed={props.onRefreshButtonPressed}
            />

            <SearchInputComponent
                onChange={props.onSearchJobNameChanged}
            />

            <RunningLogsListTable
                logDataArray={props.logDataArray}
                selectedIndex={props.selectedIndex}
                logItemClicked={props.logItemClicked}
                logItemShiftClicked={props.logItemShiftClicked}
                checkMarkClicked={props.checkMarkClicked}
                fetchMoreData={props.onRefreshButtonPressed}
            />

        </div>
    );
}

export default RunningLogsList;
