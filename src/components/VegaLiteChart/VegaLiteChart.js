import React from 'react';
import { VegaLite } from 'react-vega'
import styles from './VegaLiteChart.module.css';
import {getChartData, getListData} from "../../models/logData";

function VegaLiteChart(props) {
    // Setup data before rendering
    let chartData = null;
    let runData = null;

    if (props.logDataArray.length > 0) {
        let localData = props.logDataArray[props.index];
        try {
            chartData = getChartData(localData);
        }
        catch (e) {
            chartData = null;
        }
        runData = getListData(localData);
    }

    const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        title: runData?.jobName,
        data: { values: chartData },
        mark: { type: "bar", tooltip: [] },
        encoding: {
            x: {
                type: "temporal",
                field: "StartDate",
                timeUnit: "hoursminutesseconds"
            },
            x2: {
                type: "temporal",
                field: "EndDate",
                timeUnit: "hoursminutesseconds"
            },
            y: {
                type: "nominal",
                field: "Index",
                sort: null
            },
            color: { field: "Object" }
        },
        // resize: true,
        width: 800,
        // height: 800,
        autosize: "fit",
    }

    return (
        <div className={styles.VegaLiteChart}>
            {
                chartData && runData.runningTime ?
                    <VegaLite
                        spec={spec}
                        data={chartData}
                        actions={{
                            export: true,
                            source: false,
                            compiled: false,
                            editor: false
                        }}
                        downloadFileName={runData?.jobName}
                        theme="urbaninstitute"
                    /> : null
            }
        </div>
    );
}

export default VegaLiteChart;
