'use client';

import React from 'react';
import { Row, Spin, Empty } from 'antd';
import TablePosition from './TablePosition';

export default function CategoryCollectionPos(props) {
  const dataCategory = props.dataCategory;
  const dataCollection = props.dataCollection;
  const isUnlist = props.isUnlist;

  return (
    <div className={`header-detail-app-info-table ${props.loading ? 'container-loading' : ''}`}>
      {props.loading ? (
        <Spin />
      ) : isUnlist ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: '70px' }} />
      ) : (
        <>
          <Row justify="space-between">
            {dataCategory && Array.isArray(dataCategory.popular) && dataCategory.popular.length > 0 ? (
              <TablePosition data={dataCategory.popular} title="Popular Category Positions" isCategory />
            ) : null}
            {dataCategory && Array.isArray(dataCategory.best_match) && dataCategory.best_match.length > 0 ? (
              <TablePosition data={dataCategory.best_match} title="Category Positions" isBestMatch isCategory />
            ) : null}
          </Row>
          <Row className="mt-20" justify="space-between">
            {dataCollection && dataCollection?.popular && dataCollection.popular.length > 0 ? (
              <TablePosition data={dataCollection.popular} title="Popular Collection Positions" />
            ) : null}
            {dataCollection && dataCollection?.best_match && dataCollection.best_match.length > 0 ? (
              <TablePosition data={dataCollection.best_match} title="Collection Positions" isBestMatch />
            ) : null}
          </Row>
        </>
      )}
    </div>
  );
}
