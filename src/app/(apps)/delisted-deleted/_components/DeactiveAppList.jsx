'use client';

import DashboardApiService from '@/api-services/api/DashboardApiService';
import { optionsSortByDeactive, optionsSortTypeDeactive } from '@/utils/FilterOption';
import { encodeQueryParams, getParameterQuery, renderFilterDropdown } from '@/utils/functions';
import { Col, Empty, Menu, Pagination, Row, Spin } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import './DeactiveAppList.scss';
import ItemApp from './item-app/ItemApp';

export default function DeactiveAppList() {
  const [data, setData] = useState([]);
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState();
  const [sort_by, setSort_by] = useState(params.sort_by ? params.sort_by : 'newest');
  const [sort_type, setSort_type] = useState(params.sort_type ? params.sort_type : 'deleted');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const newQueryParams = {
      ...params,
      sort_by: sort_by,
      sort_type: sort_type,
    };
    router.push(`${pathname}?${encodeQueryParams(newQueryParams)}`);

    fetchData(page, perPage, sort_type, sort_by);
  }, [sort_type, sort_by]);

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page,
      per_page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    fetchData(page, per_page, sort_type, sort_by);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchData = async (page, per_page, sort_type, sort_by) => {
    setIsLoading(true);
    let result = await DashboardApiService.getListDeactiveApps(sort_type, page, per_page, sort_by);
    if (result) {
      setData(result.result);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
    }
    setIsLoading(false);
  };

  const handleChangeSort = (type, value) => {
    if (type == 'sortBy') {
      setSort_by(value);
      return;
    }
    setSort_type(value);
  };
  const renderOption = (options, type) => {
    return (
      <Menu>
        {options.map((item, index) => (
          <Menu.Item key={index} onClick={() => handleChangeSort(type, item.value)}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <Spin spinning={isLoading}>
      <div className="detail-categories ">
        <div className="detail-categories-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">Delisted or Deleted Apps</h1>
              <div className="title-apps">{total} apps</div>
            </div>
            <div className="sort">
              {renderFilterDropdown(renderOption(optionsSortByDeactive, 'sortBy'), 'Sort By', sort_by)}
              {renderFilterDropdown(renderOption(optionsSortTypeDeactive, 'sortType'), 'Sort Type', sort_type)}
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
                <Col className="title-styled flex" span={2}>
                  {sort_type == 'deleted' ? 'Deleted Date' : 'Delisted Date'}
                </Col>
                <Col className="title-styled flex justify-center" span={2}>
                  Rating
                </Col>
                <Col className="title-styled flex justify-center" span={2}>
                  Reviews
                </Col>
              </Row>
            </div>
            {data && data.length !== 0 ? (
              data.map((itemChild, index) => {
                return (
                  <ItemApp
                    key={index}
                    itemChild={{
                      ...itemChild.detail,
                      _id: itemChild.app_id,
                      rank: perPage * (page - 1) + index + 1,
                      created_at: itemChild.detail?.launched,
                    }}
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
