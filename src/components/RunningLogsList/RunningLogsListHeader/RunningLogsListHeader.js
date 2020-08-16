import React from 'react';
import Button from '../../../UI/Button/Button';

import styles from './RunningLogsListHeader.module.css'

function RunningLogsListHeader(props) {
    return (
        <header className={styles.RunningLogsListHeader}>
            <span>Amazon s3 ></span>
            <span>
                <a href="https://s3.console.aws.amazon.com/s3/buckets/acp-cloud-logs/?region=eu-central-1&tab=overview#"
                   target="_blank" rel="noopener noreferrer">
                    acp-cloud-logs
                </a>
            </span>
            <span>
                <Button
                    title="Refresh"
                    iconName="sync-alt"
                    spin={props.loading}
                    onClick={props.onRefreshButtonPressed}
                />
            </span>
        </header>
    );
}

export default RunningLogsListHeader;
