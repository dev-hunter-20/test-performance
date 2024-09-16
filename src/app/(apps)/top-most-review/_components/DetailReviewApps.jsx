'use client';

import { Breadcrumb, Button, Col, DatePicker, Empty, Pagination, Row, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import ItemApp from '@/components/category-collection/item-app/ItemApp';
import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import { encodeQueryParams, getParameterQuery } from '@/utils/functions';
import DashboardApiService from '@/api-services/api/DashboardApiService';
import './DetailReviewApps.scss';
import Link from 'next/link';

const { RangePicker } = DatePicker;

export default function DetailReviewApps() {
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [loading, setLoading] = useState(false);
  const [listApp, setListApp] = useState([]);
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    router.back();
  };

  const asyncFetch = async (page, per_page) => {
    setLoading(true);
    const result = await DashboardApiService.getAppsMostReview(page, per_page);
    if (result && result.code == 0) {
      setListApp(result.result);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
      setLoading(false);
    }
  };

  useEffect(() => {
    const newQueryParams = {
      ...params,
    };
    router.push(`${pathname}?${encodeQueryParams(newQueryParams)}`);
    asyncFetch(page, perPage);
  }, []);

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page: page,
      per_page: per_page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    asyncFetch(page, per_page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Spin spinning={loading}>
      <div className="detail-categories">
        <div className="detail-categories-header">
          <div className="container">
            <Breadcrumb>
              <Breadcrumb.Item style={{ color: 'white' }}>
                <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
                <Link prefetch={false} href="/dashboard">
                  Apps Dashboard
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item style={{ color: 'white' }}>Top Most Review</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className="detail-categories-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">Top apps has the most reviews</h1>
              <div className="title-apps">{total} apps</div>
            </div>
          </div>
          <div className="line-top"></div>
          <div className="detail-category">
            <div className="title-column">
              <Row>
                <Col className="title-styled" span={2}>
                  #
                </Col>
                <Col className="title-styled" span={10}>
                  App
                </Col>
                <Col className="title-styled" span={6}>
                  Highlights
                </Col>
                <Col className="title-styled flex justify-center" span={3}>
                  Rating
                </Col>
                <Col className="title-styled flex justify-center" span={2}>
                  Reviews
                </Col>
              </Row>
            </div>
            {listApp && listApp.length !== 0 ? (
              listApp.map((itemChild, index) => {
                const itemDetail = itemChild.detail.detail ? itemChild.detail.detail : itemChild.detail;
                return (
                  <ItemApp
                    key={index}
                    itemChild={{
                      ...itemDetail,
                      _id: itemChild._id,
                      review_count: itemChild.review_count,
                      rank: perPage * (page - 1) + index + 1,
                    }}
                    isTopReview
                  />
                );
              })
            ) : (
              <Empty style={{ marginTop: '100px' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
          {total > 0 ? (
            <div className="pagination">
              <Pagination
                pageSize={numberPage}
                current={currentPage}
                onChange={(page, pageSize) => {
                  setCurrentPage(page);
                  setNumberPage(pageSize);
                  onChangePage(page, pageSize);
                }}
                total={total}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} apps`}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </Spin>
  );
}
