'use client';

import React from 'react';
import './GrowthReview.scss';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Empty } from 'antd';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function GrowthReview(props) {
  const createData = (data) => {
    const reversedData = data.slice().reverse();
    const labels = reversedData.map((item) => item.app_name);
    const datasets = [
      {
        label: 'Review Count',
        data: reversedData.map((item) => item.review_count),
        borderColor: '#41ad9f',
        backgroundColor: '#41ad9f',
        fill: true,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 3,
        pointHitRadius: 5,
      },
    ];

    return {
      labels: labels,
      datasets: datasets,
    };
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    onHover: (event, chartElement) => {
      event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          generateLabels: function (chart) {
            const datasets = chart.data.datasets;
            const labels = datasets.map((dataset, i) => {
              return {
                datasetIndex: i,
                text: dataset.label,
                fillStyle: dataset.backgroundColor,
                strokeStyle: dataset.borderColor,
                lineWidth: dataset.borderWidth,
                hidden: !chart.isDatasetVisible(i),
                borderRadius: 3,
                width: 10,
                height: 10,
              };
            });
            return labels;
          },
        },
      },
    },
    aspectRatio: false,
    stacked: false,
    scales: {
      x: {
        display: true,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
        },
        ticks: {
          align: 'center',
          maxRotation: 0,
        },
      },
      y: {
        display: true,
        grid: {
          drawBorder: true,
        },
        title: {
          display: true,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="growth-review_chart">
      {props.data && props.data.length > 0 ? (
        <Line data={createData(props.data)} height={370} options={options} />
      ) : (
        <Empty description="No Data Available" className="empty-nodata" />
      )}
    </div>
  );
}
