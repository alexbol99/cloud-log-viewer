import React, {useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './RunningLogsListTable.module.css';
import RunningLogsListItem from "../RunningLogListItem/RunningLogListItem";

function RunningLogsListTable(props) {
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

    const fetchMoreData = () => {
        // alert("Fetch more data")
        // props.fetchMoreData();
    }

    return (
        <div>
            <InfiniteScroll
                dataLength={props.logsListData?.length}
                next={fetchMoreData}
                hasMore={false}
            >

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
            </InfiniteScroll>

        </div>
    );
}

export default RunningLogsListTable;
