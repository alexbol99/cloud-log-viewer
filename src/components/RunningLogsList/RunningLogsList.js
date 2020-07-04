import React, {useState, useEffect} from 'react';
import styles from './RunningLogsList.module.css';
import * as d3 from "d3";
import {getChartData, parse} from "../../models/log-parser";
import RunningLogsListItem from "./RunningLogListItem/RunningLogListItem";

function RunningLogsList(props) {
    const [logsListData, setLogsListData] = useState(null);

    async function loadFiles() {
        let promises = props.urls_list.map (url => d3.text(url))
        let textArray = await Promise.all(promises)
        let dataArray = textArray.map(text => parse(text))
        return dataArray
    }

    useEffect( () => {
        const fetchData = async () => {
            const localDataArray = await loadFiles();
            const localLogsListData = localDataArray.map (localData => {
                const actionsNum = localData?.batch[localData.batch.length-1].ActNum;
                const layersNum = new Set(localData?.batch.map(action => action.LayerName)).size;
                return {
                    jobName: localData?.jobName,
                    actionsNum: actionsNum,
                    layersNum: layersNum,
                    runningTime: localData.runningTime
                }
            })
            setLogsListData(localLogsListData);
        };

        fetchData();
    });

    return (
        <table className={styles.RunningLogsList}>
            <thead>
                <tr>
                    <th>Job Name</th>
                    <th># Actions</th>
                    <th># Layers</th>
                    <th>Running Time</th>
                </tr>
            </thead>
            <tbody>
                {logsListData?.map( (data, index) =>
                    <RunningLogsListItem key={index}
                                         data={data}
                                         selected={props.selectedIndex==index}
                                         itemClicked={() => props.logItemClicked(index)}
                    />
                )}
            </tbody>
        </table>
    );
}

export default RunningLogsList;
