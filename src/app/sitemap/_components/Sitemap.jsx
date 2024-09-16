'use client';

import { Col, Row, Spin } from 'antd';
import { forEach } from 'lodash';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import './Sitemap.scss';
import SitemapApiService from '@/api-services/api/SitemapApiService';

export default function Sitemap() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await SitemapApiService.getSitemap();
      setData(response);
      setLoading(false);
    };
    fetchData();
  }, []);

  const renderedListAll = (isDeveloper, categories, dataCategories = [], margin = 0, size = 0, fontWeight = 0) => {
    let data = dataCategories;
    margin = margin + 20;
    size = size + 16;
    fontWeight = fontWeight + 500;
    forEach(categories, (item, index) => {
      data.push(
        <div style={{ marginLeft: margin, fontSize: size }} className="list-item-categories" key={item.category_id || index}>
          <div className="item-categories-detail">
            <div className="item-name">
              <Link
                style={{ fontWeight: fontWeight }}
                href={isDeveloper ? `/app/${item.category_id}` : '/category/' + item.category_id}
                prefetch={false}
              >
                {item.category_name}
              </Link>
            </div>
          </div>
        </div>,
      );
      if (item.child && item.child.length) {
        renderedListAll(false, item.child, data, margin, size - 18, fontWeight - 600);
      }
    });
    return data;
  };

  return (
    <Spin spinning={loading}>
      <div className="sitemap container">
        <div className="header-category">Categories</div>
        <Row gutter={10}>
          {data &&
            data.categories?.map((item) => (
              <Col md={8} sm={12} xs={24} className="category-name" key={item.category_id}>
                <Link prefetch={false} style={{ fontWeight: 600 }} href={`/category/${item.category_id}`}>
                  {item.category_name}
                </Link>
                {renderedListAll(false, item.child)}
              </Col>
            ))}
        </Row>
        <div className="header-category">Collections</div>
        <Row gutter={20}>
          {data &&
            data.collections?.map((item) => (
              <Col md={8} sm={12} xs={24} className="collection-name" key={item.collection_id}>
                <Link prefetch={false} href={`/collection/${item.slug}`}>{item.collection_name}</Link>
              </Col>
            ))}
        </Row>
        <div className="header-category">Blogs</div>
        <Row>
          {data &&
            data.blogs?.map((item) => (
              <Col md={8} sm={12} xs={24} className="collection-name" key={item.slug}>
                <Link prefetch={false} href={`/blogs/${item.slug}`}>{item.title}</Link>
              </Col>
            ))}
        </Row>
        <div className="header-category">Developers</div>
        <Row>
          {data &&
            data.developers
              // ?.sort((a, b) => b.apps.length - a.apps.length)
              ?.map((item) => (
                <Col md={8} sm={12} xs={24} className="category-name" key={item.id}>
                  <Link prefetch={false} style={{ fontWeight: 600 }} href={`/developer/${item.id}`}>
                    {item.name}
                  </Link>
                  {/* {renderedListAll(
                    true,
                    item.apps.map((app) => ({
                      slug: app.app_id,
                      text: app.app_name,
                    })),
                    [],
                    0,
                    -1,
                    -100,
                  )} */}
                </Col>
              ))}
        </Row>
      </div>
    </Spin>
  );
}
