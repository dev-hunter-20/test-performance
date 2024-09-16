'use client';

import DashboardApiService from '@/api-services/api/DashboardApiService';
import ItemApp from '@/components/category-collection/item-app/ItemApp';
import { encodeQueryParams, getParameterQuery } from '@/utils/functions';
import { Breadcrumb, Col, Empty, Pagination, Row, Select, Spin, message } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './ListAppByDay.scss';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function ListAppByDay() {
  const params = getParameterQuery();
  const view_type = params.type;
  const date = params.date;
  const [sort_by, setSort_by] = useState(params.sort_by ? params.sort_by : 'newest');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [listApp, setListApp] = useState([]);
  const [isCheck, setIsCheck] = useState(false);
  const pathname = usePathname();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);

  const handleBack = () => {
    router.back();
  };

  const handleChangeSortBy = (value) => {
    setSort_by(value);
    const newQueryParams = {
      ...params,
      page: 1,
    };
    router.push(`${pathname}?${encodeQueryParams(newQueryParams)}`);
  };

  const asyncFetch = async (type, date, page, per_page) => {
    setLoading(true);
    const result =
      view_type == 'bfs'
        ? await DashboardApiService.getBFSByDate(date, type, page, per_page)
        : await DashboardApiService.getAppsByDate(type, date, page, per_page);
    setLoading(false);
    if (result && result.code == 0) {
      setListApp(result.result);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
      return;
    }
    message.error(result.message);
  };

  useEffect(() => {
    setIsCheck(true);
    const newQueryParams = {
      ...params,
      sort_by,
    };
    router.push(`${pathname}?${encodeQueryParams(newQueryParams)}`);
    asyncFetch(sort_by, date, page, perPage);
  }, [sort_by]);

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page,
      per_page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    asyncFetch(sort_by, date, page, perPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const arrFilter = useMemo(() => {
    if (view_type == 'bfs') {
      return [
        { value: 'active', label: 'Built For Shopify' },
        { value: 'inactive', label: 'Removed' },
      ];
    }
    return [
      { value: 'newest', label: 'Newest' },
      { value: 'delete', label: 'Deleted' },
      { value: 'unlisted', label: 'Delisted' },
    ];
  }, [view_type]);

  return (
    <>
      {isCheck ? (
        <Spin spinning={loading}>
          <div className="detail-categories">
            <div className="detail-categories-header">
              <div className="container">
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
                    <Link prefetch={false} href="/dashboard">
                      Apps Dashboard
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>{view_type === 'bfs' ? 'Built For Shopify' : 'List Apps'}</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
            <div className="detail-categories-body container">
              <div className="container-title-body">
                <div className="wrapper-title">
                  <h1 className="title">{date}</h1>
                  <div className="title-apps">{total} apps</div>
                </div>
                <div className="sort">
                  Type:
                  <Select value={sort_by} onChange={handleChangeSortBy}>
                    {arrFilter.map((item) => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
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
                    return (
                      <ItemApp
                        key={index}
                        index={index}
                        itemChild={{
                          ...(itemChild.app_info && itemChild.app_info.detail
                            ? itemChild.app_info.detail
                            : itemChild.detail),
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

              {listApp.length > 0 && (
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
              )}
            </div>
          </div>
        </Spin>
      ) : (
        <Empty style={{ marginTop: '100px' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  );
}
