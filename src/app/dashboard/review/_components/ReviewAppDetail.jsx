'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './ReviewAppDetail.scss';
import { List, Pagination, Rate, Spin, Tooltip, Tag, Empty, Breadcrumb } from 'antd';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReviewAppDetail() {
  const [loading, setLoading] = useState(false);
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
  const PAGE_DEFAULT_REVIEW = 1;
  const PER_PAGE_REVIEW = 10;

  const nameReviewer = getUrlParameter(window.location.search, 'nameReviewer') || '';
  const locationReviewer = getUrlParameter(window.location.search, 'reviewer_location') || '';
  const create_date = getUrlParameter(window.location.search, 'created_at') || '';
  const [listOfReview, setListOfReview] = useState([]);

  // Get review list
  const getReviewDashboardList = async (page, per_page, reviewer_location, reviewer_name, created_at, is_deleted) => {
    setLoading(true);
    const res = await DetailAppApiService.getReviewDashboard(
      page,
      per_page,
      reviewer_location,
      reviewer_name,
      created_at,
      is_deleted,
    );
    if (res) {
      setListOfReview(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    getReviewDashboardList(PAGE_DEFAULT_REVIEW, PER_PAGE_REVIEW, locationReviewer, nameReviewer, create_date, '');
  }, [locationReviewer, nameReviewer, create_date]);

  const renderTitle = (isTitle) => {
    if (create_date) {
      return create_date;
    }
    if (nameReviewer) {
      return `${nameReviewer ? decodeURIComponent(nameReviewer) : ''} ${
        isTitle && locationReviewer ? `- ${decodeURIComponent(locationReviewer)}` : ''
      }`;
    }
    return locationReviewer ? decodeURIComponent(locationReviewer) : '';
  };

  return (
    <Spin spinning={loading}>
      <div className="detail-developers-header">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
              <Link prefetch={false} href={`/dashboard/reviews`}>
                Dashboard Review
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{renderTitle()}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="review_app_dashboard container">
        <h1 className="dashboard-title">{renderTitle(true)}</h1>
        <h2 className="dashboard-tagline">
          All Shopify App Store reviews for {create_date ? 'the date' : ''} {renderTitle()}
        </h2>
        {listOfReview && listOfReview.data && listOfReview.data.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={listOfReview.data}
            size="large"
            renderItem={(item) => (
              <List.Item key={item.title}>
                <List.Item.Meta
                  title={
                    <div className="header-review">
                      <div className="flex items-center">
                        <Link
                          href={`/dashboard/review?nameReviewer=${item.reviewer_name}&reviewer_location=${item.reviewer_location}`}
                          style={{ fontWeight: 500, textDecoration: 'underline' }}
                          prefetch={false}
                        >
                          {item.reviewer_name}{' '}
                        </Link>
                        <InfoCircleOutlined
                          style={{
                            fontSize: '16px',
                            marginLeft: '5px',
                            cursor: 'pointer',
                            color: '#78726d',
                          }}
                        />
                        {item.is_deleted && (
                          <Tag
                            icon={<DeleteOutlined />}
                            style={{
                              borderRadius: '4px',
                              marginLeft: '10px',
                            }}
                            color="#cd201f"
                          >
                            Deleted
                          </Tag>
                        )}
                      </div>
                      <span className="lable-star">
                        <Rate disabled={true} style={{ color: '#ffc225', marginRight: '10px' }} value={item.star} />
                        <span className="created-date">{item.create_date} </span>
                      </span>
                    </div>
                  }
                />
                <div className="total">
                  From app:{' '}
                  <Link prefetch={false} href={`/app/${item.app_id}`} style={{ marginLeft: '5px' }}>
                    {item.app_name ? item.app_name : item.app_id.charAt(0).toUpperCase() + item.app_id.slice(1)}
                  </Link>
                </div>
                <div className="locale">
                  Location: <b>{item.reviewer_location}</b>
                  {item.time_spent_using_app ? ` - ${item.time_spent_using_app}` : ''}
                </div>
                <span className="content">{item.content}</span>
              </List.Item>
            )}
          />
        ) : (
          <>
            <Empty
              style={{ marginTop: '100px' }}
              description={<span style={{ fontSize: '20px', color: '#737373' }}>No Result!</span>}
            ></Empty>
          </>
        )}
        {listOfReview.data?.length ? (
          <div className="pagination">
            <Pagination
              total={listOfReview.total_all}
              onChange={(page, pageSize) =>
                getReviewDashboardList(page, pageSize, locationReviewer, nameReviewer, create_date, '')
              }
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total.toLocaleString('en-US')} reviews`}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </Spin>
  );
}
