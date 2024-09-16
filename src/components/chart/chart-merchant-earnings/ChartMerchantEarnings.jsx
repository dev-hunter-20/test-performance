'use client';

import './ChartMerchantEarnings.scss';
import React, { useState, useEffect } from 'react';
import { Spin, Tooltip } from 'antd';
import { Line } from 'react-chartjs-2';
import { Column } from '@ant-design/plots';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartJSTooltip, Legend);

export default function ChartMerchantEarnings(props) {
  const dataMerchantByDate = props.value.merchant_by_date;
  const dataEarningByDate = props.value.earning_by_date;
  const dataMerchantByDateSelected = props.filterSelected.merchant_by_date;
  const dataEarningByDateSelected = props.filterSelected.earning_by_date;
  const dataSelectedTotalEarning = props.filterSelected.total_earning;
  const dataSelectedTotalEarningBefore = props.filterSelected.total_earning_before;
  const selectedValue = props.selectedValue;
  const [changedAmount, setChangedAmount] = useState(0);
  const [changedPercent, setChangedPercent] = useState(0);

  useEffect(() => {
    calculatedChangedAmount();
    calculatedChangedAmountSelected();
  }, [dataMerchantByDate, dataMerchantByDateSelected]);

  const createData = (dataMerchant) => {
    const labels = [];
    const datapoints = [];
    dataMerchant.map((item) => {
      if (!labels.includes(item.date)) {
        labels.push(item.date);
      }
    });
    labels.sort(function (a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    labels.map((item) => {
      dataMerchant.forEach(function (val, key) {
        if (val.date === item) {
          datapoints.push(val.merchant);
        }
      });
    });
    return {
      labels: labels,
      datasets: [
        {
          label: 'Merchant',
          fill: false,
          borderRadius: 3,
          width: 10,
          height: 10,
          lineTension: 0.1,
          backgroundColor: '#00af9f',
          borderColor: '#00af9f',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#00af9f',
          pointBackgroundColor: '#00af9f',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#00af9f',
          pointHoverBorderColor: '#00af9f',
          pointHoverBorderWidth: 2,

          borderWidth: 1.5,
          pointRadius: 2,
          pointHitRadius: 3,
          data: datapoints,
        },
      ],
    };
  };

  const calculatedChangedAmount = () => {
    if (dataMerchantByDate && dataMerchantByDate.length) {
      const firstDateAmount = dataMerchantByDate[0].merchant;
      const lastDateAmount = dataMerchantByDate[dataMerchantByDate.length - 1].merchant;
      const changedAmount = lastDateAmount - firstDateAmount;
      const changedPercent = Number(((100 * changedAmount) / firstDateAmount).toFixed(2));
      setChangedAmount(changedAmount);
      setChangedPercent(changedPercent);
    }
  };

  const calculatedChangedAmountSelected = () => {
    if (dataMerchantByDateSelected && dataMerchantByDateSelected.length) {
      const firstDateAmount = dataMerchantByDateSelected[0].merchant;
      const lastDateAmount = dataMerchantByDateSelected[dataMerchantByDateSelected.length - 1].merchant;
      const changedAmount = lastDateAmount - firstDateAmount;
      const changedPercent = Number(((100 * changedAmount) / firstDateAmount).toFixed(2));
      setChangedAmount(changedAmount);
      setChangedPercent(changedPercent);
    }
  };

  const lineOptions = {
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
        ticks: {
          beginAtZero: true,
          callback: function (value) {
            value = value.toString();
            value = value.split(/(?=(?:...)*$)/);
            value = value.join('.');
            return `${value}`;
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          generateLabels: function (chart) {
            const datasets = chart.data.datasets;
            return datasets.map((dataset, i) => {
              return {
                datasetIndex: i,
                text: dataset.label,
                fillStyle: dataset.backgroundColor,
                strokeStyle: dataset.borderColor,
                lineWidth: dataset.borderWidth,
                hidden: !chart.isDatasetVisible(i),
              };
            });
          },
        },
      },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: false,
        callbacks: {
          label: function (context) {
            let value = context.raw;
            value = value
              .toString()
              .split(/(?=(?:...)*$)/)
              .join('.');
            return `${value}`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
  };

  const createDataChartEarning = (dataEarning) => {
    if (!dataEarning) {
      return;
    }
    const labels = [];
    const datapoints = [];
    const activeCharge = [];
    const cancelCharge = [];
    const chargeFrozen = [];
    const chargeUnfrozen = [];
    const dataACCF = [];
    dataEarning.map((item) => {
      if (!labels.includes(item.date)) {
        labels.push(item.date);
      }
    });
    labels.sort(function (a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });
    labels.map((item) => {
      let data = dataEarning.find((val) => val.date === item);
      let dataPoint = data.amount || 0;
      let dataAC = data.active_charge || 0;
      let dataCC = data.cancel_charge || 0;
      let dataCF = data.frozen_charge || 0;
      let dataCU = data.unfrozen_charge || 0;
      datapoints.push(dataPoint);
      activeCharge.push(dataAC);
      cancelCharge.push(dataCC);
      chargeFrozen.push(dataCF);
      chargeUnfrozen.push(dataCU);
      dataACCF.push(dataAC + dataCU - dataCF - dataCC);
    });
    return {
      labels: labels,
      datasets: [
        {
          label: 'Earning',
          data: datapoints,
          backgroundColor: '#41ad9f',
          borderColor: '#41ad9f',
          borderWidth: 0.5,
          columnWidthRatio: 0.1,
        },
        {
          label: 'AC+UC-CF-CC',
          data: dataACCF,
          backgroundColor: '#3399ff',
          borderColor: '#3399ff',
          borderWidth: 0.5,
        },
      ],
    };
  };

  function convertData(dataEarningByDate) {
    if (!dataEarningByDate) {
      return;
    }
    let result = [];
    const dataconvert = createDataChartEarning(dataEarningByDate);
    for (let i = 0; i < dataconvert.labels.length; i++) {
      for (let j = 0; j < dataconvert.datasets.length; j++) {
        const dataSelected = dataEarningByDate.find((item) => item.date === dataconvert.labels[i]);
        let value = dataconvert.datasets[j].data[i];
        if (value % 1 !== 0) {
          value = Math.round(value * 100) / 100;
        }
        result.push({
          year: dataconvert.labels[i],
          value: value,
          type: dataconvert.datasets[j].label,
          active_charge: dataSelected.active_charge,
          cancel_charge: dataSelected.cancel_charge,
          frozen_charge: dataSelected.frozen_charge,
          unfrozen_charge: dataSelected.unfrozen_charge,
        });
      }
    }
    return result;
  }

  function convertDataSelected(dataEarningByDateSelected) {
    if (!dataEarningByDateSelected) {
      return;
    }
    let result = [];
    const dataconvert = createDataChartEarning(dataEarningByDateSelected);
    for (let i = 0; i < dataconvert.labels.length; i++) {
      for (let j = 0; j < dataconvert.datasets.length; j++) {
        const dataSelected = dataEarningByDateSelected.find((item) => item.date === dataconvert.labels[i]);
        let value = dataconvert.datasets[j].data[i];
        if (value % 1 !== 0) {
          value = Math.round(value * 100) / 100;
        }
        result.push({
          year: dataconvert.labels[i],
          value: value,
          type: dataconvert.datasets[j].label,
          active_charge: dataSelected.active_charge.toFixed(2),
          cancel_charge: dataSelected.cancel_charge.toFixed(2),
          frozen_charge: dataSelected.frozen_charge.toFixed(2),
          unfrozen_charge: dataSelected.unfrozen_charge.toFixed(2),
        });
      }
    }
    return result;
  }

  let dataColumn = dataEarningByDateSelected
    ? selectedValue === 'D'
      ? convertData(dataEarningByDate)
      : convertDataSelected(dataEarningByDateSelected)
    : convertData(dataEarningByDate);

  const renderAUFC = (data) => {
    return [
      { title: 'Active Charge', value: data.active_charge, color: '#3fc2f0' },
      {
        title: 'Charge Unfrozen',
        value: data.unfrozen_charge,
        color: '#329ac5',
      },
      { title: 'Charge Frozen', value: data.frozen_charge, color: '#f56256' },
      { title: 'Canceled Charge', value: data.cancel_charge, color: '#cc3399' },
    ].map((item, index) => (
      <div
        style={{
          lineHeight: '20px',
          fontSize: '13px',
          marginTop: '6px',
          marginLeft: '8px',
          color: item.color,
        }}
        key={index}
      >
        <span>{item.title}: </span>
        <span>{item.value}</span>
      </div>
    ));
  };

  const CustomTooltipContent = (title, items) => {
    return (
      <div
        style={{
          padding: '10px',
          backgroundColor: 'white',
        }}
      >
        <p>{title}</p>
        <ul style={{ paddingLeft: '10px', marginBottom: 0 }}>
          {items.map((item, index) => (
            <li
              style={{
                lineHeight: '25px',
                color: item.color,
                fontSize: '14px',
              }}
              key={index}
            >
              <span>{item.name}</span>: {item.value}
            </li>
          ))}
        </ul>
        {items && items.length > 0 && renderAUFC(items[0].data)}
      </div>
    );
  };

  const config = {
    dataColumn,
    isGroup: true,
    xField: 'year',
    yField: 'value',
    seriesField: 'type',
    label: false,
    color: ['#41ad9f', '#3399ff'],
    legend: {
      position: 'top',
    },
    tooltip: {
      customContent: (title, items) => CustomTooltipContent(title, items),
    },
  };

  const getPercentGrowth = (total, totalBefore) => {
    if (total - totalBefore > 0) {
      return (
        <span className="increase" title="Earning Growth">
          <ArrowUpOutlined />
          {(((total - totalBefore) / totalBefore) * 100).toFixed(2)}%
        </span>
      );
    }
    return (
      <span className="decrease" title="Earning Growth">
        <ArrowDownOutlined />
        {(((totalBefore - total) / totalBefore) * 100).toFixed(2)}%
      </span>
    );
  };

  const renderDiffDay = (data = []) => {
    if (data.length === 1) {
      return 'Yesterday';
    }
    if (selectedValue === 'W') {
      return `Last ${data.length} Weeks`;
    } else if (selectedValue === 'M') {
      return `Last ${data.length} Months`;
    } else if (selectedValue === 'Q') {
      return `Last ${data.length} Quarters`;
    } else if (selectedValue === 'Y') {
      return `Last ${data.length - 1} Years`;
    }
    return `Last ${data.length} Days`;
  };

  const renderChartMerchant = () => {
    return (
      <>
        {dataMerchantByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <div className={dataMerchantByDateSelected && !props.loading ? 'chart' : 'chart-loading'}>
                {dataMerchantByDate && !props.loading ? (
                  <Line data={dataMerchantByDate && createData(dataMerchantByDate)} options={lineOptions} />
                ) : (
                  <Spin />
                )}
              </div>
            ) : (
              <div className={dataMerchantByDateSelected && !props.loading ? 'chart' : 'chart-loading'}>
                {dataMerchantByDateSelected && !props.loading ? (
                  <Line
                    data={dataMerchantByDateSelected && createData(dataMerchantByDateSelected)}
                    options={lineOptions}
                  />
                ) : (
                  <Spin />
                )}
              </div>
            )}
          </>
        ) : (
          <div className={dataMerchantByDate && !props.loading ? 'chart' : 'chart-loading'}>
            {dataMerchantByDate && !props.loading ? (
              <Line data={dataMerchantByDate && createData(dataMerchantByDate)} options={lineOptions} />
            ) : (
              <Spin />
            )}
          </div>
        )}
      </>
    );
  };

  const renderTotalEarnings = () => {
    return (
      <>
        {dataSelectedTotalEarning ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                ${props.value.total_earning ? Math.round(props.value.total_earning).toLocaleString() : ''}{' '}
                {getPercentGrowth(props.value.total_earning, props.value.total_earning_before)}
              </span>
            ) : (
              <span>
                ${dataSelectedTotalEarning ? Math.round(dataSelectedTotalEarning).toLocaleString() : ''}{' '}
                {getPercentGrowth(dataSelectedTotalEarning, dataSelectedTotalEarningBefore)}
              </span>
            )}
          </>
        ) : (
          <span>
            ${props.value.total_earning ? Math.round(props.value.total_earning).toLocaleString() : ''}{' '}
            {getPercentGrowth(props.value.total_earning, props.value.total_earning_before)}
          </span>
        )}
      </>
    );
  };

  const renderEarningTime = () => {
    return (
      <>
        {dataEarningByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <span>{renderDiffDay(dataEarningByDate)}</span>
            ) : (
              <span>{renderDiffDay(dataEarningByDateSelected)}</span>
            )}
          </>
        ) : (
          <span>{renderDiffDay(dataEarningByDate)}</span>
        )}
      </>
    );
  };

  const renderEarningTimesTotal = () => {
    return (
      <>
        {dataSelectedTotalEarningBefore ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                ${props.value.total_earning_before ? Math.round(props.value.total_earning_before).toLocaleString() : ''}{' '}
              </span>
            ) : (
              <span>
                ${dataSelectedTotalEarningBefore ? Math.round(dataSelectedTotalEarningBefore).toLocaleString() : ''}{' '}
              </span>
            )}
          </>
        ) : (
          <span>
            ${props.value.total_earning_before ? Math.round(props.value.total_earning_before).toLocaleString() : ''}{' '}
          </span>
        )}
      </>
    );
  };

  const renderEarningAC = () => {
    return (
      <>
        {dataEarningByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                $
                {dataEarningByDate
                  ? Math.round(
                      dataEarningByDate.map((item) => item.active_charge).reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            ) : (
              <span>
                $
                {dataEarningByDateSelected
                  ? Math.round(
                      dataEarningByDateSelected
                        .map((item) => item.active_charge)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            )}
          </>
        ) : (
          <span>
            $
            {dataEarningByDate
              ? Math.round(
                  dataEarningByDate.map((item) => item.active_charge).reduce((partialSum, a) => partialSum + a, 0),
                ).toLocaleString()
              : ''}
          </span>
        )}
      </>
    );
  };

  const renderEarningCU = () => {
    return (
      <>
        {dataEarningByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                $
                {dataEarningByDate
                  ? Math.round(
                      dataEarningByDate
                        .map((item) => item.unfrozen_charge)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            ) : (
              <span>
                $
                {dataEarningByDateSelected
                  ? Math.round(
                      dataEarningByDateSelected
                        .map((item) => item.unfrozen_charge)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            )}
          </>
        ) : (
          <span>
            $
            {dataEarningByDate
              ? Math.round(
                  dataEarningByDate.map((item) => item.unfrozen_charge).reduce((partialSum, a) => partialSum + a, 0),
                ).toLocaleString()
              : ''}
          </span>
        )}
      </>
    );
  };

  const renderEarningCF = () => {
    return (
      <>
        {dataEarningByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                $
                {dataEarningByDate
                  ? Math.round(
                      dataEarningByDate.map((item) => item.frozen_charge).reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            ) : (
              <span>
                $
                {dataEarningByDateSelected
                  ? Math.round(
                      dataEarningByDateSelected
                        .map((item) => item.frozen_charge)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            )}
          </>
        ) : (
          <span>
            $
            {dataEarningByDate
              ? Math.round(
                  dataEarningByDate.map((item) => item.frozen_charge).reduce((partialSum, a) => partialSum + a, 0),
                ).toLocaleString()
              : ''}
          </span>
        )}
      </>
    );
  };

  const renderEarningCC = () => {
    return (
      <>
        {dataEarningByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                $
                {dataEarningByDate
                  ? Math.round(
                      dataEarningByDate.map((item) => item.cancel_charge).reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            ) : (
              <span>
                $
                {dataEarningByDateSelected
                  ? Math.round(
                      dataEarningByDateSelected
                        .map((item) => item.cancel_charge)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            )}
          </>
        ) : (
          <span>
            $
            {dataEarningByDate
              ? Math.round(
                  dataEarningByDate.map((item) => item.cancel_charge).reduce((partialSum, a) => partialSum + a, 0),
                ).toLocaleString()
              : ''}
          </span>
        )}
      </>
    );
  };

  const renderEarningAUFC = () => {
    return (
      <>
        {dataEarningByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                $
                {dataEarningByDate
                  ? Math.round(
                      dataEarningByDate.map((item) => item.active_charge).reduce((partialSum, a) => partialSum + a, 0) +
                        dataEarningByDate
                          .map((item) => item.unfrozen_charge)
                          .reduce((partialSum, a) => partialSum + a, 0) -
                        dataEarningByDate
                          .map((item) => item.frozen_charge)
                          .reduce((partialSum, a) => partialSum + a, 0) -
                        dataEarningByDate
                          .map((item) => item.cancel_charge)
                          .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            ) : (
              <span>
                $
                {dataEarningByDateSelected
                  ? Math.round(
                      dataEarningByDateSelected
                        .map((item) => item.active_charge)
                        .reduce((partialSum, a) => partialSum + a, 0) +
                        dataEarningByDateSelected
                          .map((item) => item.unfrozen_charge)
                          .reduce((partialSum, a) => partialSum + a, 0) -
                        dataEarningByDateSelected
                          .map((item) => item.frozen_charge)
                          .reduce((partialSum, a) => partialSum + a, 0) -
                        dataEarningByDateSelected
                          .map((item) => item.cancel_charge)
                          .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            )}
          </>
        ) : (
          <span>
            $
            {dataEarningByDate
              ? Math.round(
                  dataEarningByDate.map((item) => item.active_charge).reduce((partialSum, a) => partialSum + a, 0) +
                    dataEarningByDate.map((item) => item.unfrozen_charge).reduce((partialSum, a) => partialSum + a, 0) -
                    dataEarningByDate.map((item) => item.frozen_charge).reduce((partialSum, a) => partialSum + a, 0) -
                    dataEarningByDate.map((item) => item.cancel_charge).reduce((partialSum, a) => partialSum + a, 0),
                ).toLocaleString()
              : ''}
          </span>
        )}
      </>
    );
  };

  const renderEarningAEPD = () => {
    return (
      <>
        {dataEarningByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                $
                {dataEarningByDate
                  ? Math.round(props.value.total_earning / dataEarningByDate.length).toLocaleString()
                  : ''}
              </span>
            ) : (
              <span>
                $
                {dataEarningByDateSelected
                  ? Math.round(props.value.total_earning / dataEarningByDateSelected.length).toLocaleString()
                  : ''}
              </span>
            )}
          </>
        ) : (
          <span>
            $
            {dataEarningByDate ? Math.round(props.value.total_earning / dataEarningByDate.length).toLocaleString() : ''}
          </span>
        )}
      </>
    );
  };

  return (
    <div className="row-merchant-earnings">
      <div className="merchant-growth">
        <div className="title-chart-bar">
          <div className="title">
            <div className="sub-title">
              <div>Merchant growth</div>
              <div className={'merchants-changed ' + (changedAmount < 0 ? 'decrease' : 'increase')}>
                {changedAmount.toLocaleString()} merchants.
              </div>
            </div>
            <div className="sub-title">
              <div>mGrowth</div>
              <div className={'merchants-changed ' + (changedAmount < 0 ? 'decrease' : 'increase')}>
                {changedPercent.toLocaleString()}%
              </div>
            </div>
          </div>
        </div>
        {renderChartMerchant()}
      </div>
      <div className="earnings">
        <div className="title-chart-bar">
          <div className="title-chart-bar-item">
            <div className="title">
              <div>Earnings</div>
            </div>
            <div className="total-earning">{renderTotalEarnings()}</div>
          </div>
          <div className="title-chart-bar-item">
            <div className="title">
              <div>
                <Tooltip title="Earnings">{renderEarningTime()}</Tooltip>
              </div>
            </div>
            <div className="total-earning">{renderEarningTimesTotal()}</div>
          </div>
          <div className="title-chart-bar-item">
            <div className="title">
              <div>
                <Tooltip title="Active Charge">
                  <span>AC</span>
                </Tooltip>
              </div>
            </div>
            <div className="total-earning">{renderEarningAC()}</div>
          </div>

          <div className="title-chart-bar-item">
            <div className="title">
              <div>
                <Tooltip title="Charge Unfrozen">
                  <span>CU</span>
                </Tooltip>
              </div>
            </div>
            <div className="total-earning">{renderEarningCU()}</div>
          </div>
          <div className="title-chart-bar-item">
            <div className="title">
              <div>
                <Tooltip title="Charge Frozen">
                  <span>CF</span>
                </Tooltip>
              </div>
            </div>
            <div className="total-earning">{renderEarningCF()}</div>
          </div>
          <div className="title-chart-bar-item">
            <div className="title">
              <div>
                <Tooltip title="Canceled Charge">
                  <span>CC</span>
                </Tooltip>
              </div>
            </div>
            <div className="total-earning">{renderEarningCC()}</div>
          </div>
          <div className="title-chart-bar-item">
            <div className="title">
              <div>
                <Tooltip title="Active + Unfrozen - Canceled - Frozen">
                  <span>AUFC</span>
                </Tooltip>
              </div>
            </div>
            <div className="total-earning">{renderEarningAUFC()}</div>
          </div>
          <div className="title-chart-bar-item">
            <div className="title">
              <div>
                <Tooltip title="Avg. Earning per Day">
                  <span>AEPD</span>
                </Tooltip>
              </div>
            </div>
            <div className="total-earning">{renderEarningAEPD()}</div>
          </div>
        </div>
        <div className={`${dataColumn && !props.loading ? 'chart' : 'chart-loading'}`}>
          {dataColumn && !props.loading ? <Column data={dataColumn} {...config} loading={props.loading} /> : <Spin />}
        </div>
      </div>
    </div>
  );
}
