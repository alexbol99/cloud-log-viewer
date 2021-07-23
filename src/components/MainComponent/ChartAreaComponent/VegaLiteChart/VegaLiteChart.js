import { Vega/*, VegaLite*/ } from 'react-vega'
import styles from './VegaLiteChart.module.css';
import {getChartData} from "../../../../models/logData";
import {useRef} from "react";

function VegaLiteChart(props) {
    const vegaChartRef = useRef(null);

    // Setup data before rendering
    let chartData = null;
    // let runData = null;

    let localData = props.logData;
    try {
        chartData = getChartData(localData);
    } catch (e) {
        chartData = null;
    }
    // runData = getListData(localData);

    const client = localData.key.split('-')[0] || "unknown";
    const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        title: {
            text: localData?.jobName,
            subtitle: `Client: ${client} Running time: ${localData?.runningTime}`
        },
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
        width: props.width,
        // height: 800,
        autosize: "fit",
    }

    return (
        <div className={styles.VegaLiteChart}>
            {
                chartData && localData.runningTime ?
                    <Vega
                        spec={spec}
                        ref={vegaChartRef}
                        data={chartData}
                        actions={{
                            export: true,
                            source: false,
                            compiled: false,
                            editor: false
                        }}
                        downloadFileName={localData?.jobName}
                        theme="urbaninstitute"
                    /> : null
            }
        </div>
    );
}

export default VegaLiteChart;
