'use client';

import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import './ChartWeeklyRating.scss';
import { Empty, Spin } from 'antd';

export default function ChartWeeklyRating(props) {
  const dataConvert = useMemo(() => {
    if (props.value) {
      return props.value;
    }
  }, [props.value]);

  return (
    <>
      {!props.onDashboard && (
        <div className="block-header-review">{props.isReview ? 'Review Changes' : 'Rating Changes'}</div>
      )}
      <div className={`${props.loading ? 'chart-loading' : 'chart'}`}>
        {props.loading ? (
          <Spin />
        ) : dataConvert && dataConvert.datasets.length > 0 ? (
          <Line
            data={dataConvert}
            height={400}
            options={{
              responsive: true,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    generateLabels: function (chart) {
                      const datasets = chart.data.datasets;
                      const labels = datasets.map((dataset, i) => {
                        const formattedLabel = dataset.label.charAt(0).toUpperCase() + dataset.label.slice(1);
                        return {
                          datasetIndex: i,
                          text: formattedLabel,
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
                },
                y: {
                  display: true,
                  grid: {
                    drawBorder: true,
                  },
                  title: {
                    display: true,
                  },
                  reverse: false,
                  beginAtZero: true,
                },
              },
            }}
          />
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
}
