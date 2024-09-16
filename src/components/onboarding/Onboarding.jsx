'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Row } from 'antd';
import './Onboarding.scss';
import Image from 'next/image';
import OnboardOverview from './OnboardOverview/OnboardOverview';
import TrackingApp from './TrackingApp/TrackingApp';
import DataManage from './DataManage/DataManage';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import { dataOnboard } from '@/utils/data/onboarding';

const Onboarding = (props) => {
  const [type, setType] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const viewActionDetail = (url) => {
    setType(url);
  };

  const openChat = () => {
    if (isClient) {
      window.$crisp.push(['do', 'chat:open']);
    }
  };

  const backToMain = () => {
    setType('');
  };

  const skip = async () => {
    await LandingPageApiService.handleShowOnboard(false, 'first-step');
    props.handleSuccess();
  };

  const renderAction = (url) => {
    switch (url) {
      case 'app-dashboard-step-1':
        return <OnboardOverview type={type} backToMain={backToMain} handleSuccess={props.handleSuccess} />;
      case 'data-manage-access-step-1':
        return <DataManage type={type} backToMain={backToMain} handleSuccess={props.handleSuccess} />;
      case 'track-app-search-step-1':
        return <TrackingApp type={type} backToMain={backToMain} handleSuccess={props.handleSuccess} />;
      default:
        return (
          <>
            <Row className="onboarding-desc" justify="center">
              What do you want to do first?
            </Row>
            <Row justify="center" style={{ marginTop: '90px', padding: '0 20px' }}>
              {dataOnboard.map((item, index) => (
                <div key={index} className="onboarding-action" onClick={() => viewActionDetail(item.url)}>
                  <div className="onboarding-action-title">{item.title}</div>
                  <div className="onboarding-action-image">
                    <Image src={item.image} alt="" loading="lazy" className="img" width={100} height={100} />
                  </div>
                </div>
              ))}
            </Row>
            <Row justify="center" style={{ marginTop: '80px' }}>
              <div className="onboarding-help">
                Need help getting started? <a onClick={openChat}>Contact us</a>
              </div>
            </Row>
          </>
        );
    }
  };

  return (
    <div>
      {isClient && (
        <Modal open={true} className="onboarding" footer={null} width={'80%'} onCancel={skip}>
          <Row justify="center">
            <div className="onboarding-title">{`Welcome to Let's Metrix!`}</div>
          </Row>
          {renderAction(type)}
        </Modal>
      )}
    </div>
  );
};

export default Onboarding;
