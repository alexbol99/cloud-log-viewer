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
                hasMore={true}
            >

                <table className={styles.RunningLogsListTable}>
                    <thead>
                    <tr>
                        <th style={{width:"15%"}}>Running date</th>
                        <th style={{width:"25%"}}>Job Name</th>
                        <th style={{width:"3%"}}>Step</th>
                        <th style={{width:"15%"}}>Checklist</th>
                        <th style={{width:"5%"}}># Actions</th>
                        <th style={{width:"5%"}}># Layers</th>
                        <th style={{width:"5%"}}># ACPs</th>
                        <th style={{width:"4%"}}>Running Time</th>
                        <th style={{width:"13%"}}>S3 bucket key (filename)</th>
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
