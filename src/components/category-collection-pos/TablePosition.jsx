'use client';

import React from 'react';
import { Col, Row } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function TablePosition(props) {
  const data = props.data;

  return (
    <div className="header-detail-app-info-right">
      <div className={`table-categories-position ${data.length > 3 ? 'scroll-table' : ''}`}>
        <div className={`title-cate ${data.length > 3 ? 'header-bottom' : ''}`}>{props.title}</div>
        {data?.map((item, index) => {
          return (
            <div
              className="item-cate"
              key={'' + index}
              style={{
                backgroundColor: index % 2 != 0 ? '#F2F2F2' : '',
              }}
            >
              <Row gutter={[5, 12]}>
                <Col className="gutter-row" lg={{ span: 12 }} xs={{ span: 12 }}>
                  {props.isCategory ? (
                    <div>
                      <Link
                        href={
                          '/category/' +
                          item.category_id +
                          `?sort_by=${props.isBestMatch ? 'best_match' : 'popular'}&page=1&per_page=20`
                        }
                        prefetch={false}
                      >
                        {item.category_name}
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <Link
                        href={
                          '/collection/' +
                          item.collection_id +
                          `?sort_by=${props.isBestMatch ? 'best_match' : 'popular'}&page=1&per_page=20`
                        }
                        prefetch={false}
                      >
                        {item.collection_name}
                      </Link>
                    </div>
                  )}
                </Col>
                <Col className="gutter-row" lg={{ span: 6 }} xs={{ span: 6 }}>
                  <div>
                    {item.rank} / {props.isCategory ? item.total_apps : item.total_apps}
                    {item.before_rank && item.rank && item.before_rank - item.rank > 0 ? (
                      <span className="calular-incre " style={{ whiteSpace: 'nowrap' }}>
                        <UpOutlined /> {item.before_rank - item.rank}{' '}
                      </span>
                    ) : (
                      ''
                    )}
                    {item.before_rank && item.rank && item.before_rank - item.rank < 0 ? (
                      <span className="calular-decre " style={{ whiteSpace: 'nowrap' }}>
                        <DownOutlined /> {item.rank - item.before_rank}{' '}
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                </Col>
                <Col className="gutter-row " style={{ textAlign: 'center' }} lg={{ span: 6 }} xs={{ span: 6 }}>
                  <div>
                    Page {item.page}
                    {item.before_page && item.page && item.before_page - item.page > 0 ? (
                      <span className="calular-incre">
                        <UpOutlined /> {item.before_page - item.page}{' '}
                      </span>
                    ) : (
                      ''
                    )}
                    {item.before_page && item.page && item.before_page - item.page < 0 ? (
                      <span className="calular-decre">
                        <DownOutlined /> {item.page - item.before_page}{' '}
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          );
        })}
      </div>
    </div>
  );
}
