'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import './CompareApp.scss';
import { Alert, Button, Empty, notification, Tabs, Typography } from 'antd';
import SearchDataApiService from '@/api-services/api/SearchDataApiService';
import { debounce } from 'lodash';
import Image from 'next/image';
import CompareAppService from '@/api-services/api/CompareAppApiService';
import InfoAppCompare from './info-app-compare/InfoAppCompare';
import RankingApp from './ranking/RankingApp';
import AppInfo from './app-info/AppInfo';
import PricingApp from './pricing/PricingApp';
import ReviewApp from './review/ReviewApp';
import PopularComparisons from './popular-comparisons/PopularComparisons';
import CustomSelect from '@/components/ui/tree-select/CustomSelect';

const defaultSelectedApps = [
  {
    app_id: 'judgeme',
    name: 'Judge.me Product Reviews App',
    icon: 'https://cdn.shopify.com/app-store/listing_images/8cada0f5da411a64e756606bb036f1ed/icon/CJmAj_a-5fQCEAE=.png',
  },
  {
    app_id: 'yotpo-email-marketing-and-sms',
    name: 'Yotpo Email Marketing & SMS',
    icon: 'https://cdn.shopify.com/app-store/listing_images/a68804021383da136b6c1d18e7806937/icon/CPfq5vbfiocDEAE=.png',
  },
];

export default function CompareApp() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedApps, setSelectedApps] = useState(defaultSelectedApps);
  const [showWarning, setShowWarning] = useState(false);
  const [compareAppData, setCompareAppData] = useState([]);
  const [appMap, setAppMap] = useState({});
  const [isInitialCompare, setIsInitialCompare] = useState(true);
  const [addedApps, setAddedApps] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: 'App already added',
      description: 'This app has already been added. Please choose another app to compare.',
      duration: 5,
      pauseOnHover: true,
      type: 'warning',
    });
  };

  const handleAppFromInfoAppCompare = (newApp) => {
    const isDuplicate = selectedApps.some((app) => app.app_id === newApp.app_id);

    if (isDuplicate) {
      openNotification();
      return;
    }

    const formattedApp = {
      ...newApp,
      icon: newApp.app_icon,
    };

    delete formattedApp.app_icon;

    setAddedApps((prevApps) => [...prevApps, formattedApp]);
    setSelectedApps((prevSelectedApps) => [...prevSelectedApps, formattedApp]);
  };

  const fetchDataCompareApp = async () => {
    if (selectedApps.length > 0) {
      const baseApp = selectedApps[0].app_id;
      const compareApps = selectedApps
        .slice(1)
        .map((app) => app.app_id)
        .join('-lmtvs-');
      try {
        const response = await CompareAppService.compareApps(baseApp, compareApps);
        setCompareAppData(response.data);
      } catch (error) {
        console.error('Failed to fetch comparison data:', error);
      }
    }
  };

  useEffect(() => {
    if (isInitialCompare && addedApps === undefined) {
      fetchDataCompareApp();
      setIsInitialCompare(false);
    } else if (addedApps) {
      fetchDataCompareApp();
    }
  }, [isInitialCompare, addedApps]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value) => {
        if (!value) return;
        setSearchLoading(true);
        try {
          const response = await SearchDataApiService.searchData(value, 1, 15);
          const apps = response.data.apps;

          if (apps.length === 0) {
            setSearchResults([
              {
                value: 'no-results',
                label: <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description="No results found" />,
              },
            ]);
          } else {
            const results = apps.map((app) => ({
              value: app.detail.app_id,
              label: (
                <div key={app.detail.app_id}>
                  {app.detail && app.detail.app_icon ? (
                    <Image src={app.detail.app_icon} alt={app.detail.name} width={35} height={35} />
                  ) : (
                    <Image src={'/image/no-image.webp'} alt={'no image'} width={35} height={35} className="no-image" />
                  )}
                  &nbsp;
                  <span>{app.detail.name}</span>
                </div>
              ),
            }));

            const newAppMap = apps.reduce((map, app) => {
              map[app.detail.app_id] = {
                app_id: app.detail.app_id,
                name: app.detail.name,
                icon: app.detail.app_icon,
              };
              return map;
            }, {});

            setSearchResults(results);
            setAppMap(newAppMap);
          }
        } catch (error) {
          console.error('Failed to fetch search results:', error);
        } finally {
          setSearchLoading(false);
        }
      }, 300),
    [],
  );

  const onSearchApp = useCallback(
    (value) => {
      setSearchLoading(true);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleSelect = (value) => {
    if (Array.isArray(value)) {
      const updatedSelectedApps = value
        .filter((id) => appMap[id])
        .map((id) => ({
          app_id: appMap[id].app_id,
          name: appMap[id].name,
          icon: appMap[id].icon,
        }));

      setSelectedApps((prevSelectedApps) => {
        const newSelectedApps = [...prevSelectedApps];

        updatedSelectedApps.forEach((newApp) => {
          if (!newSelectedApps.find((app) => app.app_id === newApp.app_id)) {
            newSelectedApps.push(newApp);
          }
        });
        return newSelectedApps;
      });

      if (value.length >= 2) {
        setShowWarning(false);
      }
    } else if (value && typeof value === 'object' && value.value) {
      const id = value.value;

      if (appMap[id]) {
        const newApp = {
          app_id: appMap[id].app_id,
          name: appMap[id].name,
          icon: appMap[id].icon,
        };

        setSelectedApps((prevSelectedApps) => {
          const newSelectedApps = [...prevSelectedApps];

          if (!newSelectedApps.find((app) => app.app_id === newApp.app_id)) {
            newSelectedApps.push(newApp);
          }
          return newSelectedApps;
        });

        if (selectedApps.length >= 1) {
          setShowWarning(false);
        }
      }
    } else {
      console.error('Unexpected value format:', value);
    }
  };

  const handleCompareClick = () => {
    if (selectedApps.length < 2) {
      setShowWarning(true);
    } else {
      fetchDataCompareApp();
    }
  };

  const items = [
    { label: 'Ranking', key: '1', children: <RankingApp compareAppData={compareAppData || []} /> },
    { label: 'App Info', key: '2', children: <AppInfo compareAppData={compareAppData || []} /> },
    { label: 'Pricing', key: '3', children: <PricingApp compareAppData={compareAppData || []} /> },
    { label: 'Review', key: '4', children: <ReviewApp compareAppData={compareAppData || []} /> },
    { label: 'Popular Comparisons', key: '5', children: <PopularComparisons compareAppData={compareAppData || []} /> },
  ];

  const handleDeselect = (item) => {
    setSelectedApps((prevApps) => prevApps.filter((app) => app.app_id !== item.app_id));
  };

  return (
    <div className="container-compare_apps container" id="compare">
      {contextHolder}
      <div className="compare-header">
        <div className="top">
          <Typography.Title className="primary-color" level={3}>
            Compare app
          </Typography.Title>
          <Typography.Text style={{ fontSize: '42px' }}>Unlock product insights</Typography.Text>

          <div className={`${showWarning ? 'isAlert' : 'search-app_compare'}`}>
            <div className="input-search">
              <CustomSelect
                options={searchResults}
                selectedItems={selectedApps}
                onSearch={onSearchApp}
                onSelect={handleSelect}
                onDeselect={handleDeselect}
                placeholder="Search and select apps"
                searchPlaceholder="Search app..."
                searchLoading={searchLoading}
              />
              <Button type="primary" onClick={handleCompareClick} className="btn-compare_app">
                Compare
              </Button>
            </div>
            <div className="show-alert">
              {showWarning && <Alert message="Please enter 2 or more apps to compare" type="warning" />}
            </div>
          </div>
        </div>
        <div className="bottom">
          <InfoAppCompare compareAppData={compareAppData || []} onAppAdd={handleAppFromInfoAppCompare} />
        </div>
      </div>
      <div className="content-tab_compare">
        <Tabs defaultActiveKey="1" items={items} type="card" />
      </div>
    </div>
  );
}
