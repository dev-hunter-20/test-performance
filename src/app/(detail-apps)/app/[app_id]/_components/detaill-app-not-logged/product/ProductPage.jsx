'use client';

import React, { useState, useCallback } from 'react';
import './ProductPage.scss';
import { Row, Col, Button, DatePicker, Modal, Skeleton } from 'antd';
import CategoryCollectionPos from '@/components/category-collection-pos/CategoryCollectionPos';
import dayjs from 'dayjs';
import { EditFilled, SearchOutlined } from '@ant-design/icons';
import ChartCategory from '@/components/chart/chart-category/ChartCategory';
import { convetDataChartChangeLog, createData } from '@/utils/functions';
import ChartWeeklyRating from '@/components/chart/chart-weekly-rating/ChartWeeklyRating';
import Auth from '@/utils/store/Authentication';
import Link from 'next/link';
import ChartChange from './chart/ChartChange';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import ItemDetail from '@/components/item-detail/ItemDetail';
import SkeletonImage from 'antd/es/skeleton/Image';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

export default function ProductPage(props) {
  const {
    infoApp,
    loadingCatCollection,
    dataCatCollection,
    fromDate,
    toDate,
    onChangeDateRange,
    disabledFutureDate,
    loadingAppInfo,
    searchByDate,
    dataDetailApp,
  } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const isLoading = !infoApp || !infoApp.data || !infoApp.data.detail;
  const pathname = usePathname();
  const parts = pathname.split('/');
  const appName = parts[2] || '';

  const imageScreenshots = infoApp?.data?.detail?.img || [];
  const mainImage = imageScreenshots.length > 0 ? imageScreenshots[0] : null;
  const otherImages = imageScreenshots.slice(1);
  const remainingImages = otherImages.length - 3;

  const showModal = (index) => {
    setCurrentIndex(index);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : imageScreenshots.length - 1));
  }, [imageScreenshots.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex < imageScreenshots.length - 1 ? prevIndex + 1 : 0));
  }, [imageScreenshots.length]);

  const dataAlternativesRender = () => {
    const data = infoApp?.data?.app_compare?.flatMap((item) => item.top_3_apps) || [];
    const uniqueData = Array.from(new Map(data.map((item) => [item.app_id, item])).values());
    const limitedData = uniqueData.slice(0, 6);
    const filteredDataApps = limitedData.filter((item) => item.app_id !== appName);

    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {filteredDataApps.map((item) => (
          <Col style={{ marginTop: '15px' }} lg={8} xs={12} md={12} key={item.app_id}>
            <ItemDetail value={item} />
          </Col>
        ))}
      </Row>
    );
  };

  const renderImages = () => {
    if (imageScreenshots.length === 0) {
      return (
        <div className="screen-shot">
          <SkeletonImage active={true} className="skeleton-image-custom" />
        </div>
      );
    }
    return (
      <div className="screen-shot">
        <div className="left">
          {mainImage && (
            <Image
              key={mainImage.src}
              src={mainImage.src}
              alt={mainImage.alt}
              width={300}
              height={300}
              priority={true}
              loading="eager"
              onClick={() => showModal(0)}
            />
          )}
        </div>
        <div className="right">
          {otherImages.slice(0, 3).map((img, index) => (
            <div key={index} className="image-left">
              {index === 2 && remainingImages > 0 ? (
                <Link href="#" onClick={() => showModal(index + 1)}>
                  <div className="see-more-container">
                    <Image src={img.src} alt={img.alt} width={150} height={150} />
                    <div className="see-more-overlay">
                      <span>{`+${remainingImages} more`}</span>
                    </div>
                  </div>
                </Link>
              ) : (
                <Image src={img.src} alt={img.alt} width={150} height={150} onClick={() => showModal(index + 1)} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container-product-page">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div className="detail-section">
            <div className="top">
              <h2>Details</h2>
              <div className="pen-login">
                <Button type="link" onClick={() => router.push('/auth/login-app')}>
                  <EditFilled />
                </Button>
              </div>
            </div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="content-desc content-meta">
                  <div className="label">
                    <span>App name</span>
                  </div>
                  {!infoApp ? (
                    <div className="value">
                      <Skeleton paragraph={{ rows: 0 }} active />
                    </div>
                  ) : (
                    <div className="value">
                      {infoApp?.data.detail.metadesc ? (
                        <span>{infoApp?.data.detail.metadesc}</span>
                      ) : (
                        <span>............</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="content-desc content-meta">
                  <div className="label">
                    <span>Tagline</span>
                  </div>
                  {!infoApp ? (
                    <div className="value">
                      <Skeleton paragraph={{ rows: 0 }} active />
                    </div>
                  ) : (
                    <div className="value">
                      {infoApp?.data.detail.tagline ? (
                        <span>{infoApp?.data.detail.tagline}</span>
                      ) : (
                        <span>............</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="content-desc content-meta">
                  <div className="label">
                    <span>Title tag</span>
                  </div>
                  {!infoApp ? (
                    <div className="value">
                      <Skeleton paragraph={{ rows: 0 }} active />
                    </div>
                  ) : (
                    <div className="value">
                      {infoApp?.data.detail.metatitle ? (
                        <span>{infoApp?.data.detail.metatitle}</span>
                      ) : (
                        <span>............</span>
                      )}
                    </div>
                  )}
                </div>
              </Col>
              <Col span={12}>
                <div className="content-desc content-meta">
                  <div className="label">
                    <span>Meta description</span>
                  </div>
                  {!infoApp ? (
                    <div className="value">
                      <Skeleton paragraph={{ rows: 0 }} active />
                    </div>
                  ) : (
                    <div className="value">
                      {infoApp?.data.detail.metadesc ? (
                        <span>{infoApp?.data.detail.metadesc}</span>
                      ) : (
                        <span>............</span>
                      )}
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <div className="desc">
              <div className="label">
                <span>Description</span>
              </div>
              <div className="value">
                {!infoApp ? (
                  <Skeleton paragraph={{ rows: 1 }} active />
                ) : (
                  <span>{infoApp?.data.detail.description || '............'}</span>
                )}
              </div>
            </div>

            <span className="screen-text">Screenshot</span>
            {renderImages()}
          </div>
        </Col>

        <Col span={24}>
          <div className="analytics-section">
            <h2>Analytics</h2>
            <CategoryCollectionPos
              isUnlist={infoApp?.data?.delete || infoApp?.data?.unlisted}
              loading={loadingCatCollection}
              dataCategory={dataCatCollection && dataCatCollection.dataCategory}
              dataCollection={dataCatCollection && dataCatCollection.dataCollection}
            />
            <div className="selected-date_range">
              {fromDate && toDate && (
                <div className="date-range">
                  <span className="title-name">Date Range: </span>
                  <div className="date-picker">
                    <RangePicker
                      defaultValue={[dayjs(fromDate, dateFormat), dayjs(toDate, dateFormat)]}
                      format={dateFormat}
                      allowClear={false}
                      onChange={onChangeDateRange}
                      disabledDate={disabledFutureDate}
                      style={{ marginRight: '10px' }}
                    />

                    <Button
                      type="primary"
                      loading={loadingAppInfo}
                      icon={<SearchOutlined />}
                      className="icon-search-date"
                      onClick={searchByDate}
                    >
                      Search
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="chart-weekly-category-keyword">
              <ChartCategory
                loading={loadingAppInfo}
                dataBestMatch={dataDetailApp && createData(dataDetailApp.dataCategoryPos.best_match)}
                dataPopular={dataDetailApp && createData(dataDetailApp.dataCategoryPos.popular)}
              />
            </div>
            <div className="chart-weekly-review-rating">
              <div className="chart-weekly-reviews">
                <ChartWeeklyRating
                  isReview
                  value={dataDetailApp && createData(dataDetailApp.reviewsChange)}
                  loading={loadingAppInfo}
                />
              </div>
              <div className="chart-weekly-rating">
                <ChartWeeklyRating
                  value={dataDetailApp && createData(dataDetailApp.ratingChange)}
                  loading={loadingAppInfo}
                />
              </div>
            </div>
            <div className="chart-weekly-change-trend">
              <div id="chart-log-weekly" className="chart-weekly-change">
                <ChartChange
                  value={
                    dataDetailApp &&
                    convetDataChartChangeLog(dataDetailApp && dataDetailApp.changeLog ? dataDetailApp.changeLog : [])
                  }
                  loading={loadingAppInfo}
                />
              </div>
            </div>
            <div className="data-from-ga">
              Connect your Google Analytics
              {!Auth.getAccessToken() && (
                <>
                  {' '}
                  or
                  <Link prefetch={false} href="/auth/login-app">
                    {' '}
                    login
                  </Link>
                </>
              )}{' '}
              to view the analyzed detail
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div className="alternatives-section">
            <h2>Alternatives</h2>
            <div className="item-app-compare">{dataAlternativesRender()}</div>
          </div>
        </Col>
      </Row>

      <Modal title="All Screenshots" open={isModalVisible} onCancel={handleCancel} footer={null} width={1300}>
        {imageScreenshots.length > 0 && (
          <div className="image-modal">
            <Button className="slick-prev" onClick={handlePrev} disabled={imageScreenshots.length <= 1} />
            <Image
              src={imageScreenshots[currentIndex].src}
              alt={imageScreenshots[currentIndex].alt}
              width={600}
              height={700}
              priority={true}
              loading="eager"
            />
            <Button className="slick-next" onClick={handleNext} disabled={imageScreenshots.length <= 1} />
          </div>
        )}
      </Modal>
    </div>
  );
}
