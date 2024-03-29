import {useEffect, useState} from 'react';
import styles from './MainComponent.module.css';
import RunningLogsList from "./RunningLogsList/RunningLogsList";
import ChartAreaComponent from "./ChartAreaComponent/ChartAreaComponent";
import {parse} from "../../models/logFileParser";
import {/*fetchFileContentByKeysList,*/ fetchFileContent, fetchKeysList, deleteFilesFromS3} from "../../models/aws_api";

function MainComponent(props) {
    const [logDataArray, setLogDataArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchJobNamePattern, setSearchJobNamePattern] = useState("");
    const [keysListToFetch, setKeysListToFetch] = useState([]);
    const [needToFetch, setNeedToFetch] = useState(true);

    // const fetchData = async (localDataArray, key, index) => {
    //     return new Promise( async (resolve, reject) => {
    //         try {
    //             let text = await fetchFileContent(key);
    //             let data = parse(text.text);
    //             data.key = key;
    //             data.text = text.text;
    //             data.marked = false;
    //             data.selected = false;
    //
    //             localDataArray[index] = data;
    //             let newDataArray = logDataArray.concat(localDataArray);
    //             newDataArray.filter (data => data !== undefined)
    //             setLogDataArray(newDataArray);             // trigger rendering
    //             resolve(data);
    //         }
    //         catch (err) {
    //             reject(err.message)
    //         }
    //     })
    // }

    useEffect( async() => {
        let localDataArray = [];
        let newDataArray = [];

        // Filter keysList: keep only new keys that do not exist in logDataArray
        const filterNewKeysList = (keysList) => {
            let filteredKeyList = keysList
                .filter( key => !logDataArray.some( data => data.key === key))
            return filteredKeyList;
        }

        // Fetch content of one file from s3 bucket by given key
        const fetchData = async (localDataArray, key, index) => {
            return new Promise( async (resolve, reject) => {
                try {
                    let text = await fetchFileContent(key);
                    let data = parse(text.text);
                    data.key = key;
                    data.text = text.text;
                    data.marked = false;
                    data.selected = false;

                    localDataArray[index] = data;
                    let newDataArray = logDataArray.concat(localDataArray);
                    newDataArray.filter (data => data !== undefined)
                    // setLogDataArray(newDataArray);             // trigger rendering
                    resolve(data);
                }
                catch (err) {
                    reject(err.message)
                }
            })
        }

        const fetchMoreData = async (keysListToFetch) => {
            let keysList = keysListToFetch.length > 0 ? keysListToFetch : await fetchKeysList();
            let filteredKeysList = filterNewKeysList(keysList);

            // let chunkOfKeysList = filteredKeysList.slice(0,numInChunk);
            if (filteredKeysList.length > 0) {
                localDataArray = new Array(filteredKeysList.length);
                let promises = filteredKeysList.map( (key, index) => fetchData(localDataArray, key, index));
                try {
                    let res = await Promise.allSettled(promises);
                    let fetchedDataArray = res.filter(p => p.status === "fulfilled").map(p => p.value);
                    newDataArray = logDataArray.concat(fetchedDataArray);
                    newDataArray.sort(function(a,b){
                        return new Date(b.runningDate) - new Date(a.runningDate);
                    });
                    if (!newDataArray.some(data => data.marked)) {
                        newDataArray[0].marked = true;
                    }
                    if (!newDataArray.some(data => data.selected)) {
                        newDataArray[0].selected = true;
                    }

                } catch (err) {
                    console.log(err.message)
                }
            }
            return newDataArray;
        }

        if (needToFetch) {
            setLoading(true);
            let newDataArray = await fetchMoreData(keysListToFetch);
            setNeedToFetch(false);                // stop racing condition
            setLogDataArray(newDataArray);              // trigger rendering
            setLoading(false);                    // stop loader
            setKeysListToFetch([]);               // clean
        }

    },[keysListToFetch, needToFetch, logDataArray]);

    // const fetchMoreData = async (keysListToFetch) => {
    //     setLoading(true);
    //
    //     let keysList = keysListToFetch || await fetchKeysList();
    //     let filteredKeysList = filterNewKeysList(keysList);
    //     // let chunkOfKeysList = filteredKeysList.slice(0,numInChunk);
    //     if (filteredKeysList.length > 0) {
    //         let localDataArray = new Array(filteredKeysList.length);
    //         let promises = filteredKeysList.map( (key, index) => fetchData(localDataArray, key, index));
    //         try {
    //             let res = await Promise.allSettled(promises);
    //             let fetchedDataArray = res.filter(p => p.status === "fulfilled").map(p => p.value);
    //             let newDataArray = logDataArray.concat(fetchedDataArray);
    //             newDataArray.sort(function(a,b){
    //                 return new Date(b.runningDate) - new Date(a.runningDate);
    //             });
    //             if (!newDataArray.some(data => data.marked)) {
    //                 newDataArray[0].marked = true;
    //             }
    //             if (!newDataArray.some(data => data.selected)) {
    //                 newDataArray[0].selected = true;
    //             }
    //             setLogDataArray(newDataArray);             // trigger rendering
    //         } catch (err) {
    //             console.log(err.message)
    //         }
    //     }
    //
    //     setLoading(false);
    // }


    const syncData = () => {
        // fetchMoreData()
        setNeedToFetch(true);
    }

    const fetchUploaded = (keysList) => {
        setKeysListToFetch(keysList);
        setNeedToFetch(true);
        // fetchMoreData(keysList)
    }

    // Callback to set new chart data and update selected index
    const logItemClicked = (clickedData) => {
        if (!clickedData) return;
        let newLogDataArray = logDataArray.slice();
        let clickedIndex = newLogDataArray.findIndex( data => data.key === clickedData.key);
        newLogDataArray.forEach( (data, i) => {
            data.marked = (i === clickedIndex);
            data.selected = (i === clickedIndex);
        });
        setLogDataArray(newLogDataArray);             // trigger rendering
    }

    const logItemShiftClicked = (clickedData) => {
        if (!clickedData) return;
        let newLogDataArray = logDataArray.slice();
        let clickedIndex = newLogDataArray.findIndex( data => data.key === clickedData.key);
        newLogDataArray.forEach( (data, i) =>
            i === clickedIndex ? data.selected = !data.selected : data.selected);
        setLogDataArray(newLogDataArray);             // trigger rendering
    }

    const checkMarkClicked = (clickedData) => {
        if (!clickedData) return;
        let newLogDataArray = logDataArray.slice();
        let clickedIndex = newLogDataArray.findIndex( data => data.key === clickedData.key);
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
            // let firstDeletedInd = logDataArray.findIndex(data => deletedKeys.includes(data.key));
            // let newIndex = Math.max(0, firstDeletedInd - 1);
            let newLogDataArray = logDataArray.filter(data => !deletedKeys.includes(data.key));
            setLogDataArray(newLogDataArray);             // trigger rendering
        }
    }

    const searchJobNameHandler = (e) => {
        setSearchJobNamePattern(e.target.value);
    }

    // Effect to load all data from AWS s3 bucket after component mounted
    // useEffect( async() => {
    //     fetchMoreData();
    //
    // },[]);

    return (
        <main className={styles.MainComponent}>
            <RunningLogsList
                logDataArray={logDataArray
                    .filter(data => data.jobName.includes(searchJobNamePattern))}
                loading={loading}
                logItemClicked={logItemClicked}
                logItemShiftClicked={logItemShiftClicked}
                checkMarkClicked={checkMarkClicked}
                onUploadSucceed={fetchUploaded}
                onDeleteButtonPressed={deleteFile}
                onRefreshButtonPressed={syncData}
                onSearchJobNameChanged={searchJobNameHandler}
            />
            <ChartAreaComponent
                logDataArray={logDataArray
                    .filter(data => data.jobName.includes(searchJobNamePattern))
                    .filter( data => data.selected )}
            />
        </main>
    );
}

export default MainComponent;
