'use client';
import { useRef, useState } from 'react';
import './ModalConnectShopify.scss';
import { Button, Input, Modal, Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import ShopifyApiService from '@/api-services/api/ShopifyApiService';

const ModalConnectShopify = (props) => {
  const partnerId = useRef('');
  const apiKey = useRef('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOk = () => {
    props.disableModal();
  };

  const handleCancel = () => {
    props.disableModal();
  };

  const connectShopifyApi = async () => {
    setIsLoading(true);
    const data = {
      apiKey: apiKey.current,
      partnerId: partnerId.current,
    };
    const result = await ShopifyApiService.connectPartnerApi(data);
    if (result && result.code === 0) {
      message.success('Connect shopify api success');
      props.disableModal();
    } else {
      message.error('Connect shopify api error');
    }
    setIsLoading(false);
  };

  return (
    <Modal width={420} title="Connect Shopify Api" visible={true} footer={null} onOk={handleOk} onCancel={handleCancel}>
      {isLoading ? (
        <Spin style={{ width: '100%' }} indicator={<LoadingOutlined style={{ marginTop: 30, fontSize: 24 }} spin />} />
      ) : (
        <div className="popup-connect-shopify-api">
          <div className="input-partner-id">
            <div className="label-input">Partner ID</div>
            <Input
              onChange={(event) => {
                partnerId.current = event.target.value;
              }}
            />
          </div>
          <div className="input-api-key">
            <div className="label-input">Api key</div>
            <Input
              onChange={(event) => {
                apiKey.current = event.target.value;
              }}
            />
          </div>
          <div className="link-usage">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.letsmetrix.com/get-started/connect-shopify-api"
            >
              How to get Partner ID and Api key
            </a>
          </div>
          <div className="button-connect-shopify-api">
            <Button type="primary" onClick={connectShopifyApi}>
              Connect Shopify Api
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalConnectShopify;
