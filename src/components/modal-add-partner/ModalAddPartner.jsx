'use client';

import { Button, Input, Modal, Spin, message } from 'antd';
import React, { useRef, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import './ModalAddPartner.scss';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import Link from 'next/link';

export default function ModalAddPartner({ appId, disableModal, fetchDataSyncPartner }) {
  const partnerAppId = useRef('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOk = () => {
    disableModal();
  };

  const handleCancel = () => {
    disableModal();
  };

  const addPartnerAppId = async () => {
    setIsLoading(true);
    const data = {
      appId: appId,
      appGid: partnerAppId.current,
    };
    const result = await DetailAppApiService.saveAppGid(data);
    if (result && result.code === 0) {
      message.success('Add partner app id success');
      disableModal();
      fetchDataSyncPartner();
    } else {
      message.error('Add partner app id error');
    }
    setIsLoading(false);
  };

  const changeInput = (event) => {
    partnerAppId.current = event.target.value;
  };

  return (
    <Modal
      width={420}
      title="Add App ID from partner"
      visible={true}
      footer={null}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {isLoading ? (
        <Spin style={{ width: '100%' }} indicator={<LoadingOutlined style={{ marginTop: 30, fontSize: 24 }} spin />} />
      ) : (
        <div className="popup-add-partner-app-id">
          <div className="input-partner-id">
            <Input placeholder="App ID" onChange={changeInput} />
          </div>
          <div className="link-usage">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.letsmetrix.com/get-started/connect-shopify-api/sync-app-with-partner-data"
              prefetch={false}
            >
              How to sync app with Partner data
            </Link>
          </div>
          <div className="button-add-partner">
            <Button type="primary" onClick={addPartnerAppId}>
              Add App ID
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
