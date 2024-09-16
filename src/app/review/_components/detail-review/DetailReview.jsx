'use client';

import DashboardReviewsApiService from '@/api-services/api/DashboardReviewsApiService';
import React, { useEffect, useState } from 'react';
import ChartChangeLogReview from '../chart/ChartChangeLogReview';
import { Breadcrumb } from 'antd';
import './DetailReview.scss';
import { colors } from '@/utils/theme/colors';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function DetailReview() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const getUrlParameter = (url, param) => {
    const variableUrl = url.replace('?', '').split('&');
    return variableUrl
      .find((item) => item?.split('=').shift() === param)
      ?.split('=')
      .pop();
  };
  const reviewId = getUrlParameter(window.location.search, 'reviewId') || '';
  const [detailReview, setDetailReview] = useState([]);

  const getDetailReview = async (id) => {
    try {
      setLoading(true);
      const res = await DashboardReviewsApiService.getDetailReview(id);
      if (res) {
        setDetailReview(res);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetailReview(reviewId);
  }, [reviewId]);

  let transformedData;
  if (detailReview && detailReview.data && detailReview.data.change_log) {
    transformedData = {
      datasets: [
        {
          label: 'Change log',
          data: Object.entries(detailReview.data.change_log)
            .filter(([date, changes]) => changes)
            .map(([date, changes]) => {
              return {
                x: date,
                y: Object.keys(changes).length,
                data: changes,
              };
            }),
        },
      ],
    };
  }
  const convertDataIsDeleted = (data) => {
    let stringDataIsDeleted = '';
    if (typeof data === 'boolean') {
      stringDataIsDeleted = data ? 'true' : 'false';
    }

    return stringDataIsDeleted;
  };
  const convertDataContent = (data) => {
    let convertDataContent = '';
    if (data) {
      data.map((item) => {
        convertDataContent += item ? item + '\n' : '';
      });
    }
    return convertDataContent;
  };
  const convertDataStar = (data) => {
    let convertDataStar = '';
    if (typeof data === 'number') {
      convertDataStar = data.toString();
    } else if (Array.isArray(data)) {
      data.map((item) => {
        convertDataStar += item ? item + '\n' : '';
      });
    }
    return convertDataStar;
  };
  const convertDataPosition = (data) => {
    let convertDataPosition = '';
    if (typeof data === 'number') {
      convertDataPosition = data.toString();
    } else if (Array.isArray(data)) {
      data.map((item) => {
        convertDataPosition += item ? item + '\n' : '';
      });
    }
    return convertDataPosition;
  };
  const createDataIsDeletedEqual = (data) => {
    if (data) {
      return {
        after: convertDataIsDeleted(data.after),
        before: convertDataIsDeleted(data.before),
      };
    }
  };
  const createDataContentEqual = (data) => {
    if (data) {
      return {
        after: convertDataContent(data.after),
        before: convertDataContent(data.before),
      };
    }
  };
  const createDataStarEqual = (data) => {
    if (data) {
      return {
        after: convertDataStar(data.after),
        before: convertDataStar(data.before),
      };
    }
  };
  const createDataPositionEqual = (data) => {
    if (data) {
      return {
        after: convertDataPosition(data.after),
        before: convertDataPosition(data.before),
      };
    }
  };

  const convetDataChartChangeLog = (changeLog) => {
    const dataValue = [];
    Object.entries(changeLog).forEach(([date, item]) => {
      if (item && item.is_deleted) {
        dataValue.push({
          x: date,
          y: 1,
          data: createDataIsDeletedEqual(item.is_deleted),
          type: 'is_deleted',
        });
      } else {
        dataValue.push({
          x: date,
          data: {},
          type: 'is_deleted',
        });
      }
      if (item && item.content) {
        dataValue.push({
          x: date,
          y: 2,
          data: item.content,
          type: 'content',
        });
      } else {
        dataValue.push({
          x: date,
          data: {},
          type: 'content',
        });
      }
      if (item && item.star) {
        dataValue.push({
          x: date,
          y: 3,
          data: createDataStarEqual(item.star),
          type: 'star',
        });
      } else {
        dataValue.push({
          x: date,
          data: {},
          type: 'star',
        });
      }
      if (item && item.relevance_position) {
        dataValue.push({
          x: date,
          y: 4,
          data: createDataPositionEqual(item.relevance_position),
          type: 'relevance_position',
        });
      } else {
        dataValue.push({
          x: date,
          data: {},
          type: 'relevance_position',
        });
      }
    });

    const datasets = [
      {
        label: 'Change log',
        data: dataValue,
        fill: false,
        pointRadius: 3,
        backgroundColor: colors[0],
      },
    ];
    return {
      datasets: datasets,
    };
  };

  return (
    <>
      <div className="detail-developers-header">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
              <Link
                href={`/dashboard/review?nameReviewer=${detailReview.data?.reviewer_name}&reviewer_location=${detailReview.data?.reviewer_location}`}
                prefetch={false}
              >
                Name Reviewer
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="link">{detailReview.data?.reviewer_name}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="wrapper-detail-review container">
        <h1>{detailReview.data?.reviewer_name}</h1>
        <div id="chart-log-weekly" className="check-log-review-dashboard">
          <ChartChangeLogReview
            value={convetDataChartChangeLog(
              detailReview.data && detailReview.data.change_log ? detailReview.data.change_log : [],
            )}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
}
