'use client';

import { Bar } from '@ant-design/plots';
import React, { useEffect, useState } from 'react';

export default function DeveloperCountry(props) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!props.data || !props.data.result) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [props.data]);

  const data =
    props.data && props.data.result
      ? props.data.result.map((item) => {
          return {
            country: item._id,
            count: item.count,
          };
        })
      : [];

  const config = {
    data: data,
    xField: 'count',
    yField: 'country',
    sort: {
      reverse: true,
    },
    label: {
      text: 'country',
      formatter: (d) => `${d.count}`,
      style: {
        fill: '#FFF',
      },
    },
    axis: {
      y: {
        labelFormatter: (val) => `${val}`,
      },
    },
  };

  return (
    <div className="dashboard-developer_country">
      <Bar barStyle={{ cursor: 'pointer' }} {...config} loading={loading} />
    </div>
  );
}
