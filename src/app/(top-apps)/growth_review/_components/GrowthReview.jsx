'use client';

import React, { useState, useEffect, useRef } from "react";
import { Pagination, Spin, Row, Col, DatePicker, Button } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { encodeQueryParams, getParameterQuery } from "@/utils/functions";
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';
import TableListApp from "./TableListApp";
import "@/app/(top-apps)/scss/TableListApp.scss";

const { RangePicker } = DatePicker;

function GrowthReview() {
  const [data, setData] = useState([]);
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const dateFormat = 'YYYY-MM-DD';
  const fromDate = useRef(dayjs().subtract(30, 'd').format(dateFormat));
  const toDate = useRef(dayjs().format(dateFormat));
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState();

  useEffect(() => {
    fetchData(fromDate, toDate, page, perPage);
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
    fetchData(fromDate.current, toDate.current, page, per_page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onChangeDateRange = (dates, dateStrings) => {
    if (dates) {
      fromDate.current = dates[0].format(dateFormat);
      toDate.current = dates[1].format(dateFormat);
    }
  };

  const disabledFutureDate = (current) => {
    return current && current > dayjs().startOf('day');
  };

  const searchByDate = () => {
    let newParams = {
      ...params,
      page: 1,
      per_page: perPage
    };
    window.history.replaceState(
      null,
      null,
      `${window.location.pathname}?${encodeQueryParams(newParams)}`
    );
    fetchData(fromDate.current, toDate.current, 1, perPage);
  };

  async function fetchData(fromDate, toDate, page, per_page) {
    setIsLoading(true);
    let result = await DashboardTopAppService.getTopGrowthReview(fromDate, toDate, page, per_page);
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
              <h1 className='title'>Top applications by Growth Review</h1>
              <div className='title-apps'>{total} apps</div>
              <div className="title">
                <RangePicker
                  defaultValue={[dayjs(fromDate.current, dateFormat), dayjs(toDate.current, dateFormat)]}
                  format={dateFormat}
                  allowClear={false}
                  onChange={onChangeDateRange}
                  disabledDate={disabledFutureDate}
                />
                <Button type="primary" icon={<SearchOutlined />} style={{ marginLeft: '10px' }} onClick={searchByDate}>
                  Search
                </Button>
              </div>
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
                <Col className='title-styled' span={5}>
                  Growth Review
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
              ? data.map((item, index) => {
                  const itemChild = {
                    ...item.detail,
                    rank: perPage * (page - 1) + index + 1,
                  };
                  return (
                    <TableListApp
                      key={index}
                      itemChild={itemChild}
                      index={index}
                      data={item}
                      isReview
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
              total={total}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} apps`}
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}
export default GrowthReview;
