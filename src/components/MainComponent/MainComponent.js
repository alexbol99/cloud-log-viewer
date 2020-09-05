import React, {useEffect, useState} from 'react';
import styles from './MainComponent.module.css';
import RunningLogsList from "../RunningLogsList/RunningLogsList";
import VegaLiteChart from "../VegaLiteChart/VegaLiteChart";
import {getChartData, getListData} from "../../models/logData";
import {parse} from "../../models/logFileParser";

function MainComponent(props) {
    const [logDataArray, setLogDataArray] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const numInChunk = 8;
    let logsListData = [];
    let chartData = null;
    let runData = null;
    let awsRegion = "eu-central-1";
    let api_uri = "https://bah2tkltg6.execute-api.eu-central-1.amazonaws.com/test/list";

    // Fetch keys list (filenames) from s3 bucket using given api
    const fetchKeysList = async() => {
        let response = await fetch(api_uri);
        let json = await response.json();
        let keysList = JSON.parse(json.body).keys;
        return keysList;
    }

    // Fetch content of files from s3 bucket by given list of keys
    const fetchDataByKeysList = async (keysList) => {
        let promises = keysList.map (key => fetch(`${api_uri}/${key}`))
        let respArray = await Promise.all(promises)
        let json_promises = respArray.map(resp => resp.json())
        let textArray = await Promise.all(json_promises);
        let dataArray = textArray.map( e => parse(e.text));
        dataArray.forEach( (data,i) => data.key = keysList[i] )
        dataArray.forEach( (data,i) => data.text = textArray[i].text )
        return dataArray;
    }

    // const fetchAllData = async () => {
    //     setLoading(true);
    //
    //     let keysList = await fetchKeysList(api_uri);
    //     let localDataArray = await fetchDataByKeysList(keysList);
    //
    //     localDataArray.sort(function(a,b){
    //         return new Date(b.runningDate) - new Date(a.runningDate);
    //     });
    //
    //     // If all data loaded, render list and select first row
    //     if (localDataArray.length > 0) {
    //         setLoading(false);
    //         setLogDataArray(localDataArray);             // trigger rendering
    //     }
    // };

    // const fetchNewData = async () => {
    //     setLoading(true);
    //
    //     let keysList = await fetchKeysList(api_uri);
    //     let filteredKeysList = filterNewKeysList(keysList);
    //
    //     let newDataArray = await fetchDataByKeysList(filteredKeysList);
    //
    //     let localDataArray = logDataArray.concat(newDataArray);
    //
    //     localDataArray.sort(function(a,b){
    //         return new Date(b.runningDate) - new Date(a.runningDate);
    //     });
    //
    //     // If all data loaded, render list and select first row
    //     if (localDataArray.length > 0) {
    //         setLoading(false);
    //         setLogDataArray(localDataArray);             // trigger rendering
    //     }
    // }

    const fetchMoreData = async () => {
        setLoading(true);

        let keysList = await fetchKeysList(api_uri);
        let filteredKeysList = filterNewKeysList(keysList);
        let chunkOfKeysList = keysList.slice(0,numInChunk);
        let newDataArray = await fetchDataByKeysList(chunkOfKeysList);

        let localDataArray = logDataArray.concat(newDataArray);

        localDataArray.sort(function(a,b){
            return new Date(b.runningDate) - new Date(a.runningDate);
        });

        // If all data loaded, render list and select first row
        if (localDataArray.length > 0) {
            setLoading(false);
            setLogDataArray(localDataArray);             // trigger rendering
        }
    }

    // Filter keysList: keep only new keys that do not exist in logDataArray
    const filterNewKeysList = (keysList) => {
        let filteredKeyList = keysList
            .filter( key => !logDataArray.some( data => data.key === key))
        return filteredKeyList;
    }

    const syncData = () => {
        fetchMoreData()
        // setLoading(true)
    }

    // Effect to load all data from AWS s3 bucket after component mounted
    useEffect( () => {
        if (logDataArray.length === 0) {
            fetchMoreData();
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
        try {
            chartData = getChartData(localData);
        }
        catch (e) {
            chartData = null;
        }

        runData = getListData(localData);
    }

    return (
        <main className={styles.MainComponent}>
            <RunningLogsList
                awsRegion = {awsRegion}
                logsListData={logsListData}
                selectedIndex={index}
                loading={loading}
                logItemClicked={logItemClicked}
                onRefreshButtonPressed={syncData}
            />
            <VegaLiteChart data={chartData} runData={runData} />
        </main>
    );
}

export default MainComponent;
