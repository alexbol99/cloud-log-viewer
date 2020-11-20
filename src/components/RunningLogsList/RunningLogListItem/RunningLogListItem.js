import React, {useRef, useEffect, useState} from 'react';
import styles from './RunningLogListItem.module.css';
import FileContentPopup from "../../FileContentPopup/FileContentPopup";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
    style = props.batchFailed ? `${style} ${styles.RunningLogListItemFailed}` : style;
    // let object_url = "https://s3.console.aws.amazon.com/s3/object/acp-cloud-logs/"+props.data.key;

    let checkMarkStyle = props.marked ?
        styles.RunningLogListItemCheckMarkClicked : styles.RunningLogListItemCheckMarkNotClicked;

    return (
        <>
            <tr className={style} onClick={itemClicked} ref={refElement}>
                    <td>
                        <h4 className={checkMarkStyle}>
                            {/*✓*/}
                            {/*<FontAwesomeIcon icon="trash" />*/}
                            X
                        </h4>
                    </td>
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
                    <div onClick={showLogFileContentPopup} >
                        {props.data.key}
                    </div>
                    {/*<a href={object_url} target="_blank" rel="noopener noreferrer">*/}
                    {/*    {props.data.key}*/}
                    {/*</a>*/}
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
