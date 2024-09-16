'use client';

import React, { useMemo, useState } from 'react';
import { Row, Col, Button } from 'antd';
import { dataDashboard } from '../../../utils/data/onboarding';
import './OnboardOverview.scss';
import { RightOutlined, CheckOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import { footerButton } from '@/utils/functions';

const OnboardOverview = (props) => {
  const [children, setChildren] = useState(props.type);

  const getStarted = () => {
    props.backToMain();
  };

  const handleAction = (isBack) => {
    switch (children) {
      case 'app-dashboard-step-2':
        setChildren(isBack ? 'app-dashboard-step-1' : 'app-dashboard-step-3');
        break;
      case 'app-dashboard-step-3':
        if (isBack) {
          setChildren('app-dashboard-step-2');
        } else {
          props.backToMain();
        }
        break;
      default:
        if (isBack) {
          props.backToMain();
        } else {
          setChildren('app-dashboard-step-2');
        }
    }
  };

  const skipAction = async () => {
    await LandingPageApiService.handleShowOnboard(false, children);
    props.handleSuccess();
  };

  const renderDashboard = useMemo(() => {
    switch (children) {
      case 'app-dashboard-step-1':
        return (
          <>
            <Col span={16}>
              <Image
                className="search-img"
                src="/image/app-dashboard.gif"
                alt=""
                loading="lazy"
                width={100}
                height={500}
                unoptimized
              />
            </Col>
            <Col span={7} className="tracking-desc">
              <div style={{ fontSize: '22px', fontWeight: '500' }}>
                1. Application Dashboard
                <Link
                  prefetch={false}
                  href="https://letsmetrix.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/image/open-link.webp"
                    alt=""
                    width={20}
                    height={20}
                    style={{ marginLeft: '5px', marginBottom: '5px' }}
                  />
                </Link>
              </div>
              {dataDashboard.map((item) => (
                <Row className="tracking-feature" key={item.app}>
                  <Col span={2}>
                    <Image src="/image/arrow-feature.webp" alt="" width={20} height={20} />
                  </Col>
                  <Col span={22}>{item.app}</Col>
                </Row>
              ))}
              <Row style={{ marginLeft: '35px' }}>...</Row>
            </Col>
          </>
        );
      case 'app-dashboard-step-2':
        return (
          <>
            <Col span={7} className="tracking-desc">
              <div style={{ fontSize: '22px', fontWeight: '500' }}>
                2. Developer Dashboard
                <Link
                  prefetch={false}
                  href="https://letsmetrix.com/developers"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/image/open-link.webp"
                    alt=""
                    width={20}
                    height={20}
                    style={{ marginLeft: '5px', marginBottom: '5px' }}
                  />
                </Link>
              </div>
              {dataDashboard.map((item) => (
                <Row className="tracking-feature" key={item.app}>
                  <Col span={2}>
                    <Image src="/image/arrow-feature.webp" alt="" width={20} height={20} />
                  </Col>
                  <Col span={22}>{item.developer}</Col>
                </Row>
              ))}
              <Row style={{ marginLeft: '35px' }}>...</Row>
            </Col>
            <Col span={16}>
              <Image
                className="search-img"
                src="/image/dev-dashboard.gif"
                alt=""
                loading="lazy"
                width={100}
                height={500}
                unoptimized
              />
            </Col>
          </>
        );
      default:
        return (
          <>
            <Col span={16}>
              <Image
                className="search-img"
                src="/image/review-dashboard.gif"
                alt=""
                loading="lazy"
                width={100}
                height={500}
                unoptimized
              />
            </Col>
            <Col span={7} className="tracking-desc">
              <div style={{ fontSize: '22px', fontWeight: '500' }}>
                3. Review Dashboard
                <Link
                  prefetch={false}
                  href="https://letsmetrix.com/dashboard/reviews"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/image/open-link.webp"
                    alt=""
                    width={20}
                    height={20}
                    style={{ marginLeft: '5px', marginBottom: '5px' }}
                  />
                </Link>
              </div>
              {dataDashboard.map((item) => (
                <Row className="tracking-feature" key={item.app}>
                  <Col span={2}>
                    <Image src="/image/open-link.webp" alt="" width={20} height={20} />
                  </Col>
                  <Col span={22}>{item.review}</Col>
                </Row>
              ))}
              <Row style={{ marginLeft: '35px' }}>...</Row>
            </Col>
          </>
        );
    }
  }, [children]);

  return (
    <>
      <Row className={`tracking fade-in`} justify="space-between">
        {renderDashboard}
      </Row>
      {footerButton(
        <div className="flex">
          <div style={{ marginRight: '20px' }} className="onboarding-skip" onClick={() => handleAction(true)}>
            Back
          </div>
          {children !== 'app-dashboard-step-3' ? (
            <Button type="primary" onClick={() => handleAction()} style={{ marginLeft: 'auto' }}>
              Next <RightOutlined />
            </Button>
          ) : (
            <Button type="primary" onClick={getStarted}>
              Done <CheckOutlined />
            </Button>
          )}
        </div>,
        skipAction,
      )}
    </>
  );
};

export default OnboardOverview;
