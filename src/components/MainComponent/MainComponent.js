import React, {useEffect, useState} from 'react';
import styles from './MainComponent.module.css';
import RunningLogsList from "../RunningLogsList/RunningLogsList";
import VegaLiteChart from "../VegaLiteChart/VegaLiteChart";
import {getChartData, getListData} from "../../models/logData";
import {parse} from "../../models/logFileParser";
import {fetchFileContentByKeysList, fetchFileContent, fetchKeysList, deleteFilesFromS3} from "../../models/aws_api";

function MainComponent(props) {
    const [logDataArray, setLogDataArray] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const numInChunk = 8;
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

    // Fetch content of one file from s3 bucket by given key
    const fetchData = async (key, ind) => {
        let text = await fetchFileContent(key);
        let data = parse(text.text);
        data.key = ind;
        data.text = text.text;
        return data;
    }

    const fetchMoreData = async (keysListToFetch) => {
        // setLoading(true);

        let keysList = keysListToFetch || await fetchKeysList();
        let filteredKeysList = filterNewKeysList(keysList);

        let chunkOfKeysList = filteredKeysList.slice(0,numInChunk);

        // for (let i=0; i < chunkOfKeysList; i++) {
        //     let data = await fetchData(chunkOfKeysList[i], i);
        //     let newDataArray = logDataArray.slice();
        //     newDataArray.push(data);
        //     newDataArray.sort(function(a,b){
        //         return new Date(b.runningDate) - new Date(a.runningDate);
        //     });
        //     if (newDataArray.length === 1) {
        //         newDataArray[0].marked = true;
        //     }
        //     setLogDataArray(newDataArray);             // trigger rendering
        // }

        let newDataArray = await fetchDataByKeysList(chunkOfKeysList);
        let localDataArray = logDataArray.concat(newDataArray);
        localDataArray.sort(function(a,b){
            return new Date(b.runningDate) - new Date(a.runningDate);
        });

        // If all data loaded, render list and select first row
        if (localDataArray.length > 0) {
            // setLoading(false);
            localDataArray[0].marked = true;
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
    const logItemClicked = (clickedIndex) => {
        let newLogDataArray = logDataArray.slice();
        newLogDataArray.forEach( (data, i) => data.marked = (i === clickedIndex));
        setLogDataArray(newLogDataArray);             // trigger rendering
        setIndex(clickedIndex);                       // trigger rendering
    }

    const checkMarkClicked = (clickedIndex) => {
        if (clickedIndex === index) return;
        let newLogDataArray = logDataArray.slice();
        newLogDataArray.forEach( (data, i) =>
            i === clickedIndex ? data.marked = !data.marked : data.marked);
        setLogDataArray(newLogDataArray);             // trigger rendering
    }

    const deleteFile = async () => {
        let keysToDelete = logDataArray
            .filter( data => data.marked )
            .map( data => data.key);
        if (keysToDelete.length === 0) return;
        let keyStr = keysToDelete.join("\n");
        let message = keysToDelete.length === 1 ?
            `1 file will be deleted:\n ${keyStr}` :
            `${keysToDelete.length} files will be deleted:\n ${keyStr}`;
        let ok = window.confirm(message);
        if (ok) {
            let deletedKeys = await deleteFilesFromS3(keysToDelete);
            let newLogDataArray = logDataArray.filter(data => !deletedKeys.includes(data.key));
            // setLoading(true);
            if (newLogDataArray.length > 0) {
                setLogDataArray(newLogDataArray);             // trigger rendering
                setIndex(0);
            }
        }
    }

    // Effect to load all data from AWS s3 bucket after component mounted
    useEffect( () => {
        if (logDataArray.length === 0) {
            fetchMoreData();
        }
    });

    // Setup data before rendering
    if (logDataArray.length > 0) {
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
                logDataArray={logDataArray}
                selectedIndex={index}
                loading={loading}
                logItemClicked={logItemClicked}
                checkMarkClicked={checkMarkClicked}
                onUploadSucceed={fetchUploaded}
                onDeleteButtonPressed={deleteFile}
                onRefreshButtonPressed={syncData}
            />
            <VegaLiteChart data={chartData} runData={runData} />
        </main>
    );
}

export default MainComponent;
