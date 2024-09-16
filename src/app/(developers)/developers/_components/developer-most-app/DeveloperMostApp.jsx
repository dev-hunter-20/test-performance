'use client';

import React from 'react';
import { Column } from '@ant-design/plots';
import { useRouter } from 'next/navigation';

const DeveloperMostApp = (props) => {
  const history = useRouter();

  const viewStore = (id) => {
    history.push(`/developer/${id}`);
  };

  const nameOccurrences = {};

  props.data.forEach((item) => {
    const { name } = item;
    if (nameOccurrences[name]) {
      nameOccurrences[name]++;
      item.name = `${name}-${nameOccurrences[name]}`;
    } else {
      nameOccurrences[name] = 1;
    }
  });

  const config = {
    data: props.data,
    xField: 'name',
    yField: 'count_app',
    color: '#5B8FF9',
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
};

export default DeveloperMostApp;
