'use client';

import { SwapOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import './PopularComparisons.scss';

export default function PopularComparisons({ compareAppData }) {
  const recommendedDataAppCompare = compareAppData[1].app_compare.map((item) => {
    return item.categories.flatMap((cate) => {
      return cate.top_3_apps.map((top) => {
        return {
          app_id: top.app_id,
          app_icon: top.detail?.app_icon || '',
          app_name: top.detail?.name,
        };
      });
    });
  });

  const recommendedAppHost = {
    app_id: compareAppData[0].app_host.app_id,
    app_name: compareAppData[0].app_host.app_name,
    app_icon: compareAppData[0].app_host.detail?.app_icon || '',
  };

  const dataPopularComparisonsRender = () => {
    const seenAppIds = new Set();
    let filteredApps = recommendedDataAppCompare.flat().filter((compareApp) => {
      if (!seenAppIds.has(compareApp.app_id) && compareApp.app_id !== recommendedAppHost.app_id) {
        seenAppIds.add(compareApp.app_id);
        return true;
      }
      return false;
    });

    return (
      <Row>
        {filteredApps.slice(0, 6).map((compareApp, index) => {
          const appNames = [recommendedAppHost.app_id, compareApp.app_id];
          appNames.sort((a, b) => a.localeCompare(b));
          const compareUrl = `/app/${appNames[0]}/compare-app/vs/${appNames[1]}`;

          return (
            <Col key={index}>
              <div className="item-compare">
                <Tooltip title={recommendedAppHost.app_name}>
                  <Link href={`/app/${recommendedAppHost.app_id}`}>
                    <Image
                      src={recommendedAppHost.app_icon}
                      width={100}
                      height={100}
                      alt={recommendedAppHost.app_name}
                      className="image-app"
                    />
                  </Link>
                </Tooltip>
                <Tooltip title="Compare">
                  <Link href={compareUrl}>
                    <SwapOutlined className="icon-compare" />
                  </Link>
                </Tooltip>
                <Tooltip title={compareApp.app_name}>
                  <Link href={`/app/${compareApp.app_id}`}>
                    <Image
                      src={compareApp.app_icon}
                      width={100}
                      height={100}
                      alt={compareApp.app_name}
                      onClick={() => handleAppDetailClick(compareApp.app_id)}
                      className="image-app"
                    />
                  </Link>
                </Tooltip>
              </div>
            </Col>
          );
        })}
      </Row>
    );
  };
  return (
    <div className="popular-comparisons">
      <h2>Popular Comparisons</h2>
      <div className="content">{dataPopularComparisonsRender()}</div>
    </div>
  );
}
