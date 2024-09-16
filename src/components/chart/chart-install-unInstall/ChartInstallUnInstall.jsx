'use client';

import React from 'react';
import { Tooltip } from 'antd';
import { Column } from '@ant-design/plots';
import './ChartInstallUnInstall.scss';

export default function ChartInstallUnInstall(props) {
  const dataInstallByDate = props.value.install_by_date;
  const dataUnInstallByDate = props.value.uninstall_by_date;

  const createData = (install) => {
    const labels = [];
    const dataInstall = [];
    const dataUninstall = [];
    const dataAC = [];
    const dataCU = [];

    install.map((item) => {
      if (!labels.includes(item.date)) {
        labels.push(item.date);
      }
    });
    labels.sort(function (a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });

    labels.map((item) => {
      install.forEach(function (val, key) {
        if (val.date === item) {
          dataInstall.push(val.installed_shop_count);
          dataUninstall.push(val.reactivated_shop_count);
          dataAC.push(val.active_charge_merchants);
          dataCU.push(val.unfrozen_charge_merchants);
        }
      });
    });

    return {
      labels: labels,
      datasets: [
        {
          label: 'Installs',
          data: dataInstall,
          backgroundColor: '#41ad9f',
          stack: 'Stack 1',
        },
        {
          label: 'Re-opened stores',
          data: dataUninstall,
          backgroundColor: '#482779',
          stack: 'Stack 1',
        },
        {
          label: 'Active Charge Merchants',
          data: dataAC,
          backgroundColor: '#3fc2f0',
          stack: 'Stack 0',
        },
        {
          label: 'Charge Unfrozen Merchants',
          data: dataCU,
          backgroundColor: '#329ac5',
          stack: 'Stack 0',
        },
      ],
    };
  };
  function convertDataInstall(dataInstallByDate) {
    if (!dataInstallByDate) {
      return;
    }
    let result = [];
    const dataconvert = createData(dataInstallByDate);

    for (let i = 0; i < dataconvert.labels.length; i++) {
      for (let j = 0; j < dataconvert.datasets.length; j++) {
        const type = dataconvert.datasets[j].label;
        const col = type === 'Installs' || type === 'Re-opened stores' ? '' : ' ';

        result.push({
          year: dataconvert.labels[i],
          value: dataconvert.datasets[j].data[i],
          type: type,
          col: col,
        });
      }
    }

    return result;
  }
  let dataColumnInstall = convertDataInstall(dataInstallByDate);

  const config = {
    dataColumnInstall,
    isStack: true,
    isGroup: true,
    xField: 'year',
    yField: 'value',
    seriesField: 'type',
    label: false,
    groupField: 'col',
    color: ['#41ad9f', '#482779', '#3399ff', '#cc3399'],
    legend: {
      position: 'top',
    },
    tooltip: {
      customContent: (title, items) => {
        return (
          <div style={{ padding: '10px 5px 5px' }}>
            <p>{title}</p>
            {items.map((item, index) => (
              <p key={index}>
                {item.data.type}: {item.data.value}
              </p>
            ))}
          </div>
        );
      },
    },
  };

  const createDataUninstall = (uninstall) => {
    const labels = [];
    const dataUninstall = [];
    const dataClosed = [];
    const dataDeclined = [];
    const dataCF = [];
    const dataCC = [];
    uninstall.map((item) => {
      if (!labels.includes(item.date)) {
        labels.push(item.date);
      }
    });
    labels.sort(function (a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    });

    labels.map((item) => {
      uninstall.forEach(function (val, key) {
        if (val.date === item) {
          dataClosed.push(val.deactivated_shop_count);
          dataDeclined.push(val.declined_shop_count);
          dataUninstall.push(val.uninstalled_shop_count);
          dataCF.push(val.frozen_charge_merchants);
          dataCC.push(val.canceled_charge_merchants);
        }
      });
    });

    return {
      labels: labels,
      datasets: [
        {
          label: 'Uninstalls',
          data: dataUninstall,
          backgroundColor: '#41ad9f',
          stack: 'Stack 1',
        },
        {
          label: 'Closed',
          data: dataClosed,
          backgroundColor: '#482779',
          stack: 'Stack 1',
        },
        {
          label: 'Declined',
          data: dataDeclined,
          backgroundColor: '#482779',
          stack: 'Stack 1',
        },
        {
          label: 'Charge Frozen Merchants',
          data: dataCF,
          backgroundColor: '#f56256',
          stack: 'Stack 0',
        },
        {
          label: 'Charge Canceled Merchants',
          data: dataCC,
          backgroundColor: '#f67b29',
          stack: 'Stack 0',
        },
      ],
    };
  };
  function convertDataUnInstall(dataUnInstallByDate) {
    if (!dataUnInstallByDate) {
      return;
    }
    let result = [];
    const dataconvert = createDataUninstall(dataUnInstallByDate);

    for (let i = 0; i < dataconvert.labels.length; i++) {
      for (let j = 0; j < dataconvert.datasets.length; j++) {
        const type = dataconvert.datasets[j].label;
        const col = type === 'Uninstalls' || type === 'Closed' ? '' : type === 'Declined' ? '   ' : ' ';
        result.push({
          year: dataconvert.labels[i],
          value: dataconvert.datasets[j].data[i],
          type: dataconvert.datasets[j].label,
          col: col,
        });
      }
    }
    return result;
  }
  let dataColumnUnInstall = convertDataUnInstall(dataUnInstallByDate);

  const configUnInstall = {
    dataColumnUnInstall,
    isStack: true,
    isGroup: true,
    xField: 'year',
    yField: 'value',
    seriesField: 'type',
    label: false,
    groupField: 'col',
    color: ['#41ad9f', '#482779', '#3399ff', '#cc3399', '#f67b29'],
    legend: {
      position: 'top',
    },
    tooltip: {
      customContent: (title, items) => {
        return (
          <div style={{ padding: '10px 5px 5px' }}>
            <p>{title}</p>
            {items.map((item, index) => (
              <p key={index}>
                {item.data.type}: {item.data.value}
              </p>
            ))}
          </div>
        );
      },
    },
  };
  return (
    <div className="row-install-uninstall">
      <div className="installs">
        <div className="title-chart">
          <div className="title-chart-item">
            <div className="title">
              <div>Installs</div>
            </div>
            <div className="total-installs">
              <span>
                {dataInstallByDate
                  ? Math.round(
                      dataInstallByDate
                        .map((item) => item.installed_shop_count)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            </div>
          </div>
          <div className="title-chart-item">
            <div className="title">
              <div>Re-opened</div>
            </div>
            <div className="total-installs">
              <span>
                {dataInstallByDate
                  ? Math.round(
                      dataInstallByDate
                        .map((item) => item.reactivated_shop_count)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            </div>
          </div>
          <div className="title-chart-item">
            <div className="title">
              <div>
                <Tooltip title="Active Charge Merchants">
                  <span>ACM</span>
                </Tooltip>
              </div>
            </div>
            <div className="total-installs">
              <span>
                {dataInstallByDate
                  ? Math.round(
                      dataInstallByDate
                        .map((item) => item.active_charge_merchants)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            </div>
          </div>
          <div className="title-chart-item">
            <div className="title">
              <div>
                <span title="Charge Unfrozen Merchants">CUM</span>
              </div>
            </div>
            <div className="total-installs">
              <span>
                {dataInstallByDate
                  ? Math.round(
                      dataInstallByDate
                        .map((item) => item.unfrozen_charge_merchants)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="chart-installs">{dataColumnInstall && <Column data={dataColumnInstall} {...config} />}</div>
      </div>
      <div className="uninstalls">
        <div className="title-chart">
          <div className="title-chart-item">
            <div className="title">Uninstalls</div>
            <div className="total-uninstalls">
              <span>
                {dataUnInstallByDate
                  ? Math.round(
                      dataUnInstallByDate
                        .map((item) => item.uninstalled_shop_count)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            </div>
          </div>
          <div className="title-chart-item">
            <div className="title">Closed</div>
            <div className="total-uninstalls">
              <span>
                {dataUnInstallByDate
                  ? Math.round(
                      dataUnInstallByDate
                        .map((item) => item.deactivated_shop_count)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            </div>
          </div>
          <div className="title-chart-item">
            <div className="title">Declined</div>
            <div className="total-uninstalls">
              <span>
                {dataUnInstallByDate
                  ? Math.round(
                      dataUnInstallByDate
                        .map((item) => item.declined_shop_count)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            </div>
          </div>
          <div className="title-chart-item">
            <div className="title">Charge Frozen Merchants</div>
            <div className="total-uninstalls">
              <span>
                {dataUnInstallByDate
                  ? Math.round(
                      dataUnInstallByDate
                        .map((item) => item.frozen_charge_merchants)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            </div>
          </div>

          <div className="title-chart-item">
            <div className="title">Charge Canceled Merchants</div>
            <div className="total-uninstalls">
              <span>
                {dataUnInstallByDate
                  ? Math.round(
                      dataUnInstallByDate
                        .map((item) => item.canceled_charge_merchants)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="chart-uninstalls">
          {dataColumnUnInstall && <Column data={dataColumnUnInstall} {...configUnInstall} />}
        </div>
      </div>
    </div>
  );
}
