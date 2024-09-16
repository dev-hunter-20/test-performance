'use client';

import DashboardApiService from '@/api-services/api/DashboardApiService';
import TableApp from '@/components/landing-page/table-app/TableApp';
import Pagination from '@/components/ui/pagination/Pagination';
import { Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

export default function ModalAppMostReview({ handleCancel, fromDate, toDate }) {
  const [loading, setLoading] = useState(false);
  const [listApp, setListApp] = useState([]);
  const page = useRef(1);
  const perPage = 10;
  const [check, setCheck] = useState(false);

  useEffect(() => {
    getAppsMostReview(page.current, perPage);
    setCheck(true);
  }, []);

  const getAppsMostReview = async (page, per_page) => {
    setLoading(true);
    const res = await DashboardApiService.getAppsMostReview(page, per_page);
    if (res && res.code == 0) {
      setLoading(false);
      setListApp(res.result);
    }
  };

  const onChangePage = (page) => {
    getAppsMostReview(page, perPage);
  };

  const renderDataSource = (data) => {
    return data.map((item) => {
      const app = item.detail;
      return {
        app: {
          img: app.app_icon,
          name: app.name || ' ',
          desc: app.metatitle || ' ',
          slug: app.app_id,
        },
        diffRank: item.review_count.toString(),
      };
    });
  };

  return (
    <>
      {check && (
        <Modal
          width={'50%'}
          title="Top 10 apps most review"
          visible={true}
          footer={null}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <div className="modal-churn-value">
            <TableApp
              item={{
                title: 'Applications',
                data: renderDataSource(listApp),
              }}
              isReview
              loading={loading}
            />
          </div>
          <div style={{ marginTop: '20px' }} className="flex justify-center">
            <Pagination
              pageSize={perPage}
              current={page.current}
              onChange={(pageNumber) => {
                page.current = pageNumber;
                onChangePage(pageNumber);
              }}
              total={50}
              showSizeChanger={false}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} apps`}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
