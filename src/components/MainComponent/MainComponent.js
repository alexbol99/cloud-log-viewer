import React, {useEffect, useState} from 'react';
import styles from './MainComponent.module.css';
import RunningLogsList from "../RunningLogsList/RunningLogsList";
import VegaLiteChart from "../VegaLiteChart/VegaLiteChart";
import {getChartData, parse} from "../../models/log-parser";
import * as d3 from "d3";

const urls_list = [
    "https://acp-cloud-logs.s3.eu-central-1.amazonaws.com/-acpcloud186ba.16420_cloud_aw180727--slr_benchmark",
    "https://acp-cloud-logs.s3.eu-central-1.amazonaws.com/-acpcloud186bc.16420_ne190635_986878x1_cloud_benchmark_dup",
    "https://acp-cloud-logs.s3.eu-central-1.amazonaws.com/-acpcloud186c2.16420_tan_wc78800_mrc200net2p_cloud%2B1",
    "https://acp-cloud-logs.s3.eu-central-1.amazonaws.com/-acpcloud186d0.16420_cloud_a269321e.test2%2B2"
]

async function loadFile(index) {
    let url = urls_list[index]
    let text = await d3.text(url)
    let data = parse(text);
    return data;
}

function MainComponent(props) {
    const [chartData, setChartData] = useState(null);
    const [runData, setRunData] = useState(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const localData = await loadFile(index);
            const localChartData = localData.runningTime ? getChartData(localData) : null;
            const actionsNum = localData.batch[localData.batch.length-1].ActNum;
            const layersNum = new Set(localData.batch.map(action => action.LayerName)).size;
            setRunData({
                jobName: localData?.jobName,
                actionsNum: actionsNum,
                layersNum: layersNum,
                runningTime: localData.runningTime
            });
            setChartData(localChartData);
        };

        fetchData();
    }, [index]);

    const logItemClicked = (index) => {
        setIndex(index);
    }

    return (
        <main className={styles.MainComponent}>
            <RunningLogsList
                urls_list={urls_list}
                selectedIndex={index}
                logItemClicked={logItemClicked}/>
            <VegaLiteChart data={chartData} runData={runData} />
        </main>
    );
}

export default MainComponent;
