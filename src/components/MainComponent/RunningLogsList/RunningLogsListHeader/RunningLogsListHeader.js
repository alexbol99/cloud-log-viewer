import Button from '../../../../UI/Button/Button';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import FileUploadButton from "../../../FileUploadButton/FileUploadButton";
import styles from './RunningLogsListHeader.module.css'

function RunningLogsListHeader(props) {
    return (
        <header className={styles.RunningLogsListHeader}>
            <FileUploadButton
                onUploadSucceed={props.onUploadSucceed}
            />
            <Button
                title="Delete log files"
                text="Delete"
                // icon={faSyncAlt}
                // spin={props.loading}
                onClick={props.onDeleteButtonPressed}
            />
            {/*<Button*/}
            {/*    title="Compare two logs"*/}
            {/*    text="Compare"*/}
            {/*    // icon={faSyncAlt}*/}
            {/*    // spin={props.loading}*/}
            {/*    // onClick={props.onDeleteButtonPressed}*/}
            {/*/>*/}
            <Button
                title="Reload files"
                icon={faSyncAlt}
                spin={props.loading}
                onClick={props.onRefreshButtonPressed}
            />

        </header>
    );
}

export default RunningLogsListHeader;
