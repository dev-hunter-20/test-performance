'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import './DeletedPercent.scss';
import { Pie } from '@ant-design/plots';

export default function DeletedPercent(props) {
  const router = useRouter();

  const viewStore = (id) => {
    router.push(`/category/${id}`);
  };

  const config = {
    appendPadding: 10,
    data: props.data,
    angleField: 'value',
    colorField: 'type',
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    legend: {
      position: 'right',
      itemName: {
        formatter: (text, item) => {
          return `${text.length > 17 ? `${text.substring(0, 16)}...` : text}`;
        },
      },
    },
    onReady: (plot) => {
      plot.on('plot:click', (...args) => {
        viewStore(args[0].data.data._id);
      });
    },
  };
  return (
    <div className="pie-chart">
      <Pie pieStyle={{ cursor: 'pointer' }} {...config} />
    </div>
  );
}
