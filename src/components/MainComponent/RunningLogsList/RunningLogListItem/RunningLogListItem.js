import React, {useRef, useEffect, useState} from 'react';
import styles from './RunningLogListItem.module.css';
import FileContentPopup from "../../../FileContentPopup/FileContentPopup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons'

function RunningLogsListItem(props) {
    const [showFileContentPopup, setShowFileContentPopup] = useState(false);
    const refElement = useRef();

    useEffect( () => {
        if (props.data.selected) {
            scrollIntoView();
        }
    })

    const scrollIntoView = () => {
        const tableBody = refElement.current.parentElement;
        const table = tableBody.parentElement;
        const tableClientRect = table.getBoundingClientRect();
        const rowClientReact = refElement.current.getBoundingClientRect();
        if (rowClientReact.bottom > tableClientRect.bottom) {
            refElement.current.scrollIntoView(false);
        }
        if (rowClientReact.top < tableClientRect.top) {
            refElement.current.scrollIntoView(true);
        }
    }

    // Callback to display Log File Content Popup
    const showLogFileContentPopup = () => {
        setShowFileContentPopup(true)
    }

    const closeLogFileContentPopup = () => {
        setShowFileContentPopup(false)
    }

    const itemClicked = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.ctrlKey) {
            props.checkMarkClicked();
        }
        else if (e.shiftKey) {
            document.getSelection().empty();
            props.itemShiftClicked();
        }
        else {
            props.itemClicked();
        }
    }

    let style = props.data.selected ? styles.RunningLogListItemClicked : styles.RunningLogListItem;

    const batchFailed= !!props.data.errorTime;
    style = batchFailed ? `${style} ${styles.RunningLogListItemFailed}` : style;

    let checkMarkStyle = props.marked ?
        styles.RunningLogListItemCheckMarkClicked : styles.RunningLogListItemCheckMarkNotClicked;

    const actionsNum = props.data?.batch[props.data.batch.length - 1].ActNum;
    const layersNum = new Set(props.data?.batch.map(action => action.LayerName)).size;
    const stepName = props.data?.batch[0].StepName;
    const checklistName = props.data?.batch[0].ChecklistName;

    return (
        <>
            <tr className={style} onClick={itemClicked} ref={refElement}>
                <td className={checkMarkStyle}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                </td>
                <td>
                    {props.data.runningDate}
                </td>
                <td>
                    {props.data.jobName}
                </td>
                <td>
                    {stepName}
                </td>
                <td>
                    {checklistName}
                </td>
                <td className={styles.RunningLogListItemNumeric}>
                    {actionsNum}
                </td>
                <td className={styles.RunningLogListItemNumeric}>
                    {layersNum}
                </td>
                <td className={styles.RunningLogListItemNumeric}>
                    {props.data.batchJobsNum}
                </td>
                <td>
                    {props.data.runningTime || "Failed"}
                </td>
                <td>
                    <div onClick={showLogFileContentPopup} >
                        {props.data.key}
                    </div>
                </td>
            </tr>

            {showFileContentPopup ?
                <FileContentPopup
                    showFileContentPopup={showFileContentPopup}
                    closeFileContentPopup={closeLogFileContentPopup}
                    content={props.data.text}
                /> : null }

        </>
    );
}

export default RunningLogsListItem;
