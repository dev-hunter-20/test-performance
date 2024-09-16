'use client';

import React, { useMemo } from 'react';
import './ActiveDeactiveApp.scss';
import { Pie } from '@ant-design/plots';

export default function ActiveDeactiveApp({ statusApps }) {
  const data = useMemo(() => {
    const appCounts = {
      created: 0,
      deleted: 0,
      unlisted: 0
    };

    if (Array.isArray(statusApps)) {
      statusApps.forEach(app => {
        if (appCounts.hasOwnProperty(app._id)) {
          appCounts[app._id] = app.app_count;
        }
      });
    }

    return [
      {
        type: 'Active Apps',
        value: appCounts.created,
      },
      {
        type: 'Deleted Apps',
        value: appCounts.deleted,
      },
      {
        type: 'Delisted Apps',
        value: appCounts.unlisted,
      },
    ].filter(item => item.value > 0); // Lọc bỏ các mục có giá trị bằng 0
  }, [statusApps]);

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    color: ({ type }) => {
      if (type === 'Active Apps') return '#41ad9f';
      if (type === 'Deleted Apps') return '#ff4d4d';
      if (type === 'Delisted Apps') return '#ffcc4d';
      return '#888888';
    },
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent, value }) => `${value.toLocaleString()}`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    legend: {
      position: 'bottom',
      itemName: {
        formatter: (text, item) => {
          return `${text.length > 17 ? `${text.substring(0, 16)}...` : text}`;
        },
      },
    },
  };

  return (
    <div className="pie-chart">
      <Pie pieStyle={{ cursor: 'pointer' }} {...config} />
    </div>
  );
}
