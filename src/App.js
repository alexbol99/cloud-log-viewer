import React,  { useState, useEffect } from 'react';
import * as d3 from 'd3';
import {getChartData, parse} from './models/log-parser';
import VegaLiteChart from "./components/VegaLiteChart";
import './App.css';

const urls_list = [
    "https://acp-cloud-logs.s3.eu-central-1.amazonaws.com/-acpcloud186ba.16420_cloud_aw180727--slr_benchmark",
    "https://acp-cloud-logs.s3.eu-central-1.amazonaws.com/-acpcloud186bc.16420_ne190635_986878x1_cloud_benchmark_dup",
    "https://acp-cloud-logs.s3.eu-central-1.amazonaws.com/-acpcloud186c2.16420_tan_wc78800_mrc200net2p_cloud%2B1",
    "https://acp-cloud-logs.s3.eu-central-1.amazonaws.com/-acpcloud186d0.16420_cloud_a269321e.test2%2B2"
]

async function loadFile() {
    let url = urls_list[0]
    let text = await d3.text(url)
    let data = parse(text);
    return data;
}

function App() {
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const localData = await loadFile();
            const chartData = getChartData(localData);
            setData(chartData);
        };

        fetchData();
    }, []);

    return (
        <div className="App">
            <div>Hello World</div>
            {/*<div>{data?.jobName}</div>*/}
            <VegaLiteChart data={data} />
        </div>
    );
}

export default App;
