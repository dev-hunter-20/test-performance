'use client';

import { Col, Row, Tag } from 'antd';
import React from 'react';
import { StarFilled, UpOutlined, DownOutlined, LinkOutlined, SketchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import './ItemApp.scss';
import Image from 'next/image';
import Link from 'next/link';

export default function ItemApp(props) {
  const router = useRouter();
  const index = props.index;
  const itemChild = props.itemChild;
  const isTopReview = props.isTopReview;
  const loading = props.loading;

  const openAppDetail = (id) => () => {
    router.push(`/app/${id}`);
  };

  return (
    <div
      className="item-detail"
      key={'' + index}
      style={{
        backgroundColor: '#fff',
      }}
    >
      <Row>
        <Col span={2}>
          <div className="rank">
            <span>{itemChild.index || itemChild.rank}</span>
          </div>
        </Col>
        <Col span={10}>
          <div className="content-app">
            <div className="image">
              <Image
                onClick={openAppDetail(itemChild.app_id)}
                src={itemChild.app_icon ? itemChild.app_icon : ''}
                width={75}
                height={75}
                alt=""
              />
            </div>
            <div className="item-detail-app">
              <div className="name-app-shopify">
                {itemChild.before_rank && itemChild.rank && !loading && itemChild.before_rank - itemChild.rank > 0 ? (
                  <span className="calular-incre">
                    <UpOutlined /> {itemChild.before_rank - itemChild.rank}{' '}
                  </span>
                ) : (
                  ''
                )}
                {itemChild.before_rank && itemChild.rank && !loading && itemChild.before_rank - itemChild.rank < 0 ? (
                  <span className="calular-decre">
                    <DownOutlined /> {itemChild.rank - itemChild.before_rank}{' '}
                  </span>
                ) : (
                  ''
                )}
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
                  target="_blank"
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
        <Col span={6} className="highlights">
          {itemChild.highlights && itemChild.highlights.length !== 0 ? (
            <ul>
              {itemChild.highlights.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            null
          )}
        </Col>
        {!isTopReview && (
          <Col span={2} className="flex items-center">
            <div>{itemChild.created_at ? itemChild.created_at.slice(0, 10) : null}</div>
          </Col>
        )}
        <Col span={isTopReview ? 3 : 2} className="flex items-center justify-center">
          <div className="icon-star">
            <StarFilled /> {itemChild.star > 5 ? itemChild.star / 10 : itemChild.star}
            {itemChild.before_star && itemChild.star && itemChild.before_star - itemChild.star > 0 ? (
              <span className="calular-incre">
                {' '}
                <UpOutlined className="icon" /> {(itemChild.before_star - itemChild.star).toFixed(1)}{' '}
              </span>
            ) : (
              ''
            )}
            {itemChild.before_star && itemChild.star && itemChild.before_star - itemChild.star < 0 ? (
              <span className="calular-decre">
                {' '}
                <DownOutlined /> {(itemChild.star - itemChild.before_star).toFixed(1)}{' '}
              </span>
            ) : (
              ''
            )}
          </div>
        </Col>

        <Col span={2} className="flex items-center justify-center">
          <div>
            {itemChild.review_count > 0 ? itemChild.review_count : itemChild.review || null}
            {itemChild.before_review && itemChild.review - itemChild.before_review > 0 ? (
              <span> (+{itemChild.review - itemChild.before_review})</span>
            ) : (
              ''
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
