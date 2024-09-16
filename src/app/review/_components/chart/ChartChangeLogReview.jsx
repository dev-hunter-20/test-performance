'use client';

import React, { useState, useCallback } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Empty, Modal, Spin } from 'antd';
import ReactDiffViewer from 'react-diff-viewer';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend,
} from 'chart.js';
import './ChartChangeLogReview.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartJSTooltip, Legend);

export default function ChartChangeLogReview(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataPopup, setDataPopup] = useState([]);
  const loading = props.loading;

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const labels = () => {
    return [];
  };

  const openButton = useCallback((context, tooltipEl) => {
    return () => {
      setIsModalVisible(true);
      setDataPopup(context.tooltip.dataPoints[0].raw);
      tooltipEl.style.opacity = 0;
    };
  }, []);

  return (
    <>
      <div className="popup-change-log">
        <Modal width={1000} title="Data change log" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          {dataPopup && (
            <div className="content-popup-change-log">
              {['content', 'is_deleted', 'star', 'relevance_position'].includes(dataPopup.type) && dataPopup.data && (
                <ReactDiffViewer
                  oldValue={dataPopup.data.before || ''}
                  newValue={dataPopup.data.after || ''}
                  splitView={true}
                />
              )}
            </div>
          )}
        </Modal>
      </div>
      <div className="block-header">Change Log Tracking</div>
      <div className="chart" id="chart-log_tracking">
        {loading ? (
          <div className={'loading'}>
            <Spin />
          </div>
        ) : props.value.datasets.length > 0 ? (
          <Scatter
            data={props.value}
            height={430}
            options={{
              responsive: true,
              interaction: {
                mode: 'point',
              },
              aspectRatio: false,
              devicePixelRatio: 1,
              scales: {
                y: {
                  ticks: {
                    callback: function (value) {
                      switch (value) {
                        case 1:
                          return 'Is deleted';
                        case 2:
                          return 'Content';
                        case 3:
                          return 'Star';
                        case 4:
                          return 'Relevance position';
                        default:
                          return value;
                      }
                    },
                  },
                },
                x: {
                  type: 'category',
                  labels: labels,
                  display: true,
                  grid: {
                    drawOnChartArea: false, // Add this line to hide the vertical grid lines
                  },
                  title: {
                    display: true,
                  },
                },
              },
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    fontSize: 14,
                    generateLabels: function (chart) {
                      const datasets = chart.data.datasets;
                      return datasets.map((dataset, i) => ({
                        datasetIndex: i,
                        text: dataset.label,
                        fillStyle: dataset.backgroundColor,
                        strokeStyle: dataset.borderColor,
                        lineWidth: dataset.borderWidth,
                        hidden: !chart.isDatasetVisible(i),
                        borderRadius: 3,
                        width: 10,
                        height: 10,
                      }));
                    },
                  },
                },
                tooltip: {
                  enabled: false,
                  intersect: true,
                  callbacks: {
                    label: function () {
                      return "<div id='tooltip-change-log'><a style={color: 'red'}>Click for details</a></div>";
                    },
                  },
                  external: function (context) {
                    let tooltipEl = document.getElementById('chartjs-tooltip');

                    if (!tooltipEl) {
                      tooltipEl = document.createElement('div');
                      tooltipEl.id = 'chartjs-tooltip';
                      tooltipEl.innerHTML = '<table></table>';
                      const parent = document.getElementById('chart-log-weekly');
                      if (parent) {
                        parent.appendChild(tooltipEl);
                      }
                    }

                    const tooltipModel = context.tooltip;

                    if (tooltipModel.opacity === 0) {
                      tooltipEl.style.opacity = 1;
                      return;
                    }

                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    tooltipEl.classList.add(tooltipModel.yAlign || 'no-transform');

                    if (tooltipModel.body) {
                      const titleLines = tooltipModel.title || [];
                      const bodyLines = tooltipModel.body.map((bodyItem) => bodyItem.lines);

                      let innerHtml = '<thead>';
                      titleLines.forEach((title) => {
                        innerHtml += `<tr><th>${title}</th></tr>`;
                      });
                      innerHtml += '</thead><tbody>';

                      bodyLines.forEach((body, i) => {
                        const colors = tooltipModel.labelColors[i];
                        const style = `background:${colors.backgroundColor}; border-color:${colors.borderColor}; cursor:pointer; border-width:2px`;
                        innerHtml += `<tr><td><span style="${style}"></span>${body}</td></tr>`;
                      });
                      innerHtml += '</tbody>';

                      const tableRoot = tooltipEl.querySelector('table');
                      tableRoot.innerHTML = innerHtml;

                      if (!tooltipEl.onclick) {
                        tooltipEl.onclick = openButton(context, tooltipEl);
                      }
                    }

                    const position = context.chart.canvas.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - 100 + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.padding = `${tooltipModel.padding}px`;
                  },
                },
              },
            }}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
        )}
      </div>
    </>
  );
}
