'use client';

import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import './CustomerLifecycle.scss';

export default function CustomerLifecycle(props) {
  const [dataTable, setDataTable] = useState([]);
  const gaConnected = props.infoApp?.gaConnected;
  const partnerConnected = props.infoApp?.partnerConnected;

  useEffect(() => {
    if (props.value) {
      const dataGa = props.value && props.value.dataGa ? props.value.dataGa : [];
      const dataInstall =
        props.value && props.value.data && props.value.data.install_by_date ? props.value.data.install_by_date : [];
      const dataUninstall =
        props.value && props.value.data && props.value.data.uninstall_by_date ? props.value.data.uninstall_by_date : [];

      var dataView = [];
      const mapInstall = new Map();
      const mapUninstall = new Map();
      const objectDate = [];
      const mapPageView = new Map();
      const mapGetClickApp = new Map();
      if (dataGa.length > 0) {
        dataGa.forEach((element) => {
          if (!objectDate.includes(element.date)) {
            objectDate.push(element.date);
          }
          mapPageView.set(element.date, element.uniquePageviews);
          mapGetClickApp.set(element.date, element.uniqueEvents);
        });
      }
      if (dataInstall.length > 0) {
        dataInstall.forEach((element) => {
          if (!objectDate.includes(element.date)) {
            objectDate.push(element.date);
          }
          mapInstall.set(element.date, element.installed_shop_count);
        });
      }
      if (dataUninstall.length > 0) {
        dataUninstall.forEach((element) => {
          if (!objectDate.includes(element.date)) {
            objectDate.push(element.date);
          }
          mapUninstall.set(element.date, element.uninstalled_shop_count);
        });
      }
      objectDate &&
        objectDate.map((item) => {
          dataView.push({
            date: item,
            pageview: gaConnected && mapPageView.get(item) ? mapPageView.get(item) : ' ',
            clickGetApp: gaConnected && mapGetClickApp.get(item) ? mapGetClickApp.get(item) : ' ',
            install: partnerConnected && mapInstall.get(item) ? mapInstall.get(item) : ' ',
            uninstall: partnerConnected && mapUninstall.get(item) ? mapUninstall.get(item) : ' ',
            clickGetAppPageview:
              mapGetClickApp.get(item) && mapPageView.get(item) && mapPageView.get(item) !== 0
                ? ((100 * mapGetClickApp.get(item)) / mapPageView.get(item)).toFixed(2) + '%'
                : ' ',
            installClickGetApp:
              mapInstall.get(item) && mapGetClickApp.get(item) && mapGetClickApp.get(item) !== 0
                ? ((100 * mapInstall.get(item)) / mapGetClickApp.get(item)).toFixed(2) + '%'
                : ' ',
            installPageview:
              mapInstall.get(item) && mapPageView.get(item) && mapPageView.get(item) !== 0
                ? ((100 * mapInstall.get(item)) / mapPageView.get(item)).toFixed(2) + '%'
                : ' ',
            uninstallInstall:
              mapUninstall.get(item) && mapInstall.get(item) && mapInstall.get(item) !== 0
                ? ((100 * mapUninstall.get(item)) / mapInstall.get(item)).toFixed(2) + '%'
                : ' ',
          });
        });
      setDataTable(dataView);
    }
  }, [props]);

  const columns = [
    {
      title: 'Date/Metric',
      dataIndex: 'date',
    },
    {
      title: 'U.PViews',
      dataIndex: 'pageview',
    },
    {
      title: 'Click get app',
      dataIndex: 'clickGetApp',
    },
    {
      title: 'Install',
      dataIndex: 'install',
    },
    {
      title: 'Uninstall',
      dataIndex: 'uninstall',
    },
    {
      title: 'Click get app/U.PViews',
      dataIndex: 'clickGetAppPageview',
    },
    {
      title: 'Install/Click get app',
      dataIndex: 'installClickGetApp',
    },
    {
      title: 'Install/U.PViews',
      dataIndex: 'installPageview',
    },
    {
      title: 'Uninstall/Install',
      dataIndex: 'uninstallInstall',
    },
  ];

  return (
    <div className="row-customer-lifecycle">
      <div className="title-customer-lifecycle">
        <span>Customer Lifecycle / Conversation rate</span>
      </div>
      <div className="content-customer-lifecycle">
        <div className="table-customer-lifecycle">
          <Table columns={columns} dataSource={dataTable} pagination={false} scroll={{ y: 500, x: 1500 }} />
        </div>
        <div className="chart-line-customer-lifecycle"></div>
      </div>
    </div>
  );
}
