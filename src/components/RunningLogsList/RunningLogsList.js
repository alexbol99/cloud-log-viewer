import React from 'react';
import styles from './RunningLogsList.module.css';
import RunningLogsListItem from "./RunningLogListItem/RunningLogListItem";

function RunningLogsList(props) {
    return (
        <table className={styles.RunningLogsList}>
            <thead>
                <tr>
                    <th>Job Name</th>
                    <th># Actions</th>
                    <th># Layers</th>
                    <th>Running Time</th>
                </tr>
            </thead>
            <tbody>
                {props.logsListData?.map( (data, index) =>
                    <RunningLogsListItem key={index}
                                         data={data}
                                         selected={props.selectedIndex===index}
                                         itemClicked={() => props.logItemClicked(index)}
                    />
                )}
            </tbody>
        </table>
    );
}

export default RunningLogsList;
