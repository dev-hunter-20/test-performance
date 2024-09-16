'use client';

import React, { useMemo } from 'react';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AppCategory({ appsBFS }) {
  const dataByDay = useMemo(() => {
    return appsBFS ? [...appsBFS].reverse() : [];
  }, [appsBFS]);
  const labels = [...new Set(dataByDay.map((item) => item._id.date))];
  const activeList = dataByDay.filter((item) => item._id.type == 'active');
  const inactiveList = dataByDay.filter((item) => item._id.type == 'inactive');

  const data = {
    labels,
    datasets: [
      {
        label: 'Built for shopify',
        data: labels.map((date) => {
          const activeByDay = activeList.find((item) => item._id.date == date);
          return activeByDay ? activeByDay.count_app : 0;
        }),
        borderColor: '#41ad9f',
        backgroundColor: '#41ad9f',
        fill: false,
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 2,
        pointHitRadius: 3,
      },
      {
        label: 'Removed',
        data: labels.map((date) => {
          const inactiveByDay = inactiveList.find((item) => item._id.date == date);
          return inactiveByDay ? inactiveByDay.count_app : 0;
        }),
        borderColor: '#ff4d4d',
        backgroundColor: '#ff4d4d',
        fill: false,
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 2,
        pointHitRadius: 3,
      },
    ],
  };
  const handleShow = (event, elements) => {
    const current = labels.find((_, index) => index === elements[0].index);
    const ySet1 = elements[0].element.y;
    const ySet2 = elements[1].element.y;
    if (event && ySet1 - 20 <= event.y && event.y <= ySet1 + 20) {
      window.location.href = `/built-for-shopify-app?sort_by=active&date=${current}&type=bfs`;
      return;
    }
    if (event && ySet2 - 20 <= event.y && event.y <= ySet2 + 20) {
      window.location.href = `/built-for-shopify-app?sort_by=inactive&date=${current}&type=bfs`;
      return;
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <Line
        data={data}
        options={{
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          onHover: (event, chartElement) => {
            event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              handleShow(event, elements);
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
        }}
      />
    </div>
  );
}
