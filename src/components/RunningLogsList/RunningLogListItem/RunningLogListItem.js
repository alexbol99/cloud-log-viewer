import React from 'react';
import styles from './RunningLogListItem.module.css';

function RunningLogsListItem(props) {
    let style = props.selected ? styles.RunningLogListItemClicked : styles.RunningLogListItem
    let object_url = "https://s3.console.aws.amazon.com/s3/object/acp-cloud-logs/"+props.data.key;
    return (
        <tr className={style} onClick={props.itemClicked}>
            <td>
                {props.data.runningDate}
            </td>
            <td>
                {props.data.jobName}
            </td>
            <td>
                {props.data.step}
            </td>
            <td>
                {props.data.checklist}
            </td>
            <td className={styles.RunningLogListItemNumeric}>
                {props.data.actionsNum}
            </td>
            <td className={styles.RunningLogListItemNumeric}>
                {props.data.layersNum}
            </td>
            <td className={styles.RunningLogListItemNumeric}>
                {props.data.batchJobsNum}
            </td>
            <td>
                {props.data.runningTime || "Failed"}
            </td>
            <td>
                <a href={object_url}>
                    {props.data.key}
                </a>
            </td>
        </tr>
    );
}

export default RunningLogsListItem;
