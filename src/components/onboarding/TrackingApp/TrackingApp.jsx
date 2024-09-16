'use client';

import React, { useMemo, useState } from 'react';
import './TrackingApp.scss';
import { Row, Col, Button } from 'antd';
import { RightOutlined, CheckOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { dataTracking } from '../../../utils/data/onboarding';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import { footerButton } from '@/utils/functions';

const TrackingApp = (props) => {
  const [step, setStep] = useState(props.type);
  const [loading, setLoading] = useState(false);

  const backAction = () => {
    switch (step) {
      case 'track-app-search-step-1':
        props.backToMain();
        break;
      case 'track-app-search-step-2':
        setStep('track-app-search-step-1');
        break;
      case 'track-app-search-step-3':
        setStep('track-app-search-step-2');
        break;
      default:
        setStep('track-app-search-step-3');
    }
  };

  const getStarted = async () => {
    setLoading(true);
    await LandingPageApiService.handleShowOnboard(false, 'done');
    setLoading(false);
    props.handleSuccess();
  };

  const skipAction = async () => {
    await LandingPageApiService.handleShowOnboard(false, step);
    props.handleSuccess();
  };

  const renderTrackContent = useMemo(() => {
    const stepContent = {
      'track-app-search-step-1': (
        <>
          <Col span={16}>
            <Image
              className="search-img"
              src="/image/search-app.gif"
              alt=""
              loading="lazy"
              width={100}
              height={500}
              unoptimized
            />
          </Col>
          <Col span={7} className="tracking-desc">
            <div style={{ fontSize: '22px', fontWeight: '500' }}>
              1. Application search
              <Link prefetch={false} href="/">
                <Image src="/image/open-link.webp" alt="" width={20} height={20} style={{ marginLeft: '5px' }} />
              </Link>
            </div>
            {dataTracking.map((item) => (
              <Row className="tracking-feature" key={item.addApp}>
                <Col span={2}>
                  <Image src="/image/arrow-feature.webp" alt="" className="img" width={20} height={20} />
                </Col>
                <Col span={22}>{item.search}</Col>
              </Row>
            ))}
            <Row style={{ marginLeft: '35px' }}>...</Row>
          </Col>
        </>
      ),
      'track-app-search-step-2': (
        <>
          <Col span={7} className="tracking-desc">
            2. Add your app
            {dataTracking.map((item) => (
              <Row className="tracking-feature" key={item.addApp}>
                <Col span={2}>
                  <Image src="/image/arrow-feature.webp" alt="" className="img" width={20} height={20} />
                </Col>
                <Col span={22}>{item.addApp}</Col>
              </Row>
            ))}
            <Row style={{ marginLeft: '35px' }}>...</Row>
          </Col>
          <Col span={16}>
            <Image
              className="search-img"
              src="/image/add-your-app.gif"
              alt=""
              loading="lazy"
              width={100}
              height={500}
              unoptimized
            />
          </Col>
        </>
      ),
      'track-app-search-step-3': (
        <>
          <Col span={16}>
            <Image
              className="search-img"
              src="/image/add-keyword.gif"
              alt=""
              loading="lazy"
              width={100}
              height={500}
              unoptimized
            />
          </Col>
          <Col span={7} className="tracking-desc">
            3. Add Keywords
            {dataTracking.map((item) => (
              <Row className="tracking-feature" key={item.addApp}>
                <Col span={2}>
                  <Image src="/image/arrow-feature.webp" alt="" className="img" width={20} height={20} />
                </Col>
                <Col span={22}>{item.addKeyword}</Col>
              </Row>
            ))}
            <Row style={{ marginLeft: '35px' }}>...</Row>
          </Col>
        </>
      ),
      'track-app-search-step-4': (
        <>
          <Col span={7} className="tracking-desc">
            4. Track competitor apps
            <Row className="tracking-note">* For apps successfully connected to Google Analytics</Row>
            {dataTracking.map((item) => (
              <Row className="tracking-feature" key={item.addApp}>
                <Col span={2}>
                  <Image src="/image/arrow-feature.webp" alt="" className="img" width={20} height={20} />
                </Col>
                <Col span={22}>{item.addCompare}</Col>
              </Row>
            ))}
            <Row style={{ marginLeft: '35px' }}>...</Row>
          </Col>
          <Col span={16}>
            <Image
              className="search-img"
              src="/image/compare.gif"
              alt=""
              loading="lazy"
              width={100}
              height={500}
              unoptimized
            />
          </Col>
        </>
      ),
    };

    return stepContent[step] || stepContent['track-app-search-step-1'];
  }, [step]);

  const nextAction = () => {
    switch (step) {
      case 'track-app-search-step-1':
        setStep('track-app-search-step-2');
        break;
      case 'track-app-search-step-2':
        setStep('track-app-search-step-3');
        break;
      case 'track-app-search-step-3':
        setStep('track-app-search-step-4');
        break;
      default:
        setStep('track-app-search-step-1');
    }
  };

  return (
    <>
      <Row className={`tracking fade-in`} justify="space-between">
        {renderTrackContent}
      </Row>
      {footerButton(
        <div className="flex">
          <div className="onboarding-skip" style={{ marginRight: '20px' }} onClick={backAction}>
            Back
          </div>
          {step !== 'track-app-search-step-4' ? (
            <Button type="primary" onClick={nextAction} style={{ marginLeft: 'auto' }}>
              Next <RightOutlined />
            </Button>
          ) : (
            <Button type="primary" onClick={getStarted} loading={loading}>
              Done <CheckOutlined />
            </Button>
          )}
        </div>,
        skipAction,
      )}
    </>
  );
};

export default TrackingApp;
