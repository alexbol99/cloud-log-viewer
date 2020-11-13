import React, {useEffect, useState} from 'react';
import styles from './MainComponent.module.css';
import RunningLogsList from "../RunningLogsList/RunningLogsList";
import VegaLiteChart from "../VegaLiteChart/VegaLiteChart";
import {getChartData, getListData} from "../../models/logData";
import {parse} from "../../models/logFileParser";
import {fetchFileContentByKeysList, fetchKeysList, deleteFilesFromS3} from "../../models/aws_api";

function MainComponent(props) {
    const [logDataArray, setLogDataArray] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const numInChunk = 8;
    let logsListData = [];
    let chartData = null;
    let runData = null;

    // Fetch content of files from s3 bucket by given list of keys
    const fetchDataByKeysList = async (keysList) => {
        let textArray = await fetchFileContentByKeysList(keysList);
        let dataArray = textArray.map( e => parse(e.text));
        dataArray.forEach( (data,i) => data.key = keysList[i] )
        dataArray.forEach( (data,i) => data.text = textArray[i].text )
        return dataArray;
    }

    const fetchMoreData = async (keysListToFetch) => {
        setLoading(true);

        let keysList = keysListToFetch || await fetchKeysList();
        let filteredKeysList = filterNewKeysList(keysList);

        let chunkOfKeysList = filteredKeysList.slice(0,numInChunk);
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

    const fetchUploaded = (keysList) => {
        fetchMoreData(keysList)
    }

    // Callback to set new chart data and update selected index
    const logItemClicked = (index) => {
        setIndex(index);                                     // trigger rendering
    }

    const deleteFile = async () => {
        if (!index) return
        let logFileData = logDataArray[index];
        let key = logFileData.key;
        alert(`file ${logFileData.key} will be deleted`)

        let deletedKeys = await deleteFilesFromS3([key]);
        let newLogDataArray = logDataArray.filter( data => !deletedKeys.includes(data.key));
        setLogDataArray(newLogDataArray);             // trigger rendering
    }

    // Effect to load all data from AWS s3 bucket after component mounted
    useEffect( () => {
        if (logDataArray.length === 0) {
            fetchMoreData();
        }
    });

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
                logsListData={logsListData}
                selectedIndex={index}
                loading={loading}
                logItemClicked={logItemClicked}
                onUploadSucceed={fetchUploaded}
                onDeleteButtonPressed={deleteFile}
                onRefreshButtonPressed={syncData}
            />
            <VegaLiteChart data={chartData} runData={runData} />
        </main>
    );
}

export default MainComponent;
