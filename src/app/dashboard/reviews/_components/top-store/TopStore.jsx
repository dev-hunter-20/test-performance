'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import './TopStore.scss';
import { Column } from '@ant-design/plots';

export default function TopStore(props) {
  const router = useRouter();

  const viewStore = (id) => {
    router.push(`/dashboard/review?${props.isStore ? 'nameReviewer' : 'reviewer_location'}=${id}`);
  };

  const config = {
    data: props.data,
    xField: '_id',
    yField: 'review_count',
    color: props.isStore ? '#5B8FF9' : '#41ad9f',
    // seriesField: "_id",
    legend: {
      position: 'top-left',
    },
    onReady: (plot) => {
      plot.on('element:click', (...args) => {
        viewStore(args[0].data.data._id);
      });
    },
  };
  return (
    <div className="dashboard-table">
      <Column columnStyle={{ cursor: 'pointer' }} {...config} />
    </div>
  );
}
