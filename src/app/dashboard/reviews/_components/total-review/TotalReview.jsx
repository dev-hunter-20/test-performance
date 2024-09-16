'use client';

import React, { useRef } from 'react';
import './TotalReview.scss';
import { Line } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';
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

// Đăng ký các thành phần
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function TotalReview(props) {
  const currentDate = useRef();
  const router = useRouter();

  const createData = (data) => {
    const labels = data.map((item) => item._id);
    const datasets = [
      {
        label: props.isDeveloper ? 'Developers' : 'Reviews',
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

  const reviewsByDate = (element) => {
    const current = props.data.find((item, index) => index === element[0].index);
    currentDate.current = current._id;
    if (props.isDeveloper) {
      router.push(`/developers-by-day?date=${current._id}`);
      return;
    }
    router.push(`/dashboard/review?created_at=${current._id}`);
  };

  return (
    <div className="total-chart">
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
              reviewsByDate(element);
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
    </div>
  );
}
