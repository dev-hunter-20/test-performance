'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Empty, Modal, Spin } from 'antd';
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
import { Scatter } from 'react-chartjs-2';
import ReactDiffViewer from 'react-diff-viewer';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartJSTooltip, Legend);

export default function ChartChange(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataPopup, setDataPopup] = useState([]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const DiamonIcon = new Image();
  DiamonIcon.src = '/image/diamond.svg';

  const CloseIcon = new Image();
  CloseIcon.src = '/image/closeIcon.svg';
  CloseIcon.width = 20;
  CloseIcon.height = 20;

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const labels = [];

  const dataConvert = useMemo(() => props.value, [props.value]);

  const getPointStyle = (context) => {
    const value = context.dataset.data[context.dataIndex];
    return value.y === 12 ? (value.data.before ? CloseIcon : DiamonIcon) : 'circle';
  };

  const getPointRadius = (context) => {
    return context.dataset.data[context.dataIndex].y === 12 ? 6 : 3;
  };

  return (
    <>
      <div className="popup-change-log">
        <Modal
          width={1000}
          title={'Data change log - ' + dataPopup.x}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {dataPopup && (
            <div className="content-popup-change-log">
              {[
                'title',
                'description',
                'name',
                'tagline',
                'pricing',
                'pricing_plan',
                'video',
                'features',
                'highlights',
                'integrations',
                'built_for_shopify',
              ].includes(dataPopup.type) && dataPopup.data ? (
                <ReactDiffViewer
                  oldValue={dataPopup.data.before || ''}
                  newValue={dataPopup.data.after || ''}
                  splitView={true}
                />
              ) : dataPopup.type === 'img' && dataPopup.data ? (
                <div>
                  <table className="image-diff">
                    <tbody>
                      <tr>
                        <td>
                          {dataPopup.data.before.dataImg &&
                            dataPopup.data.before.dataImg.map((item, index) => (
                              <div key={index}>
                                <img height={242} src={item.src} alt={item.alt} />
                                <div className="alt">{item.alt}</div>
                              </div>
                            ))}
                        </td>
                        <td className="image-diff-arrow">
                          {dataPopup.data.before.dataImg &&
                            dataPopup.data.before.dataImg.map((_, index) => (
                              <div key={index}>
                                <ArrowRightOutlined />
                              </div>
                            ))}
                        </td>
                        <td>
                          {dataPopup.data.after.dataImg &&
                            dataPopup.data.after.dataImg.map((item, index) => (
                              <div key={index}>
                                <img height={242} src={item.src} alt={item.alt} />
                                <div className="alt">{item.alt}</div>
                              </div>
                            ))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <ReactDiffViewer
                    oldValue={dataPopup.data.before.changeLog || ''}
                    newValue={dataPopup.data.after.changeLog || ''}
                    splitView={true}
                  />
                </div>
              ) : dataPopup.type === 'app_icon' && dataPopup.data ? (
                <div>
                  <div className="icon-diff">
                    <div className="before">
                      {dataPopup.data.before && <img width={150} src={dataPopup.data.before} alt="before" />}
                    </div>
                    <div className="move">
                      <ArrowRightOutlined />
                    </div>
                    <div className="after">
                      {dataPopup.data.after && <img width={150} src={dataPopup.data.after} alt="after" />}
                    </div>
                  </div>
                  <ReactDiffViewer
                    oldValue={dataPopup.data.before || ''}
                    newValue={dataPopup.data.after || ''}
                    splitView={true}
                  />
                </div>
              ) : (
                ''
              )}
            </div>
          )}
        </Modal>
      </div>
      <div className="block-header">Change Log Tracking</div>
      <div className={`${props.loading ? 'chart-loading' : 'chart'}`} id="chart-log_tracking">
        {props.loading ? (
          <Spin />
        ) : dataConvert && dataConvert.datasets && dataConvert.datasets[0].data.length > 0 ? (
          <Scatter
            data={{
              datasets: dataConvert.datasets.map((item) => ({
                ...item,
                pointStyle: getPointStyle,
                pointRadius: getPointRadius,
              })),
            }}
            height={420}
            options={{
              responsive: true,
              interaction: {
                mode: 'point',
              },
              aspectRatio: false,
              devicePixelRatio: 1,
              scales: {
                y: {
                  gridLines: {
                    display: false,
                  },
                  ticks: {
                    stepSize: 1,
                    callback: (value) => {
                      const labels = [
                        'Integrations',
                        'Highlights',
                        'App icon',
                        'Video',
                        'Description',
                        'Pricing Plan',
                        'Pricing',
                        'Screenshots',
                        'Features',
                        'Tagline',
                        'Name',
                        'Built For Shopify',
                      ];
                      return labels[value - 1];
                    },
                  },
                },
                x: {
                  type: 'category',
                  labels: labels,
                  display: true,
                  grid: {
                    drawOnChartArea: false,
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
                    generateLabels: (chart) => {
                      return chart.data.datasets.map((dataset, i) => ({
                        datasetIndex: i,
                        text: dataset.label,
                        fillStyle: dataset.backgroundColor,
                        strokeStyle: '#FFFFFF',
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
                    label: () => "<div id='tooltip-change-log'><a style={color: 'red'}>Click for details</a></div>",
                  },
                  external: (context) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                      tooltipEl = document.createElement('div');
                      tooltipEl.id = 'chartjs-tooltip';
                      tooltipEl.innerHTML = '<table></table>';
                      var parent = document.getElementById('chart-log-weekly');
                      if (parent && context.tooltip.dataPoints) {
                        parent.appendChild(tooltipEl);
                      }
                    }

                    // Hide if no tooltip
                    const tooltipModel = context.tooltip;
                    if (tooltipModel.opacity === 0) {
                      tooltipEl.style.opacity = 1;
                      return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                      tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                      tooltipEl.classList.add('no-transform');
                    }

                    const getBody = (bodyItem) => bodyItem.lines;
                    // Set Text
                    if (tooltipModel.body) {
                      var titleLines = tooltipModel.title || [];
                      var bodyLines = tooltipModel.body.map(getBody);

                      let innerHtml = '<thead>';
                      titleLines.forEach((title) => {
                        innerHtml += `<tr><th>${title}</th></tr>`;
                      });
                      innerHtml += '</thead><tbody>';

                      bodyLines.forEach((body, i) => {
                        const colors = tooltipModel.labelColors[i];
                        const style = `background:${colors.backgroundColor}; border-color:${colors.borderColor}; cursor:pointer; border-width:2px`;
                        const span = `<span style="${style}"></span>`;
                        innerHtml += `<tr><td>${span}${body}</td></tr>`;
                      });
                      innerHtml += '</tbody>';

                      const tableRoot = tooltipEl.querySelector('table');
                      tableRoot.innerHTML = innerHtml;

                      tooltipEl.addEventListener('click', () => {
                        setIsModalVisible(true);
                        setDataPopup(context.tooltip.dataPoints[0].raw);
                        tooltipEl.style.opacity = 0;
                      });
                    }
                    const position = context.chart.canvas.getBoundingClientRect();
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = `${context.chart.canvas.offsetLeft + tooltipModel.caretX}px`;
                    tooltipEl.style.top = `${context.chart.canvas.offsetTop + tooltipModel.caretY}px`;
                    tooltipEl.style.padding = `${tooltipModel.padding}px ${tooltipModel.padding}px`;
                  },
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
