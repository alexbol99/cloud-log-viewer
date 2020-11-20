import React, {useEffect, useRef, useState} from "react";
import styles from "./ChartAreaComponent.module.css";
import VegaLiteChart from "./VegaLiteChart/VegaLiteChart";

const ChartAreaComponent = (props) => {
    const refContainer = useRef(null);
    const [chartWidth, setChartWidth] = useState(800);

    useEffect( () => {
        if (refContainer.current) {
            const currentContainerWidth = refContainer.current.clientWidth;
            const numCharts = props.logDataArray.length;
            const currentChartWidth = numCharts === 1 ? 800 : 0.8 * currentContainerWidth / 2;
            setChartWidth(currentChartWidth);
        }
    },[props.logDataArray.length])

    return props.logDataArray.length > 0 ? (
        <div className={styles.ChartAreaComponent}  ref={refContainer}>
            {
                props.logDataArray.map( (data, index) => (
                    <VegaLiteChart
                        key={index}
                        logData={data}
                        width={chartWidth}
                    />
                ))
            }
        </div>
    ) : null;
}

export default ChartAreaComponent