'use client';

import React, { useState, useEffect } from "react";
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';
import { Pagination, Spin, Row, Col } from "antd";
import { encodeQueryParams, getParameterQuery } from "@/utils/functions";
import TableListApp from "./TableListApp";
import "@/app/(top-apps)/scss/TableListApp.scss";

function TopNewApp() {
  const [data, setData] = useState([]);
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);

  useEffect(() => {
    fetchTopNewApps(page, perPage);
  }, []);

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page,
      per_page
    };
    window.history.replaceState(
      null,
      null,
      `${window.location.pathname}?${encodeQueryParams(newParams)}`
    );
    fetchTopNewApps(page, per_page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function fetchTopNewApps(page, per_page) {
    setIsLoading(true);
    let result = await DashboardTopAppService.getTopNewApps(page, per_page);
    if (result) {
      setData(result.top_release);
      setCurrentPage(result.page);
    }
    setIsLoading(false);
  }

  return (
    <Spin spinning={isLoading}>
      <div className='detail-categories '>
        <div className='detail-categories-body container'>
          <div className='container-title-body'>
            <div className='wrapper-title'>
              <h1 className='title'>New Apps</h1>
              <div className='title-apps'>100 apps</div>
            </div>
          </div>
          <div className='line-top'></div>
          <div className='detail-category'>
            <div className='title-column'>
              <Row>
                <Col className='title-styled' span={2}>
                  #
                </Col>
                <Col className='title-styled' span={10}>
                  App
                </Col>
                <Col className='title-styled' span={6}>
                  Highlights
                </Col>
                <Col className='title-styled flex' span={2}>
                  Launched Date
                </Col>
                <Col className='title-styled flex justify-center' span={2}>
                  Rating
                </Col>
                <Col className='title-styled flex justify-center' span={2}>
                  Reviews
                </Col>
              </Row>
            </div>
            {data
              ? data.map((itemChild, index) => {
                  return (
                    <TableListApp
                      key={index}
                      itemChild={{
                        ...itemChild.detail,
                        rank: perPage * (page - 1) + index + 1,
                        created_at: itemChild.detail.launched,
                      }}
                    />
                  );
                })
              : ""}
          </div>
          <div className="pagination">
            <Pagination
              pageSize={numberPage}
              current={currentPage}
              onChange={(page, pageSize) => {
                setCurrentPage(page);
                setNumberPage(pageSize);
                onChangePage(page, pageSize);
              }}
              total={100}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} apps`
              }
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}
export default TopNewApp;
