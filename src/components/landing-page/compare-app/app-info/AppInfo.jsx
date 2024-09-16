'use client';

import React from 'react';
import './AppInfo.scss';
import { CheckOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { Table } from 'antd';

export default function AppInfo({ compareAppData }) {
  const transposedData = [
    {
      key: 'developer',
      title: 'Developer',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) => item.detail.partner.name),
    },
    {
      key: 'tagline',
      title: 'Tag Line',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) => item.detail.tagline),
    },
    {
      key: 'metadesc',
      title: 'Meta description',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) => item.detail.metadesc),
    },
    {
      key: 'shopifyBadges',
      title: 'Shopify Badges',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) =>
        item.detail.built_for_shopify ? (
          <div className="shopify-badges" key={item.app_id}>
            <Image src="/image/diamond.svg" alt="diamond" width={20} height={20} className="diamond-icon" />
            <span>Built for Shopify</span>
          </div>
        ) : (
          <div className="no-shopify" key={item.app_id}>
            <span>...................</span>
          </div>
        ),
      ),
    },
    {
      key: 'date',
      title: 'Launch Date',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) => {
        return item.date ? (
          <span className="lauch-date">{item.date.split(' ')[0]}</span>
        ) : (
          <div className="no-shopify" key={item.app_id}>
            <span>...................</span>
          </div>
        );
      }),
    },
    {
      key: 'highlights',
      title: 'Highlights',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) =>
        item.detail.highlights ? (
          <ul key={item.app_id}>
            {item.detail.highlights.map((highlight, index) => (
              <li key={index} className="check">
                <CheckOutlined />
                {highlight}
              </li>
            ))}
          </ul>
        ) : (
          ''
        ),
      ),
    },
  ];

  const columns = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      width: 200,
    },
    ...[compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item, index) => ({
      title: item.detail.name,
      dataIndex: `value${index}`,
      key: `value${index}`,
      width: 347,
    })),
  ];

  const dataSource = transposedData.map((row) => {
    const rowData = { key: row.key, title: row.title };
    row.values.forEach((value, index) => {
      rowData[`value${index}`] = value;
    });
    return rowData;
  });
  return (
    <div className="app-info">
      <Table dataSource={dataSource} columns={columns} pagination={false} scroll={{ x: 1500 }} className="table-app" />
    </div>
  );
}
