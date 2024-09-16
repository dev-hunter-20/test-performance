'use client';

import { Column } from '@ant-design/plots';
import React from 'react';
import './GrowRate.scss';
import { Empty } from 'antd';

export default function GrowRate({ growthRate }) {
  const data = growthRate
    .map((app) => ({
      app_name: app.app_name,
      total_ranking: app.count,
    }))
    .reverse();

  const config = {
    data,
    xField: 'app_name',
    yField: 'total_ranking',
    color: '#41ad9f',
    label: false,
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    legend: false,
    meta: {
      total_ranking: { alias: 'Total Ranking' },
    },
  };

  return (
    <div className="growth-rate_chart">
      {growthRate && growthRate.length > 0 ? (
        <Column {...config} />
      ) : (
        <Empty description="No Data Available" className="empty-nodata" />
      )}
    </div>
  );
}
