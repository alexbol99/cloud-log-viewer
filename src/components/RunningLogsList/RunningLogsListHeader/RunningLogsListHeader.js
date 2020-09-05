import React from 'react';
import Button from '../../../UI/Button/Button';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'

import styles from './RunningLogsListHeader.module.css'

function RunningLogsListHeader(props) {
    return (
        <header className={styles.RunningLogsListHeader}>
            <span>Amazon s3 ({props.awsRegion}) ></span>
            <span>
                <a href="https://s3.console.aws.amazon.com/s3/buckets/acp-cloud-logs/?region=eu-central-1&tab=overview#"
                   target="_blank" rel="noopener noreferrer">
                    acp-cloud-logs
                </a>
            </span>
            <span>
                <Button
                    title="Reload logs from S3 bucket"
                    icon={faSyncAlt}
                    spin={props.loading}
                    onClick={props.onRefreshButtonPressed}
                />
            </span>
        </header>
    );
}

export default RunningLogsListHeader;
