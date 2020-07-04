import React,  { useState, useEffect } from 'react';
import * as d3 from 'd3';
import {getChartData, parse} from './models/log-parser';
import VegaLiteChart from "./components/VegaLiteChart";
import './App.css';

async function loadFile() {
    let url = "https://gist.githubusercontent.com/alexbol99/79b5bea375006719b7b5aebbea2f47af/raw/e91b2f501e01abe28274d5715406c8f4499957d7/log.txt"
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
