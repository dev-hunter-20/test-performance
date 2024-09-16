'use client';

import React, { useState } from 'react';
import './AppPricing.scss';
import { Switch, Table, Tag } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { BASE_URL } from '@/common/constants';

export default function AppPricing({ compareAppData }) {
  const [isChecked, setIsChecked] = useState(false);

  const extractYearlyPrice = (text) => {
    if (text) {
      const match = text.match(/\$\d+(\.\d{1,2})?/);
      return match ? match[0] : text;
    } else {
      return '';
    }
  };

  const transposedDataPricing = [
    {
      key: 'pricingOptions',
      title: 'Pricing Options',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) => {
        const { just_paid, freemium, free } = item;

        const renderPricing = () =>
          just_paid && freemium && !free ? (
            <>
              <li>
                <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
                Subscription
              </li>
              <li>
                <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
                Free plan ( Limited Features )
              </li>
            </>
          ) : free && freemium ? (
            <>
              <li>
                <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
                Free trial
              </li>
              <li>
                <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
                Free plan ( Limited Features )
              </li>
            </>
          ) : !free && freemium && !just_paid ? (
            <li>
              <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
              Free plan ( Limited Features )
            </li>
          ) : (
            <li>
              <Image src="/image/check-icon-error.png" width={40} height={40} alt="icon-check" />
              No free trial
            </li>
          );

        return (
          <div className="text-options" key={item.app_id}>
            <div className="options">
              <b className="starts">Starts from </b>
              {item.pricing_max ? (
                <span>
                  <b>{item.pricing_min.split('/')[0]}</b>
                </span>
              ) : (
                <b className="free">Free</b>
              )}
            </div>
            <div className="pricing">
              <ul>
                <div className="check">{renderPricing()}</div>
              </ul>
            </div>
          </div>
        );
      }),
    },
    {
      key: 'pricingPlans',
      title: (
        <div className="title-pricing_plan">
          Pricing Plans
          <div className="isCheck">
            <span className={isChecked ? '' : 'text-yellow'}>Monthly</span>&nbsp;
            <Switch defaultChecked={isChecked} onChange={(checked) => setIsChecked(checked)} />
            &nbsp;
            <span className={isChecked ? 'text-yellow' : ''}>Yearly</span>
          </div>
        </div>
      ),
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) =>
        item.detail.pricing_plan.map((plan, index) => (
          <>
            {isChecked ? (
              <>
                {plan.yearly !== null && plan.yearly ? (
                  <div key={index} className="plan">
                    <Tag className="tag-pricing" color="orange">
                      <span className="text-plan">{plan.title}</span>
                      <span className="price">{`${extractYearlyPrice(plan.yearly)} /year`}</span>
                    </Tag>
                  </div>
                ) : null}
              </>
            ) : (
              <div key={index} className="plan">
                <Tag className="tag-pricing" color="orange">
                  <span className="text-plan">{plan.title}</span>
                  <span className="price">
                    {extractYearlyPrice(plan.pricing)}{' '}
                    {plan.pricing !== 'Free' && plan.pricing !== 'Free to install' ? '/month' : ''}
                  </span>
                </Tag>
              </div>
            )}
          </>
        )),
      ),
    },
    {
      key: 'viewPricingPlans',
      title: 'View Pricing Plans',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) => (
        <div key={item.app_id} className="view-pricing">
          <Link href={`${BASE_URL}app/${item.detail.app_id}/pricing`} target={`_blank${item.app_id}`} key={item.app_id}>
            View Pricing plans
          </Link>
        </div>
      )),
    },
  ];

  const columnsPricing = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      width: 200,
    },
    ...[compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item, index) => ({
      title: item.detail.name,
      dataIndex: `value${index}`,
      key: `value${index}`,
      width: 347,
    })),
  ];

  const dataSourcePricing = transposedDataPricing.map((row) => {
    const rowData = { key: row.key, title: row.title };
    row.values.forEach((value, index) => {
      rowData[`value${index}`] = value;
    });
    return rowData;
  });

  return (
    <div className="app-pricing">
      <h2>Pricing</h2>
      <Table
        dataSource={dataSourcePricing}
        columns={columnsPricing}
        pagination={false}
        scroll={{ x: 1500 }}
        className="table-app"
      />
    </div>
  );
}
