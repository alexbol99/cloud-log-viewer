import React, {useEffect, useState} from 'react';
import styles from './MainComponent.module.css';
import RunningLogsList from "../RunningLogsList/RunningLogsList";
import VegaLiteChart from "../VegaLiteChart/VegaLiteChart";
import {getChartData, getListData} from "../../models/logData";
import {parse} from "../../models/logParser";

function MainComponent(props) {
    const [logDataArray, setLogDataArray] = useState([]);
    const [index, setIndex] = useState(0);

    let logsListData = [];
    let chartData = null;
    let runData = null;

    async function loadFiles() {
        let logs_api_uri = "https://bah2tkltg6.execute-api.eu-central-1.amazonaws.com/test/list";

        let response = await fetch(logs_api_uri);
        let resp_json_str = await response.json()
        let keys_list = JSON.parse(resp_json_str.body).keys;

        let promises = keys_list.map (key => fetch(`${logs_api_uri}/${key}`))
        let respArray = await Promise.all(promises)
        let json_promises = respArray.map(resp => resp.json())
        let textArray = await Promise.all(json_promises);
        let dataArray = textArray.map( e => parse(e.text));
        dataArray.forEach( (data,i) => data.key = keys_list[i] )
        dataArray.sort(function(a,b){
            return new Date(b.runningDate) - new Date(a.runningDate);
        });
        return dataArray;
    }

    // Effect to load all data from AWS s3
    useEffect( () => {
        const fetchData = async () => {
            const localDataArray = await loadFiles();
            // If all data loaded, render list and select first row
            if (localDataArray.length > 0) {
                setLogDataArray(localDataArray);             // trigger rendering
            }
        };

        if (logDataArray.length === 0) {
            fetchData();
        }
    });

    // Callback to set new chart data and update selected index
    const logItemClicked = (index) => {
        setIndex(index);                                     // trigger rendering
    }

    // Setup data before rendering
    if (logDataArray.length > 0) {
        logsListData = logDataArray.map(data => getListData(data))

        let localData = logDataArray[index];
        chartData = localData.runningTime ? getChartData(localData) : null;
        runData = getListData(localData);
    }

    return (
        <main className={styles.MainComponent}>
            <RunningLogsList
                logsListData={logsListData}
                selectedIndex={index}
                logItemClicked={logItemClicked}/>
            <VegaLiteChart data={chartData} runData={runData} />
        </main>
    );
}

export default MainComponent;
