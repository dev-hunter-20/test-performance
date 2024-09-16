'use client';

import { Breadcrumb, Layout } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import ModalConnectShopify from '@/components/ui/modal/ModalConnectShopify';
import { BREADCRUMB_ROUTES } from '@/constants/MenuItem';
import ScrollToTop from '@/components/ui/scroll-to-top/ScrollToTop';
import './Container.scss';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Content } = Layout;

const Container = ({ children, isShowConnectShopify, setIsShowConnectShopify }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const disableModalConnectShopifyApi = () => {
    setIsShowConnectShopify(false);
  };

  const getLabelBreadcrumb = () => {
    const currentPage = BREADCRUMB_ROUTES.find((item) => item.path == pathname);
    return currentPage ? currentPage.label : '';
  };

  return (
    <Content className="container-content">
      {isShowConnectShopify && (
        <div className="modal-connect-shopify">
          <ModalConnectShopify disableModal={disableModalConnectShopifyApi} />
        </div>
      )}
      {BREADCRUMB_ROUTES.map((item) => item.path).includes(pathname) && (
        <div className="breadcrumb-header">
          <div className="container">
            <Breadcrumb separator="">
              <span className="breadcrumb-item" onClick={handleBack} style={{ cursor: 'pointer' }}>
                <ArrowLeftOutlined style={{ marginRight: '8px' }} />
                <span>{getLabelBreadcrumb()}</span>
              </span>
            </Breadcrumb>
          </div>
        </div>
      )}

      <div
        className="content-menu"
        style={{
          marginBottom: `${pathname === '/' || pathname === '/explore' ? 0 : '50px'}`,
        }}
      >
        {children}
      </div>
      <ScrollToTop />
    </Content>
  );
};

export default Container;
