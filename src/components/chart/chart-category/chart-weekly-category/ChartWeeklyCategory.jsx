'use client';

import { Checkbox, Empty, Spin } from 'antd';
import { Line } from 'react-chartjs-2';
import './ChartWeeklyCategory.scss';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartJSTooltip, Legend);

export const ChartWeeklyCategory = (props) => {
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState();

  const handleShowData = (dataShow, show) => {
    return {
      ...dataShow,
      datasets: dataShow.datasets.map((item) => {
        return {
          ...item,
          hidden: show,
        };
      }),
    };
  };

  useEffect(() => {
    setData(props.value);
  }, [props.value]);

  useEffect(() => {
    if (!!(data && data.datasets.find((item) => !item.hidden))) {
      setChecked(false);
    }
    if (!(data && data.datasets.find((item) => !item.hidden))) {
      setChecked(true);
    }
  }, [data]);

  const onChange = (e) => {
    setChecked(e.target.checked);
    if (e.target.checked) {
      setData(handleShowData(data, true));
      return;
    }
    setData(handleShowData(data, false));
  };

  const onClickLegend = (e, datasetIndex) => {
    const isShow = data.datasets[datasetIndex.datasetIndex].hidden || false;
    setData({
      ...data,
      datasets: data.datasets.map((item, index) => {
        if (index === datasetIndex.datasetIndex) {
          return { ...item, hidden: !isShow };
        }
        return item;
      }),
    });
  };
  return (
    <>
      <div className="header-chart">
        {props.title ? (
          <div className="block-header">{props.title}</div>
        ) : (
          <div className="block-header">Category Positional Changes</div>
        )}
        {data && data.datasets.length > 0 && (
          <Checkbox checked={checked} className="header-switch" onChange={onChange}>
            Hide data
          </Checkbox>
        )}
      </div>

      <div className={`${props.loading ? 'chart-loading' : 'chart'}`}>
        {props.loading ? (
          <Spin />
        ) : data && data.datasets.length > 0 ? (
          <Line
            data={data}
            height={400}
            options={{
              responsive: true,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              plugins: {
                legend: {
                  onClick: onClickLegend,
                  position: 'bottom',
                  labels: {
                    generateLabels: function (chart) {
                      const datasets = chart.data.datasets;
                      const labels = datasets.map((dataset, i) => {
                        return {
                          datasetIndex: i,
                          text: dataset.label,
                          fillStyle: dataset.backgroundColor,
                          strokeStyle: dataset.borderColor,
                          lineWidth: dataset.borderWidth,
                          hidden: !chart.isDatasetVisible(i),
                          borderRadius: 3,
                          width: 10,
                          height: 10,
                        };
                      });
                      return labels;
                    },
                  },
                },
              },
              aspectRatio: false,
              stacked: false,
              scales: {
                x: {
                  display: true,
                  grid: {
                    drawOnChartArea: false,
                  },
                  title: {
                    display: true,
                  },
                },
                y: {
                  display: true,
                  grid: {
                    drawBorder: true,
                  },
                  title: {
                    display: true,
                  },
                  reverse: true,
                },
              },
            }}
          />
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
};
