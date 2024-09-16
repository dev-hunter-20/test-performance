'use client';

import { Column } from '@ant-design/plots';
import React from 'react';
import './MostReview.scss';
import { Empty } from 'antd';

export default function MostReview({ mostReview }) {
  const data = mostReview
    .map((app) => ({
      app_name: app.detail.name,
      review_count: app.detail.review_count,
    }))
    .reverse();

  const config = {
    data,
    xField: 'app_name',
    yField: 'review_count',
    color: '#1E90FF',
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
      review_count: { alias: 'Review Count' },
    },
  };
  return (
    <div className="most-review_chart">
      {mostReview && mostReview.length > 0 ? (
        <Column {...config} />
      ) : (
        <Empty description="No Data Available" className="empty-nodata" />
      )}
    </div>
  );
}
