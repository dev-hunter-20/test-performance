'use client';

import React, { useRef } from 'react';
import './TotalDeveloper.scss';
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

const TotalDeveloper = (props) => {
  const currentDate = useRef();

  const createData = (data) => {
    const labels = data.map((item) => item._id);
    const datasets = [
      {
        label: 'Developers',
        data: data.map((item) => item.review_count || item.developer_count),
        borderColor: '#41ad9f',
        backgroundColor: '#41ad9f',
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 2,
        pointHitRadius: 3,
      },
    ];

    return {
      labels: labels,
      datasets: datasets,
    };
  };

  const handleShow = (element) => {
    const current = props.data.find((item, index) => index === element[0].index);
    currentDate.current = current._id;
    window.location.href = `/developers-by-day?date=${current._id}`;
  };

  return (
    <div className="total-chart">
      {props.data.length > 0 ? (
        <Line
          data={createData(props.data)}
          height={370}
          options={{
            responsive: true,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            onClick: function (evt, element) {
              if (element.length > 0) {
                handleShow(element);
              }
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
                  drawOnChartArea: false, // Add this line to hide the vertical grid lines
                },
                title: {
                  display: true,
                },
              },
              y: {
                display: true,
                grid: {
                  drawBorder: true, // Add this line to hide all horizontal grid lines except for the one that corresponds to the x-axis
                },
                title: {
                  display: true,
                },
                reverse: false, //
                beginAtZero: true,
              },
            },
          }}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
      )}
    </div>
  );
};

export default TotalDeveloper;
