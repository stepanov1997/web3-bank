import React from 'react'
import {fromAdaptedNumber} from "../../core/convertibleMarkParser";
import {Bar} from "react-chartjs-2";
import {groupBy} from "../../util/funtional";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const StatisticBar = ({title, history, addressIndex, dataIndex}) => {

    const labels = [1];

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
            },
        },
    };

    const data = {
        labels,
        datasets: Object.entries(groupBy(history, x => x.args[addressIndex]))
            .map(([receiverAddress, blocks]) => ({
                label: receiverAddress,
                data: [blocks.reduce((acc, e) => acc + fromAdaptedNumber(e.args[dataIndex]), 0)],
                backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
            }))
    };

    return <div>
        {data.datasets.length>0 ? <Bar options={options} data={data}/> : <p>{title} data is empty</p>}
    </div>
}