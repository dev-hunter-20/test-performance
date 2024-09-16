'use client';

import { Button, DatePicker, Modal, Spin } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import dayjs from 'dayjs';
import './ModalPositionKeyword.scss';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const { RangePicker } = DatePicker;

export default function ModalPositionKeyword(props) {
  const dateFormat = 'YYYY-MM-DD';
  const fromDate = useRef(props.fromDate);
  const toDate = useRef(props.toDate);
  const [dateList, setDateList] = useState([]);
  const host_id = window.location.pathname.substring(5);
  const [gaKeywordByDate, setGaKeywordByDate] = useState([]);
  const [dataKeyPosition, setDataKeyPosition] = useState({ bestMatch: [], popular: [] });
  const [loading, setloading] = useState(false);

  const renderGaData = (gaKeywordByDate) => {
    const keywordSelected = gaKeywordByDate.find((item) => item.keyword === props.keywordName).ga_keyword_by_date;
    return keywordSelected ? keywordSelected : [];
  };

  const createDataChart = (keywordPosition, gaKeywordByDate, labels) => {
    const dataGaUEvents = labels.map((item) => {
      const currentUEvents = gaKeywordByDate.find((key) => key.date === item);
      return currentUEvents ? currentUEvents.uniqueEvents : 0;
    });
    const dataGaUPageView = labels.map((item) => {
      const currentUPageView = gaKeywordByDate.find((key) => key.date === item);
      return currentUPageView ? currentUPageView.uniquePageviews : 0;
    });
    const dataPositionBestMatch = labels.map((item) => {
      const current = keywordPosition.bestMatch.find((key) => key.date === item);
      return current ? current.value : null;
    });
    const dataPositionPopular = labels.map((item) => {
      const current = keywordPosition.popular.find((key) => key.date === item);
      return current ? current.value : null;
    });
    return {
      labels,
      datasets: [
        {
          type: 'line',
          label: 'Best Match',
          borderColor: '#cc3300  ',
          backgroundColor: '#cc3300  ',
          fill: false,
          data: keywordPosition ? dataPositionBestMatch : [],
          yAxisID: 'y1',
          cubicInterpolationMode: 'monotone',
          tension: 0.4,
          borderWidth: 1.5,
          pointRadius: 2,
          pointHitRadius: 3,
        },
        {
          type: 'line',
          label: 'Popular',
          borderColor: '#f5ae3d ',
          backgroundColor: '#f5ae3d ',
          fill: false,
          data: keywordPosition ? dataPositionPopular : [],
          yAxisID: 'y1',
          cubicInterpolationMode: 'monotone',
          tension: 0.4,
          borderWidth: 1.5,
          pointRadius: 2,
          pointHitRadius: 3,
        },
        {
          type: 'bar',
          label: 'Unique Pageviews',
          backgroundColor: 'rgb(75, 192, 192)',
          data: dataGaUPageView,
          borderColor: 'white',
          borderWidth: 2,
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: 'Unique Events',
          backgroundColor: 'rgb(53, 162, 235)',
          borderColor: 'white',
          data: dataGaUEvents,
          borderWidth: 2,
          yAxisID: 'y',
        },
      ],
    };
  };

  const setDates = (fromDate, toDate) => {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const dates = [];
    while (startDate <= endDate) {
      dates.push(startDate.toISOString().split('T')[0]);
      startDate.setDate(startDate.getDate() + 1);
    }
    setDateList(dates);
  };

  const asyncFetch = async (id, fromDate, toDate) => {
    setloading(true);

    const [positionPopular, positionBestMatch, dataGa] = await Promise.all([
      DetailAppApiService.getPositionKeywordChangeByLang(
        host_id == id ? id : host_id,
        props.language,
        'popular',
        fromDate,
        toDate,
        host_id == id ? '' : id,
      ),
      DetailAppApiService.getPositionKeywordChangeByLang(
        host_id == id ? id : host_id,
        props.language,
        'best_match',
        fromDate,
        toDate,
        host_id == id ? '' : id,
      ),
      DetailAppApiService.getPositionKeywordByLang(
        host_id == id ? id : host_id,
        'uk',
        fromDate,
        toDate,
        host_id == id ? '' : id,
      ),
    ]);
    if (positionPopular && positionPopular.code == 0) {
      setloading(false);
      setDataKeyPosition({
        popular: positionPopular.data.filter((item) => item.type === props.keywordName),
        bestMatch: positionBestMatch.data.filter((item) => item.type === props.keywordName),
      });
      setGaKeywordByDate(renderGaData(dataGa.data.result));
    } else {
      message.warn(positionPopular.message);
    }
  };

  useEffect(() => {
    asyncFetch(props.appId, fromDate.current, toDate.current);
    setDates(fromDate.current, toDate.current);
  }, []);

  const dataChart = useMemo(() => {
    return createDataChart(dataKeyPosition, gaKeywordByDate, dateList);
  }, [dataKeyPosition, gaKeywordByDate, dateList]);

  const handleOk = () => {
    props.disableModal();
  };

  const handleCancel = () => {
    props.disableModal();
  };

  const searchByDate = () => {
    setDates(fromDate.current, toDate.current);
    asyncFetch(props.appId, fromDate.current, toDate.current);
  };

  function onChangeDateRange(dates, dateStrings) {
    if (dateStrings) {
      fromDate.current = dateStrings[0];
      toDate.current = dateStrings[1];
    }
  }

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,

    plugins: {
      legend: {
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
    scales: {
      x: {
        grid: {
          drawOnChartArea: false,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        reverse: true,
        beginAtZero: false,
      },
    },
  };

  return (
    <Modal
      width={'60%'}
      title="Detail position keyword"
      visible={true}
      footer={null}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="popup-detail-position">
        <div className="date-range">
          {fromDate && toDate ? (
            <>
              <RangePicker
                defaultValue={[dayjs(fromDate.current, dateFormat), dayjs(toDate.current, dateFormat)]}
                format={dateFormat}
                allowClear={false}
                onChange={onChangeDateRange}
              />
              <Button
                type="primary"
                loading={loading}
                icon={<SearchOutlined />}
                className="icon-search-date"
                onClick={searchByDate}
              >
                Search
              </Button>
            </>
          ) : (
            ''
          )}
        </div>
        <div className="chart-weekly-keyword">{loading ? <Spin /> : <Bar data={dataChart} options={options} />}</div>
      </div>
    </Modal>
  );
}
