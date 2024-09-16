'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Pagination, Rate, Progress, Select, Spin, Button, Breadcrumb, Empty, message } from 'antd';
import './ReviewApp.scss';
import ReviewItem from './item/ReviewItem';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Auth from '@/utils/store/Authentication';
import LayoutDetailApp from '../detaill-app-not-logged/LayoutDetailApp';

export default function ReviewApp() {
  const params = useParams();
  const idDetail = params.app_id;
  const PAGE_DEFAULT_REVIEW = 1;
  const PER_PAGE_REVIEW = 10;
  const [listOfReview, setListOfReview] = useState([]);
  const [total, setTotal] = useState();
  const [countData, setCountData] = useState([]);
  const [sort, setSort] = useState('create_date');
  const [isDeleted, setIsDeleted] = useState(0);
  const [loading, setLoading] = useState(false);
  const [nameLocation, setNameLocation] = useState('');
  const [rating, setRating] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [replyTime, setReplyTime] = useState('');
  const [reviewNature, setReviewNature] = useState('');
  const [showReply, setShowReply] = useState([]);
  const [valueFilter, setValueFilter] = useState([]);
  const isAuth = Auth.isAuthenticated();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  // Get review list
  const getReviewListDetailApp = async (
    id,
    is_deleted,
    pageDefault,
    perPage,
    sort_by,
    reviewer_location,
    time_spent_using_app,
    rating,
    replyTime,
    reviewNature,
  ) => {
    setLoading(true);
    const res = await DetailAppApiService.getReviewApp(
      id,
      is_deleted,
      pageDefault,
      perPage,
      sort_by,
      reviewer_location,
      time_spent_using_app,
      rating,
      replyTime,
      reviewNature,
    );
    setShowReply([]);
    if (res.code === 0) {
      setLoading(false);
      setListOfReview(res);
      setTotal(res.total_all);
    } else {
      message.error(res.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getReviewListDetailApp(
      idDetail,
      isDeleted,
      PAGE_DEFAULT_REVIEW,
      PER_PAGE_REVIEW,
      sort,
      nameLocation,
      timeSpent,
      rating,
      reviewNature,
      replyTime,
    );
    async function countDataSummary(id) {
      const res = await DetailAppApiService.getReviewAppInfoSummary(id);
      setCountData(res.data);
    }
    countDataSummary(idDetail);
    return () => {};
  }, [sort, isDeleted, nameLocation, timeSpent, rating, reviewNature, replyTime]);

  const handleClickGetItem = (type, value) => {
    if (type === 'location') {
      setValueFilter([...valueFilter, value]);
      setNameLocation(value);
    } else if (type === 'rating') {
      setValueFilter([...valueFilter, `${value} star`]);
      setRating(value);
    } else if (type === 'reply_time') {
      setValueFilter([...valueFilter, value]);
      setReplyTime(value);
    } else if (type === 'review_nature') {
      setValueFilter([...valueFilter, value]);
      setReviewNature(value);
    } else {
      setValueFilter([...valueFilter, value]);
      setTimeSpent(value);
    }
  };

  const handleClickResetData = () => {
    getReviewListDetailApp(idDetail, 0, PAGE_DEFAULT_REVIEW, PER_PAGE_REVIEW, 'create_date', '', '', '', '', '');
    setNameLocation('');
    setTimeSpent('');
    setRating('');
    setReplyTime('');
    setReviewNature('');
    setValueFilter([]);
  };

  const handleChangeSort = (value) => {
    setIsDeleted(value);
    if (value === 0 || value === 1) {
      setIsDeleted(value);
    }
    if (value === 2) {
    }
  };

  const checkTimeSpent = (type) => {
    switch (type) {
      case 'lt_1_days':
        return 'Less than 1 day';
      case 'lt_3_days':
        return 'Less than 3 days';
      case 'lt_7_days':
        return 'Less than 7 days';
      case 'lt_14_days':
        return 'Less than 14 days';
      case 'lt_28_days':
        return 'Less than 28 days';
      default:
        return 'Other';
    }
  };

  const sumReviews = (data) => {
    return data.reduce((total, item) => total + item.total_reviews, 0);
  };

  const renderNature = (data) => {
    return [
      {
        title: 'Negative',
        label: data.negative,
        value: 'negative',
      },
      {
        title: 'Positive',
        label: data.positive,
        value: 'positive',
      },
      {
        title: 'Objective',
        label: data.objective,
        value: 'objective',
      },
      {
        title: 'Subjective',
        label: data.subjective,
        value: 'subjective',
      },
    ];
  };

  const getSumNature = (count) => {
    return count.negative + count.positive + count.objective + count.subjective;
  };

  return (
    <>
      {isAuth ? (
        <Spin spinning={loading}>
          <div className="detail-developers-header">
            <div className="container">
              <Breadcrumb>
                <Breadcrumb.Item>
                  <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
                  App
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link prefetch={false} href={`/app/${countData?.app_id}`}>
                    {countData?.app_name}
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Reviews</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          {countData && countData.total_reviews > 0 ? (
            <div className="container">
              <div className="review_app_wrapper">
                <div className="review_app_flex_box_title">
                  <div>
                    <h1 className="review_app_name">{countData?.app_name} Reviews</h1>
                    <p className="review_app_name_overall">Total: {total} reviews</p>
                  </div>
                  <div className="scroll_list_show_normal">
                    <p className="title_style">Overall rating</p>
                    {countData.rating?.map(
                      (item, index) =>
                        item._id !== null && (
                          <div key={index} className="review_app_flex_box_title_wrapper">
                            <p className="overall_rating">{item._id}</p>

                            <Rate disabled={true} style={{ color: '#ffc225' }} count={1} value={1}></Rate>
                            <Progress
                              showInfo={false}
                              percent={(item.total_reviews / sumReviews(countData.rating)) * 100}
                            />
                            <p className="onhover_click_data" onClick={() => handleClickGetItem('rating', item._id)}>
                              {item.total_reviews}
                            </p>
                          </div>
                        ),
                    )}
                  </div>
                  <div>
                    <p className="title_style">Top Locations</p>
                    <div className="scroll_list_show">
                      {countData.reviewer_location?.map(
                        (item, index) =>
                          item._id !== null && (
                            <div key={index} className="review_app_flex_box_title_wrapper">
                              <p>{item.value}</p>
                              <Progress
                                showInfo={false}
                                percent={(item.total_reviews / sumReviews(countData.reviewer_location)) * 100}
                              />
                              <p
                                className="onhover_click_data"
                                onClick={() => handleClickGetItem('location', item._id)}
                              >
                                {item.total_reviews}
                              </p>
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="title_style">Time Spent</p>
                    <div className="scroll_list_show">
                      {countData.time_spent_using_app?.map(
                        (item, index) =>
                          item._id !== null && (
                            <div key={index} className="review_app_flex_box_title_wrapper">
                              <p>{checkTimeSpent(item._id)}</p>
                              <Progress
                                showInfo={false}
                                percent={(item.total_reviews / sumReviews(countData.time_spent_using_app)) * 100}
                              />
                              <p
                                className="onhover_click_data"
                                onClick={() => handleClickGetItem('timeSpent', item._id)}
                              >
                                {item.total_reviews}
                              </p>
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="title_style">Review Reply Time</p>
                    <div className="scroll_list_show">
                      {countData.time_reply
                        ?.filter((item) => item.total_reviews)
                        ?.map(
                          (item, index) =>
                            item._id !== null && (
                              <div key={index} className="review_app_flex_box_title_wrapper">
                                <p>{checkTimeSpent(item._id)}</p>
                                <Progress
                                  showInfo={false}
                                  percent={(item.total_reviews / sumReviews(countData.time_reply)) * 100}
                                />
                                <p
                                  className="onhover_click_data"
                                  onClick={() => handleClickGetItem('reply_time', item._id)}
                                >
                                  {item.total_reviews}
                                </p>
                              </div>
                            ),
                        )}
                    </div>
                  </div>
                  <div>
                    <p className="title_style">Nature of reviews</p>
                    <div className="scroll_list_show">
                      {renderNature(countData)?.map((item, index) => (
                        <div key={index} className="review_app_flex_box_title_wrapper">
                          <p>{item.title}</p>
                          <Progress showInfo={false} percent={(item.label / getSumNature(countData)) * 100} />
                          <p
                            className="onhover_click_data"
                            onClick={() => handleClickGetItem('review_nature', item.value)}
                          >
                            {item.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="review_app_flex_box_content">
                  <div className="review_app_flex_box_content_sort">
                    <p>Show: </p>
                    <Select
                      defaultValue="create_date"
                      style={{ width: 130 }}
                      onChange={(value) => setSort(value)}
                      options={[
                        { value: 'create_date', label: 'Create Date' },
                        {
                          value: 'relevance_position',
                          label: 'Relevance Position',
                        },
                      ]}
                    />
                    <Select
                      defaultValue={0}
                      style={{ width: 130 }}
                      onChange={handleChangeSort}
                      options={[
                        { value: 0, label: 'Full Reviews' },
                        { value: 1, label: 'Deleted' },
                        // { value: 2, label: "Total reviews" },
                      ]}
                    />
                    {valueFilter.length ? (
                      <>
                        <Select
                          mode="multiple"
                          disabled
                          style={{
                            width: '50%',
                          }}
                          value={valueFilter}
                        />
                        <Button type="primary" icon={<PoweroffOutlined />} onClick={() => handleClickResetData()}>
                          {' '}
                          Reset Filter{' '}
                        </Button>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                  {listOfReview && (
                    <ReviewItem
                      data={listOfReview}
                      appName={countData ? countData.app_name : 'N/A'}
                      showReply={showReply}
                      setShowReply={setShowReply}
                    />
                  )}
                  {listOfReview.data?.length ? (
                    <Pagination
                      total={listOfReview.total_all}
                      onChange={(page, pageSize) =>
                        getReviewListDetailApp(
                          idDetail,
                          isDeleted,
                          page,
                          pageSize,
                          sort,
                          nameLocation,
                          timeSpent,
                          rating,
                          reviewNature,
                          replyTime,
                        )
                      }
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total.toLocaleString('en-US')} reviews`
                      }
                    />
                  ) : (
                    !loading && (
                      <div className="text-center" style={{ fontSize: '20px', color: '#b3b3b3' }}>
                        Not found data search!!!
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
          )}
        </Spin>
      ) : (
        <LayoutDetailApp>
          <Spin spinning={loading}>
            {countData && countData.total_reviews > 0 ? (
              <div className="container">
                <div className="review_app_wrapper">
                  <div className="review_app_flex_box_title">
                    <div>
                      <h1 className="review_app_name">{countData?.app_name} Reviews</h1>
                      <p className="review_app_name_overall">Total: {total} reviews</p>
                    </div>
                    <div className="scroll_list_show_normal">
                      <p className="title_style">Overall rating</p>
                      {countData.rating?.map(
                        (item, index) =>
                          item._id !== null && (
                            <div key={index} className="review_app_flex_box_title_wrapper">
                              <p className="overall_rating">{item._id}</p>

                              <Rate disabled={true} style={{ color: '#ffc225' }} count={1} value={1}></Rate>
                              <Progress
                                showInfo={false}
                                percent={(item.total_reviews / sumReviews(countData.rating)) * 100}
                              />
                              <p className="onhover_click_data" onClick={() => handleClickGetItem('rating', item._id)}>
                                {item.total_reviews}
                              </p>
                            </div>
                          ),
                      )}
                    </div>
                    <div>
                      <p className="title_style">Top Locations</p>
                      <div className="scroll_list_show">
                        {countData.reviewer_location?.map(
                          (item, index) =>
                            item._id !== null && (
                              <div key={index} className="review_app_flex_box_title_wrapper">
                                <p>{item.value}</p>
                                <Progress
                                  showInfo={false}
                                  percent={(item.total_reviews / sumReviews(countData.reviewer_location)) * 100}
                                />
                                <p
                                  className="onhover_click_data"
                                  onClick={() => handleClickGetItem('location', item._id)}
                                >
                                  {item.total_reviews}
                                </p>
                              </div>
                            ),
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="title_style">Time Spent</p>
                      <div className="scroll_list_show">
                        {countData.time_spent_using_app?.map(
                          (item, index) =>
                            item._id !== null && (
                              <div key={index} className="review_app_flex_box_title_wrapper">
                                <p>{checkTimeSpent(item._id)}</p>
                                <Progress
                                  showInfo={false}
                                  percent={(item.total_reviews / sumReviews(countData.time_spent_using_app)) * 100}
                                />
                                <p
                                  className="onhover_click_data"
                                  onClick={() => handleClickGetItem('timeSpent', item._id)}
                                >
                                  {item.total_reviews}
                                </p>
                              </div>
                            ),
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="title_style">Review Reply Time</p>
                      <div className="scroll_list_show">
                        {countData.time_reply
                          ?.filter((item) => item.total_reviews)
                          ?.map(
                            (item, index) =>
                              item._id !== null && (
                                <div key={index} className="review_app_flex_box_title_wrapper">
                                  <p>{checkTimeSpent(item._id)}</p>
                                  <Progress
                                    showInfo={false}
                                    percent={(item.total_reviews / sumReviews(countData.time_reply)) * 100}
                                  />
                                  <p
                                    className="onhover_click_data"
                                    onClick={() => handleClickGetItem('reply_time', item._id)}
                                  >
                                    {item.total_reviews}
                                  </p>
                                </div>
                              ),
                          )}
                      </div>
                    </div>
                    <div>
                      <p className="title_style">Nature of reviews</p>
                      <div className="scroll_list_show">
                        {renderNature(countData)?.map((item, index) => (
                          <div key={index} className="review_app_flex_box_title_wrapper">
                            <p>{item.title}</p>
                            <Progress showInfo={false} percent={(item.label / getSumNature(countData)) * 100} />
                            <p
                              className="onhover_click_data"
                              onClick={() => handleClickGetItem('review_nature', item.value)}
                            >
                              {item.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="review_app_flex_box_content">
                    <div className="review_app_flex_box_content_sort">
                      <p>Show: </p>
                      <Select
                        defaultValue="create_date"
                        style={{ width: 130 }}
                        onChange={(value) => setSort(value)}
                        options={[
                          { value: 'create_date', label: 'Create Date' },
                          {
                            value: 'relevance_position',
                            label: 'Relevance Position',
                          },
                        ]}
                      />
                      <Select
                        defaultValue={0}
                        style={{ width: 130 }}
                        onChange={handleChangeSort}
                        options={[
                          { value: 0, label: 'Full Reviews' },
                          { value: 1, label: 'Deleted' },
                          // { value: 2, label: "Total reviews" },
                        ]}
                      />
                      {valueFilter.length ? (
                        <>
                          <Select
                            mode="multiple"
                            disabled
                            style={{
                              width: '50%',
                            }}
                            value={valueFilter}
                          />
                          <Button type="primary" icon={<PoweroffOutlined />} onClick={() => handleClickResetData()}>
                            {' '}
                            Reset Filter{' '}
                          </Button>
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                    {listOfReview && (
                      <ReviewItem
                        data={listOfReview}
                        appName={countData ? countData.app_name : 'N/A'}
                        showReply={showReply}
                        setShowReply={setShowReply}
                      />
                    )}
                    {listOfReview.data?.length ? (
                      <Pagination
                        total={listOfReview.total_all}
                        onChange={(page, pageSize) =>
                          getReviewListDetailApp(
                            idDetail,
                            isDeleted,
                            page,
                            pageSize,
                            sort,
                            nameLocation,
                            timeSpent,
                            rating,
                            reviewNature,
                            replyTime,
                          )
                        }
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} of ${total.toLocaleString('en-US')} reviews`
                        }
                      />
                    ) : (
                      !loading && (
                        <div className="text-center" style={{ fontSize: '20px', color: '#b3b3b3' }}>
                          Not found data search!!!
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
            )}
          </Spin>
        </LayoutDetailApp>
      )}
    </>
  );
}
