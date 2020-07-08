import React from 'react';
import styles from './RunningLogsList.module.css';
import RunningLogsListItem from "./RunningLogListItem/RunningLogListItem";

function RunningLogsList(props) {
    return (
        <div className={styles.RunningLogsList}>
            <header>
                <span>Amazon s3 ></span>
                <span>
                    <a href="https://s3.console.aws.amazon.com/s3/buckets/acp-cloud-logs/?region=eu-central-1&tab=overview#">
                        acp-cloud-logs
                    </a>
                </span>
            </header>
            <table className={styles.RunningLogsListTable}>
                <thead>
                <tr>
                    <th>Running date</th>
                    <th>Job Name</th>
                    <th># Actions</th>
                    <th># Layers</th>
                    <th># ACPs</th>
                    <th>Running Time</th>
                    <th>S3 bucket key (filename)</th>
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

        </div>
    );
}

export default RunningLogsList;
