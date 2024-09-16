'use client';

import React, { useState, useEffect } from 'react';
import { Pagination, Spin, Row, Col } from 'antd';
import { encodeQueryParams, getParameterQuery } from '@/utils/functions';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';
import TableListApp from './TableListApp';
import '@/app/(top-apps)/scss/TableListApp.scss';

function TopMostReviews() {
  const [data, setData] = useState([]);
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState();

  useEffect(() => {
    fetchData(page, perPage);
  }, []);

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page,
      per_page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    fetchData(page, per_page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function fetchData(page, per_page) {
    setIsLoading(true);
    let result = await DashboardTopAppService.getTopReview(page, per_page);
    if (result) {
      setData(result.result);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
    }
    setIsLoading(false);
  }

  return (
    <Spin spinning={isLoading}>
      <div className='detail-categories '>
        <div className='detail-categories-body container'>
          <div className='container-title-body'>
            <div className='wrapper-title'>
              <h1 className='title'>Top applications by Review</h1>
              <div className='title-apps'>{total} apps</div>
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
                <Col className='title-styled' span={6}>
                  Highlights
                </Col>
                <Col className="title-styled flex justify-center" span={2}>
                  Rating
                </Col>
                <Col className="title-styled flex justify-center" span={2}>
                  Reviews
                </Col>
              </Row>
            </div>
            {data
              ? data.map((item, index) => {
                  const itemChild = {
                    ...item.detail,
                    rank: perPage * (page - 1) + index + 1,
                  };
                  return <TableListApp key={index} itemChild={itemChild} index={index} data={item} isReview />;
                })
              : ''}
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
export default TopMostReviews;
