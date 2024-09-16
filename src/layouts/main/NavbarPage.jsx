'use client';
import { Layout, Menu } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppstoreOutlined,
  EditOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  ReadOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import Auth from '@/utils/store/Authentication';
import Container from '../container/Container';
import FooterSasi from '../footer/FooterSasi';
import './NavbarPage.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getMyAppsAction } from '@/redux/actions';
import dynamic from 'next/dynamic';
import HeaderComponent from '../header/HeaderComponent';
import HeaderMobile from '../header/header-mobile/HeaderMobile';

const Onboarding = dynamic(() => import('@/components/onboarding/Onboarding'), { ssr: false });

const NavbarPage = ({ children }) => {
  const router = useRouter();
  const [isShowConnectShopify, setIsShowConnectShopify] = useState(false);
  const [isShowProfile, setIsShowProfile] = useState(Auth.isAuthenticated());
  const CMS_URL = process.env.NEXT_PUBLIC_REACT_APP_CMS_URL ?? 'https://cms.letsmetrix.com';
  const accessToken = Auth.getAccessToken();
  const [selectedKey, setSelectedKey] = useState(null);
  const [isCheck, setIsCheck] = useState(false);
  const [isSize, setIsSize] = useState(false);
  const myApps = useSelector((state) => state.myAppsReducer.getMyAppsResponse);
  const dispatch = useDispatch();
  const [isShowOnboarding, setIsShowOnboarding] = useState(false);

  const handleOnboarding = () => {
    setIsShowOnboarding(true);
  };

  const handleCloseOnboarding = () => {
    setIsShowOnboarding(false);
  };

  const getMyApps = useCallback(() => {
    setSelectedKey(null);
    if (Auth.isAuthenticated()) {
      dispatch(getMyAppsAction.request());
    }
  }, [dispatch]);

  useEffect(() => {
    setIsCheck(true);
    getMyApps();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSize(window.innerWidth <= 1275);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onSearch = (value) => {
    const query = { q: value };
    const queryString = new URLSearchParams(query).toString();
    router.push(`/search?${queryString}`);
  };

  const handleChangePass = () => {
    router.push('/auth/change-password');
  };

  const handleConnectShopify = () => {
    setIsShowConnectShopify(true);
  };

  const handleLogout = () => {
    setIsShowProfile(false);
    router.push('/');
    Auth.logout();
  };

  const menu = (
    <Menu className="apps-dropdown">
      {Auth.isAuthenticated() && (
        <Menu.Item key="cms" icon={<AppstoreOutlined />}>
          <Link prefetch={false} target="_blank" href={`${CMS_URL}/login?accessToken=` + accessToken}>
            Cms
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="changePass" onClick={handleChangePass} icon={<EditOutlined />}>
        Change password
      </Menu.Item>
      <Menu.Item key="connectShopifyApi" onClick={handleConnectShopify} icon={<ShoppingCartOutlined />}>
        Connect shopify api
      </Menu.Item>
      <Menu.Item key="help" icon={<InfoCircleOutlined />}>
        <Link prefetch={false} target="_blank" rel="noopener noreferrer" href="https://docs.letsmetrix.com/">
          Help
        </Link>
      </Menu.Item>
      <Menu.Item key="onboarding" onClick={handleOnboarding} icon={<ReadOutlined />}>
        Getting Started Guide
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="sasi-layout">
      {isCheck && (
        <>
          {!isSize ? (
            <HeaderComponent
              myApps={myApps}
              menu={menu}
              isShowProfile={isShowProfile}
              selectedKeys={selectedKey}
              setSelectedKey={setSelectedKey}
            />
          ) : (
            <HeaderMobile onSearch={onSearch} menu={menu} isShowProfile={isShowProfile} myApps={myApps} />
          )}
          <Container isShowConnectShopify={isShowConnectShopify} setIsShowConnectShopify={setIsShowConnectShopify}>
            {children}
          </Container>
          <FooterSasi />
          {isShowOnboarding && <Onboarding handleSuccess={handleCloseOnboarding} />}
        </>
      )}
    </Layout>
  );
};

export default NavbarPage;
