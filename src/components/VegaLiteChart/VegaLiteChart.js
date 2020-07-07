import React from 'react';
import { VegaLite } from 'react-vega'
import styles from './VegaLiteChart.module.css';

function VegaLiteChart(props) {
    const spec = {
        title: props.runData?.jobName,
        data: { values: props.data },
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
                field: "Index"
            },
            color: { field: "Object" }
        },
        width: 800,
        // height: 800,
        autosize: "fit"
    }

    return (
        <div className={styles.VegaLiteChart}>
            {
                props.data && props.runData.runningTime ?
                    <VegaLite spec={spec} data={props.data}/> : "No data"
            }
        </div>
    );
}

export default VegaLiteChart;
