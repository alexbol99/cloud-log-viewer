import React from 'react';
import Button from '../../../UI/Button/Button';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import FileUploadButton from "../../FileUploadButton/FileUploadButton";
import styles from './RunningLogsListHeader.module.css'

function RunningLogsListHeader(props) {
    return (
        <header className={styles.RunningLogsListHeader}>
            <FileUploadButton
                onUploadSucceed={props.onUploadSucceed}
            />
            <Button
                title="Delete log file from S3"
                text="Delete"
                // icon={faSyncAlt}
                // spin={props.loading}
                onClick={props.onDeleteButtonPressed}
            />
            <Button
                title="Compare two logs"
                text="Compare"
                // icon={faSyncAlt}
                // spin={props.loading}
                // onClick={props.onDeleteButtonPressed}
            />
            <Button
                title="Reload logs from S3 bucket"
                icon={faSyncAlt}
                spin={props.loading}
                onClick={props.onRefreshButtonPressed}
            />

            {/*<span>Amazon s3 ({props.awsRegion}) ></span>*/}
            {/*<span>*/}
            {/*    <a href="https://s3.console.aws.amazon.com/s3/buckets/acp-cloud-logs/?region=eu-central-1&tab=overview#"*/}
            {/*       target="_blank" rel="noopener noreferrer">*/}
            {/*        acp-cloud-logs*/}
            {/*    </a>*/}
            {/*</span>*/}
            {/*<span>*/}
            {/*</span>*/}
        </header>
    );
}

export default RunningLogsListHeader;
