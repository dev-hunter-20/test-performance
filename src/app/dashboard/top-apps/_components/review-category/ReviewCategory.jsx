'use client';

import { Pie } from '@ant-design/plots';
import { useRouter } from 'next/navigation';
import React from 'react';
import './ReviewCategory.scss';
import { Empty, Spin } from 'antd';

export default function ReviewCategory({ chartData, loadingReviewCategory }) {
  const router = useRouter();

  const viewStore = (id) => {
    if (id) {
      router.push(`/category/${id}`);
    }
  };

  const config = {
    data: chartData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      visible: true,
      type: 'inner',
    },
    legend: {
      position: 'right',
      itemName: {
        formatter: (text) => {
          return `${text.length > 17 ? `${text.substring(0, 16)}...` : text}`;
        },
      },
    },
    onReady: (plot) => {
      plot.on('plot:click', (...args) => {
        if (args[0]?.data?.data?._id) {
          viewStore(args[0].data.data._id);
        }
      });
    },
  };

  return (
    <Spin spinning={loadingReviewCategory}>
      <div className="category-pie">
        {chartData && chartData.length > 0 ? (
          <Pie pieStyle={{ cursor: 'pointer' }} {...config} />
        ) : (
          <Empty description="No Data Available" className="empty-nodata" />
        )}
      </div>
    </Spin>
  );
}
