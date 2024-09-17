'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import dayjs from 'dayjs';
import { Breadcrumb, Button, DatePicker, Tabs } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import SelectCartHeader from '@/components/select-cart-header/SelectCartHeader';
import TableKeyword from '@/components/table-keyword/TableKeyword';
import SelectByLanguage from '@/components/ui/select-language/SelectByLanguage';
import CategoryCollectionPos from '@/components/category-collection-pos/CategoryCollectionPos';
import InfoApp from '@/components/info-app/InfoApp';
import { convetDataChartChangeLog, createData, renderButtonAddkey, renderTabTitle } from '@/utils/functions';
import Auth from '@/utils/store/Authentication';
import { useRouter } from 'next/navigation';

const ModalOverallCompare = dynamic(() => import('@/components/modal-overall-compare/ModalOverallCompare'), {
  ssr: false,
});
const ChartMerchantEarnings = dynamic(
  () => import('@/components/chart/chart-merchant-earnings/ChartMerchantEarnings'),
  { ssr: false },
);
const EarningByPlan = dynamic(() => import('@/components/chart/earning-by-plan/EarningByPlan'), { ssr: false });
const ChartInstallUnInstall = dynamic(
  () => import('@/components/chart/chart-install-unInstall/ChartInstallUnInstall'),
  { ssr: false },
);
const Retention = dynamic(() => import('@/components/chart/retention/Retention'), {
  ssr: false,
});
const CustomerLifecycle = dynamic(() => import('@/components/chart/customer-lifecycle/CustomerLifecycle'), {
  ssr: false,
});
const ChartCategory = dynamic(() => import('@/components/chart/chart-category/ChartCategory'), {
  ssr: false,
});
const ChartWeeklyKeyword = dynamic(() => import('@/components/chart/chart-weekly-keyword/ChartWeeklyKeyword'), {
  ssr: false,
});
const ChartWeeklyRating = dynamic(() => import('@/components/chart/chart-weekly-rating/ChartWeeklyRating'), {
  ssr: false,
});
const ChartChangeLog = dynamic(() => import('@/components/chart/chart-change-log/ChartChangeLog'), {
  ssr: false,
});
const DataGA = dynamic(() => import('@/components/data-ga/DataGA'), {
  ssr: false,
});
const ChurnAndReinstall = dynamic(() => import('@/components/chart/churn-and-reinstall/ChurnAndReinstall'), {
  ssr: false,
});
const ModalAddKeyword = dynamic(() => import('@/components/modal-add-keyword/ModalAddKeyword'), {
  ssr: false,
});
const ModalSettingCompare = dynamic(() => import('@/components/modal-setting-compare/ModalSettingCompare'), {
  ssr: false,
});
const ModalEditListingApp = dynamic(() => import('@/components/modal-edit-listing-app/ModalEditListingApp'), {
  ssr: false,
});
const ModalPositionKeyword = dynamic(() => import('@/components/modal-position-keyword/ModalPositionKeyword'), {
  ssr: false,
});
const ModalCompetitor = dynamic(() => import('@/components/modal-competitor/ModalCompetitor'), {
  ssr: false,
});
const ModalKeywordHidden = dynamic(() => import('@/components/modal-keyword-hidden/ModalKeywordHidden'), {
  ssr: false,
});
const ModalAddPartner = dynamic(() => import('@/components/modal-add-partner/ModalAddPartner'), {
  ssr: false,
});
const ModalCompareList = dynamic(() => import('@/components/modal-compare-list/ModalCompareList'), {
  ssr: false,
});

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

export default function DetailApp(props) {
  const router = useRouter();
  const {
    modalShow,
    isFollow,
    loading,
    dataByDate,
    dataCustomLifecycle,
    retentionData,
    countKeyword,
    dataKeywordsChange,
    dataKeywordsShow,
    loadingChangeLanguage,
    selectedValue,
    dataByDateSelected,
    fetchDataSyncPartner,
    dataTabNew,
    addKeywordHidden,
    saveKeyword,
    operations,
    onChangeTab,
    onEditTab,
    syncGoogleAnalytic,
    reloadKeyword,
    onConfirm,
    saveOrder,
    handleSelectChange,
    handleSelectFilter,
    openDetailPosition,
    openDetailPositionPopular,
    changeShowbadge,
    removeKeyword,
    onChangeSort,
    fromDate,
    toDate,
    setModalShow,
    id,
    keywordName,
    language,
    infoApp,
    competitor,
    keywordPosition,
    setCompetitor,
    isModalVisible,
    handleOk,
    handleCancel,
    AppName,
    isMobile,
    loadingAppInfo,
    setInfoApp,
    trackingApp,
    activeState,
    isLogged,
    loadingCatCollection,
    dataCatCollection,
    onChangeDateRange,
    disabledFutureDate,
    searchByDate,
    setDataKeywordsShow,
    dataDetailApp,
    idDetail,
    keywordNamePopular,
  } = props;

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="detail-app">
      {/*Start Modal */}
      <div className="popup-detail-add-partner">
        {modalShow === 'isVisibleAddPartner' && (
          <ModalAddPartner appId={id} disableModal={() => setModalShow()} fetchDataSyncPartner={fetchDataSyncPartner} />
        )}
      </div>
      <div className="popup-detail-position-key">
        {modalShow === 'isPositionKeyword' && (
          <ModalPositionKeyword
            appId={id}
            disableModal={() => setModalShow()}
            fromDate={fromDate}
            toDate={toDate}
            keywordName={keywordName.current}
            language={language}
          />
        )}
      </div>
      <div className="popup-detail-position-popular-key">
        {modalShow === 'isPositionPopularKeyword' && (
          <ModalPositionKeyword
            appId={id}
            disableModal={() => setModalShow()}
            fromDate={fromDate}
            toDate={toDate}
            keywordName={keywordNamePopular.current}
            language={language}
            isPopular
          />
        )}
      </div>
      <div className="popup-add-competitor">
        {modalShow === 'isVisibleCompetitor' && (
          <ModalCompetitor
            appId={id}
            disableModal={() => setModalShow()}
            dataTabNew={dataTabNew}
            competitor={competitor}
            infoApp={infoApp}
          />
        )}
      </div>
      <div className="popup-keyword-hidden">
        {modalShow === 'isVisibleKeywordHidden' && (
          <ModalKeywordHidden
            appId={id}
            disableModal={() => setModalShow()}
            keywordPosition={keywordPosition}
            addKeywordHidden={addKeywordHidden}
          />
        )}
      </div>
      <div>{modalShow === 'isVisibleCompare' && <ModalOverallCompare handleOk={() => setModalShow()} id={id} />}</div>
      <div className="popup-keyword-hidden">
        {modalShow === 'isVisibleEditApp' && (
          <ModalEditListingApp
            appId={id}
            disableModal={() => setModalShow()}
            data={{
              app_id: infoApp.data.app_id,
              detail: infoApp.data.detail,
              keyword_pos: keywordPosition,
            }}
          />
        )}
      </div>
      <div>
        {modalShow === 'isOpenSetting' && (
          <ModalSettingCompare
            setIsOpenSetting={setModalShow}
            compareApps={competitor}
            setCompetitor={setCompetitor}
            addCompetitor={() => setModalShow('isVisibleCompetitor')}
          />
        )}
      </div>
      <div className="popup-change-keyword">
        {modalShow === 'isEditKeyword' && (
          <ModalAddKeyword
            saveKeyword={saveKeyword}
            handleEditOk={() => setModalShow()}
            keywordExist={dataKeywordsShow}
            id={id}
          />
        )}
      </div>
      <div className="popup-compare-apps">
        <ModalCompareList
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          appId={id}
          infoApp={infoApp?.data || {}}
        />
      </div>
      {/*End Modal */}

      <>
        <div className="detail-developers-header">
          <div className="container">
            <Breadcrumb>
              <Breadcrumb.Item className="link">
                <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
                App
              </Breadcrumb.Item>
              <Breadcrumb.Item className="link">{AppName.current || ''}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className="competitor">
          <div className={isMobile ? 'p-20' : 'container'}>
            <Tabs
              type={
                (activeState != 1 && isLogged) || (infoApp && infoApp.gaConnected && activeState == 1)
                  ? 'editable-card'
                  : 'card'
              }
              tabBarExtraContent={!loadingAppInfo && isLogged && operations(isFollow)}
              addIcon={
                (activeState != 1 && isLogged) || (infoApp && infoApp.gaConnected && activeState == 1) ? (
                  <div className="add-competitor">
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      size="large"
                      onClick={() => setModalShow('isVisibleCompetitor')}
                    >
                      Add competitor
                    </Button>
                  </div>
                ) : (
                  <></>
                )
              }
              onChange={onChangeTab}
              activeKey={activeState}
              onEdit={onEditTab}
            >
              {competitor &&
                competitor.map((pane) => (
                  <TabPane
                    disabled={loading}
                    tab={renderTabTitle(pane.title, pane.key, activeState)}
                    key={pane.key}
                    closable={pane.closable}
                  >
                    {pane.content}
                  </TabPane>
                ))}
            </Tabs>
          </div>
        </div>

        <div className={isMobile ? 'p-20' : 'container'}>
          <div className="header-detail-app-info">
            <div className="header-detail-app-info-left">
              <div>
                <InfoApp
                  id={id}
                  editListingApp={() => setModalShow('isVisibleEditApp')}
                  editPartnerAppId={() => setModalShow('isVisibleAddPartner')}
                  AppName={AppName}
                  infoApp={infoApp}
                  loadingAppInfo={loadingAppInfo}
                  setInfoApp={setInfoApp}
                  fetchDataSyncPartner={fetchDataSyncPartner}
                  trackingApp={trackingApp}
                />
              </div>
            </div>
            <CategoryCollectionPos
              isUnlist={infoApp?.data?.delete || infoApp?.data?.unlisted}
              loading={loadingCatCollection}
              dataCategory={dataCatCollection && dataCatCollection.dataCategory}
              dataCollection={dataCatCollection && dataCatCollection.dataCollection}
            />
          </div>
        </div>

        <div className="selected-date_range container">
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

        <div className="body-detail-app">
          <div className={isMobile ? 'p-20' : 'container'}>
            {Auth.getAccessToken() ? (
              <>
                <div className="table-keyword-position">
                  <div className="header-table">
                    <div className="button-add">
                      {activeState && infoApp && activeState == 1 ? (
                        <div className="left">
                          {!infoApp.gaConnected && (
                            <span style={{ marginRight: '10px' }}>
                              <Link prefetch={false} href={''} onClick={syncGoogleAnalytic}>
                                Connect GA
                              </Link>{' '}
                              to show values of all columns
                            </span>
                          )}
                          <span className="reload" onClick={reloadKeyword()}>
                            <ReloadOutlined />
                          </span>
                          {renderButtonAddkey(
                            infoApp.isOwner,
                            !infoApp.isOwner ? onConfirm : () => setModalShow('isEditKeyword'),
                          )}
                        </div>
                      ) : (
                        ''
                      )}

                      <div
                        className={`save-order ${dataKeywordsShow.length === 0 ? 'disabled' : ''}`}
                        onClick={dataKeywordsShow.length !== 0 ? saveOrder : null}
                      >
                        Save order
                      </div>

                      <div className="language">
                        <SelectByLanguage
                          selectValue={language}
                          handleSelectChange={handleSelectChange}
                          disabled={loadingChangeLanguage || dataKeywordsShow.length == 0}
                        />
                      </div>
                    </div>
                  </div>
                  <TableKeyword
                    openDetailPosition={openDetailPosition}
                    openDetailPositionPopular={openDetailPositionPopular}
                    changeShowbadge={changeShowbadge}
                    removeKeyword={removeKeyword}
                    dataKeywordsShow={dataKeywordsShow}
                    setDataKeywordsShow={setDataKeywordsShow}
                    onChangeSort={onChangeSort}
                    loading={loadingChangeLanguage || loading}
                    appId={id}
                    tabKey={activeState}
                    infoApp={infoApp}
                  />
                  {countKeyword > 0 && infoApp && infoApp.gaConnected ? (
                    <div className="count-false" onClick={() => setModalShow('isVisibleKeywordHidden')}>
                      <span>
                        Appear on <b>{countKeyword}</b> other keywords
                      </span>
                    </div>
                  ) : (
                    <div className="count-false">{/*Appear on <b>{countKeyword}</b> other keywords*/}</div>
                  )}
                </div>
                {infoApp && infoApp.isOwner && infoApp.partnerConnected && (
                  <>
                    <div className="chart-merchant-growth-earnings">
                      <div className="filter-chart">
                        <SelectCartHeader
                          title={'Select filter by time period: '}
                          value={selectedValue}
                          onChange={handleSelectFilter}
                        />
                      </div>
                      <ChartMerchantEarnings
                        loading={loadingAppInfo}
                        value={dataByDate}
                        filterSelected={dataByDateSelected}
                        selectedValue={selectedValue}
                      />
                    </div>
                    {dataByDate && dataByDate.earning_by_pricing && dataByDate.earning_by_pricing.length > 1 && (
                      <div>
                        <EarningByPlan value={dataByDate} />
                      </div>
                    )}

                    <div className="chart-retention">
                      <ChartInstallUnInstall loading={loadingAppInfo} value={dataByDate}></ChartInstallUnInstall>
                    </div>
                    <div className="churn-reinstall">
                      <ChurnAndReinstall
                        loading={loadingAppInfo}
                        value={dataByDate}
                        appId={id}
                        fromDate={fromDate}
                        toDate={toDate}
                      />
                    </div>
                    <div className="chart-install-uninstall">
                      <Retention fromDate={fromDate} toDate={toDate} retention={retentionData} id={id} />
                    </div>
                  </>
                )}
                <div className="customer-lifecycle">
                  {infoApp && infoApp.isOwner && (infoApp.gaConnected || infoApp.partnerConnected) ? (
                    <CustomerLifecycle value={dataCustomLifecycle} infoApp={infoApp} />
                  ) : (
                    ''
                  )}
                </div>
              </>
            ) : (
              <></>
            )}
            <div className="chart-weekly-category-keyword">
              <ChartCategory
                loading={loadingAppInfo}
                dataBestMatch={dataDetailApp && createData(dataDetailApp.dataCategoryPos.best_match)}
                dataPopular={dataDetailApp && createData(dataDetailApp.dataCategoryPos.popular)}
              />
            </div>
            {Auth.getAccessToken() && (
              <>
                <div className="chart-weekly-category-keyword">
                  <div className="chart-weekly-keyword">
                    <ChartWeeklyKeyword
                      title={'Positional Keyword Changes'}
                      value={dataKeywordsChange && createData(dataKeywordsChange.bestMatch)}
                      loading={loadingAppInfo}
                    />
                  </div>
                </div>
              </>
            )}
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
                <ChartChangeLog
                  value={
                    dataDetailApp &&
                    convetDataChartChangeLog(dataDetailApp && dataDetailApp.changeLog ? dataDetailApp.changeLog : [])
                  }
                  loading={loadingAppInfo}
                />
              </div>
            </div>
            <div className="data-from-ga">
              {Auth.getAccessToken() && infoApp && infoApp.isOwner && infoApp.gaConnected ? (
                <DataGA value={dataCustomLifecycle && dataCustomLifecycle.dataGa} appId={idDetail} />
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
