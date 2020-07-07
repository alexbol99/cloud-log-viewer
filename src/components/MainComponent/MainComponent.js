import React, {useEffect, useState} from 'react';
import styles from './MainComponent.module.css';
import RunningLogsList from "../RunningLogsList/RunningLogsList";
import VegaLiteChart from "../VegaLiteChart/VegaLiteChart";
import {getChartData, getListData} from "../../models/log-parser";

import axios from "axios";


function MainComponent(props) {
    const [logDataArray, setLogDataArray] = useState([]);
    const [logsListData, setLogsListData] = useState([]);

    const [chartData, setChartData] = useState(null);
    const [runData, setRunData] = useState(null);
    const [index, setIndex] = useState(0);

    async function loadFiles() {
        let logs_api_uri = "https://bah2tkltg6.execute-api.eu-central-1.amazonaws.com/test/list";

        let resp = await axios.get(logs_api_uri);
        let keys_list = JSON.parse(resp.data.body).keys;

        let promises = keys_list.map (key => axios.get(`${logs_api_uri}/${key}`))
        let respArray = await Promise.all(promises)
        let dataArray = respArray.map(resp => resp.data);

        return dataArray;
    }

    // Effect to load all data from AWS s3
    useEffect( () => {
        const fetchData = async () => {
            const localDataArray = await loadFiles();
            if (localDataArray.length > 0) {
                setLogDataArray(localDataArray);           // all the data
            }
        };

        if (logDataArray.length === 0) {
            fetchData();
        }
    });

    // Effect to update list to be displayed
    useEffect( () => {
        if (logDataArray.length > 0) {
            const localLogsListData = logDataArray.map(data => getListData(data))
            setLogsListData(localLogsListData)
        }
    }, [logDataArray])

    // Effect to update chart on click on a row in the list
    useEffect(() => {
        if (logDataArray.length > 0) {
            const localData = logDataArray[index];
            const localChartData = localData.runningTime ? getChartData(localData) : null;
            const localRunData = getListData(localData);

            setChartData(localChartData);              // chart data for selected log in the list
            setRunData(localRunData);                  // run data for selected row in the list, help to build chart
        }
    }, [logDataArray, index]);


    // Effect to update current index
    const logItemClicked = (index) => {
        setIndex(index);
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
