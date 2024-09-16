'use client';

import React from 'react';
import './DataManage.scss';
import { Row, Col, Button } from 'antd';
import { dataTracking } from '../../../utils/data/onboarding';
import { CheckOutlined } from '@ant-design/icons';
import Image from 'next/image';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import { footerButton } from '@/utils/functions';

const DataManage = (props) => {
  const backAction = () => {
    props.backToMain();
  };

  const skipAction = async () => {
    await LandingPageApiService.handleShowOnboard(false, 'data-management');
    props.handleSuccess();
  };

  return (
    <>
      <Row className="tracking" justify="space-between">
        <Col span={16}>
          <Image
            className="search-img"
            src="/image/data-manage.gif"
            alt=""
            loading="lazy"
            width={100}
            height={500}
            unoptimized
          />
        </Col>
        <Col span={7} className="tracking-desc">
          Access data management
          {dataTracking.map((item) => (
            <Row key={item.addApp} className="tracking-feature">
              <Col span={3}>
                <Image src="/image/arrow-feature.webp" alt="" loading="lazy" width={20} height={20} />
              </Col>
              <Col span={21} style={{ marginTop: '3px' }}>
                {item.dataManage}
              </Col>
            </Row>
          ))}
          <Row style={{ marginLeft: '35px' }}>...</Row>
        </Col>
      </Row>
      {footerButton(
        <div className="flex">
          <div className="onboarding-skip" onClick={backAction}>
            Back
          </div>
          <Button style={{ marginLeft: '20px' }} type="primary" onClick={backAction}>
            Done <CheckOutlined />
          </Button>
        </div>,
        skipAction,
      )}
    </>
  );
};

export default DataManage;
