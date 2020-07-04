import React from 'react';
import { VegaLite } from 'react-vega'

function VegaLiteChart(props) {
    const spec = {
        title: "DFM on cloud running chart",
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
        width: 600,
        height: 800,
        autosize: "fit"
    }

    return (
        <div>
            {
                props.data ? <VegaLite spec={spec} data={props.data} /> : null
            }
        </div>
    );
}

export default VegaLiteChart;
