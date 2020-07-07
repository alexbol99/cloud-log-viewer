import React from 'react';
import styles from './RunningLogListItem.module.css';

function RunningLogsListItem(props) {
    let style = props.selected ? styles.RunningLogListItemClicked : styles.RunningLogListItem
    return (
        <tr className={style} onClick={props.itemClicked}>
            <td className={styles.RunningLogListItemJobName}>
                {props.data.jobName}
            </td>
            <td className={styles.RunningLogListItemNumActions}>
                {props.data.actionsNum}
            </td>
            <td className={styles.RunningLogListItemNumLayers}>
                {props.data.layersNum}
            </td>
            <td className={styles.RunningLogListItemRunningTime}>
                {props.data.runningTime || "Failed"}
            </td>
        </tr>
    );
}

export default RunningLogsListItem;
