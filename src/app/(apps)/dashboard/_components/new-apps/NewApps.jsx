'use client';

import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function NewApps({ appsByDay }) {
  const dataByDay = useMemo(() => {
    return appsByDay ? [...appsByDay].reverse() : [];
  }, [appsByDay]);

  const handleShow = (element) => {
    const current = dataByDay.find((item, index) => index === element[0].index);
    window.location.href = `/app-by-day?sort_by=newest&date=${current._id}&page=1&per_page=20`;
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
    onClick: (event, element) => {
      if (element.length > 0) {
        handleShow(element);
      }
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
                fillStyle: dataset.borderColor,
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
    scales: {
      x: {
        display: true,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
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

  const getData = (type) => {
    return dataByDay.map((item) => {
      const newApps = item.counts.find((item) => item.type == type);
      return newApps ? newApps.count : 0;
    });
  };

  const dataChart = {
    labels: dataByDay.map((item) => item._id),
    datasets: [
      {
        label: 'New Apps',
        data: getData('created'),
        borderColor: '#41ad9f',
        backgroundColor: '#41ad9f',
        stack: 'Stack 0',
      },
      {
        label: 'Deleted Apps',
        data: getData('deleted'),
        borderColor: '#ff4d4d',
        backgroundColor: '#ff4d4d',
        stack: 'Stack 1',
      },
      {
        label: 'Delisted Apps',
        data: getData('unlisted'),
        borderColor: '#ffcc4d',
        backgroundColor: '#ffcc4d',
        stack: 'Stack 1',
      },
    ],
  };

  return (
    <div className="chart-new-apps">
      <div className="flex justify-between">
        <div style={{ marginBottom: '20px' }}>
          <div className="chart-title">New applications</div>
          <div className="chart-desc">Number of new applications per day</div>
        </div>
      </div>
      <Bar options={options} data={dataChart} />
    </div>
  );
}
