import React, {useEffect} from 'react';
import styles from './RunningLogsList.module.css';
import RunningLogsListItem from "./RunningLogListItem/RunningLogListItem";
import RunningLogsListHeader from "./RunningLogsListHeader/RunningLogsListHeader";

function RunningLogsList(props) {
    useEffect( () => {
        const handleKeyDown = (e) => {
            switch (e.code) {
                case "ArrowDown":
                    e.stopPropagation();
                    e.preventDefault();
                    if (props.selectedIndex < props.logsListData.length-1) {
                        props.logItemClicked(props.selectedIndex+1);
                    }
                    break;
                case "ArrowUp":
                    e.stopPropagation();
                    e.preventDefault();
                    if (props.selectedIndex > 0) {
                        props.logItemClicked(props.selectedIndex-1);
                    }
                    break;
                default:
                    break;
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    })

    return (
        <div className={styles.RunningLogsList}>
            <RunningLogsListHeader
                loading={props.loading}
                onRefreshButtonPressed={props.onRefreshButtonPressed}
            />
            {/*<header>*/}
            {/*    <span>Amazon s3 ></span>*/}
            {/*    <span>*/}
            {/*        <a href="https://s3.console.aws.amazon.com/s3/buckets/acp-cloud-logs/?region=eu-central-1&tab=overview#"*/}
            {/*           target="_blank" rel="noopener noreferrer">*/}
            {/*            acp-cloud-logs*/}
            {/*        </a>*/}
            {/*    </span>*/}
            {/*</header>*/}
            <table className={styles.RunningLogsListTable}>
                <thead>
                    <tr>
                        <th>Running date</th>
                        <th>Job Name</th>
                        <th>Step</th>
                        <th>Checklist</th>
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
                                             batchFailed={!!data.errorTime}
                                             itemClicked={() => props.logItemClicked(index)}
                        />
                    )}
                </tbody>
            </table>

        </div>
    );
}

export default RunningLogsList;
