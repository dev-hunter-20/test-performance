'use client';

import React from 'react';
import { Row, Col, Typography, Tag } from 'antd';
import { SketchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { RiseOutlined, FallOutlined, StarFilled, LinkOutlined } from '@ant-design/icons';
import Image from 'next/image';
import '../../scss/TableListApp.scss';
import Link from 'next/link';

const TableListApp = (props) => {
  const router = useRouter();

  const index = props.index;
  const itemChild = props.itemChild;
  const item = props.data;
  const isReview = props.isReview;
  const openAppDetail = (id) => () => {
    router.push(`/app/${id}`);
  };

  const renderTagType = (sum) => {
    if (sum !== 0) {
      return (
        <Tag
          style={{
            borderRadius: '16px',
            color: sum > 0 ? '#336B1F' : '#ff3333',
            fontSize: '14px',
            padding: '5px 10px',
            fontWeight: 500,
          }}
          color={sum > 0 ? 'rgba(101, 216, 60, 0.36)' : '#ffb3b3'}
        >
          <Typography.Text>{sum}</Typography.Text>
          {sum > 0 ? <RiseOutlined /> : <FallOutlined />}
        </Tag>
      );
    }
    return null;
  };
  return (
    <Row key={index} className="item-detail">
      <Col span={2}>
        <div className="rank">
          <span>{itemChild.index || itemChild.rank}</span>
        </div>
      </Col>
      <Col span={10}>
        <div className="content-app">
          <div className="image">
            <Image onClick={openAppDetail(itemChild.app_id)} src={itemChild.app_icon} alt="" width={75} height={75} />
          </div>
          <div className="item-detail-app">
            <div className="name-app-shopify">
              <Link prefetch={false} href={'/app/' + itemChild.app_id} className="link-name">
                {itemChild.name}
              </Link>
              {itemChild.built_for_shopify && (
                <Tag className="built-for-shopify" icon={<SketchOutlined />} color="#108ee9">
                  Built for shopify
                </Tag>
              )}
            </div>
            <div className="tagline">{itemChild.tagline ? itemChild.tagline : itemChild.metatitle}</div>
            <div className="link-app-shopify">
              <Link
                href={
                  'https://apps.shopify.com/' +
                  itemChild.app_id +
                  `?utm_source=letsmetrix.com&utm_medium=app_listing&utm_content=${itemChild.name}`
                }
                className="link"
                rel="noopener nofollow noreferrer"
                prefetch={false}
              >
                <LinkOutlined />
              </Link>
            </div>
          </div>
        </div>
      </Col>

      <Col span={5} style={{ fontSize: '15px', alignItems: 'center', display: 'flex' }}>
        {isReview ? renderTagType(item.review_count) : item.category_name}
      </Col>
      {!isReview && <Col span={3}>{item ? renderTagType(item.count) : ''}</Col>}
      <Col span={2} className="flex items-center justify-center">
        <div className="icon-star">
          {itemChild.star > 5 ? itemChild.star / 10 : itemChild.star} <StarFilled />
        </div>
      </Col>
      <Col span={2} className="flex items-center justify-center">
        <div>{itemChild.review_count > 0 ? itemChild.review_count : itemChild.review || null}</div>
      </Col>
    </Row>
  );
};

export default TableListApp;
