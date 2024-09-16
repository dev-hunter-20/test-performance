'use client';

import React, { useMemo } from 'react';
import "./EarningByPlan.scss";
import { Pie } from "@ant-design/plots";
import "./EarningByPlan.scss";
import { capitalize } from "lodash";

export default function EarningByPlan(props) {
  const value = props.value.earning_by_pricing;

  const dataChart = useMemo(() => {
    const dataPlan = value
      ? value
          .filter((item) => item.count && item.price_name !== 'MONTHLY PAYMENT' && item.price_name !== 'YEARLY PAYMENT')
          .map((item) => {
            return {
              type: item ? (item.price !== 'other' ? item.price_name + ' - ' + capitalize(item.type) : 'Other') : '',
              value: item.count * item.price.toFixed(0),
            };
          })
      : [];

    const sumOtherMonthly = value
      .filter((item) => item.price_name === 'MONTHLY PAYMENT')
      .reduce((acc, item) => acc + item.count * item.price.toFixed(0), 0);

    const sumOtherYearly = value
      .filter((item) => item.price_name === 'YEARLY PAYMENT')
      .reduce((acc, item) => acc + item.count * item.price.toFixed(0), 0);

    const dataOtherPlan = [
      sumOtherMonthly
        ? {
            type: 'Other - Monthly',
            value: sumOtherMonthly,
          }
        : {},
      sumOtherYearly
        ? {
            type: 'Other - Yearly',
            value: sumOtherYearly,
          }
        : {},
    ];
    return [...dataPlan, ...dataOtherPlan];
  }, [value]);

  const config = {
    appendPadding: 10,
    data: dataChart,
    angleField: 'value',
    colorField: 'type',
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent, value }) => `$${value.toLocaleString('US', { maximumFractionDigits: 0 })}`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    legend: {
      position: 'right',
      itemName: {
        formatter: (text, item) => {
          return `${text.length > 12 ? `${text.substring(0, 12)}...` : text}`;
        },
      },
    },
  };

  const getPricePlan = (plans) => {
    const uniquePrices = {};
    return plans
      ? plans
          .filter((item) => item.type !== 'other')
          .filter((element) => {
            const { price_monthly } = element;
            if (uniquePrices[price_monthly]) {
              return false;
            }
            uniquePrices[price_monthly] = true;
            return true;
          })
      : [];
  };

  const data = useMemo(() => {
    const dataMonthly = value ? value.filter((item) => item.type === 'monthly') : [];

    const dataYearly = value ? value.filter((item) => item.type === 'yearly') : [];
    const sumCount = value
      ? value
          .filter((item) => item.type !== 'other')
          .reduce((accumulator, item) => accumulator + item.price * item.count, 0)
      : 0;

    return getPricePlan(value).map((item) => {
      const yearly = dataYearly.find((ele) => ele.price_monthly === item.price_monthly);
      const monthly = dataMonthly.find((ele) => ele.price_monthly === item.price_monthly);
      return {
        price: item ? `$${item.price_monthly}` : ' ',
        merchants_yearly: yearly ? yearly.count : 0,
        merchants_monthly: monthly ? monthly.count : 0,
        rev_yearly: yearly ? Math.round(yearly.count * yearly.price) : 0,
      rev_monthly: monthly ? Math.round(monthly.count * monthly.price_monthly) : 0,
        percent_yearly: yearly ? `${(((yearly.count * yearly.price) / sumCount) * 100).toFixed(2)}%` : 0,
        percent_monthly: monthly ? `${(((monthly.count * monthly.price_monthly) / sumCount) * 100).toFixed(2)}%` : 0,
      };
    });
  }, [value]);

  const getTotalMerchants = (value) => {
    const sumMerchants = value
      ? value.filter((item) => item.type !== 'other').reduce((accumulator, item) => accumulator + item.count, 0)
      : 0;
    return sumMerchants;
  };

  const getTotalRev = (value) => {
    const sumRev = value
      ? value
          .filter((item) => item.type !== 'other')
          .reduce((accumulator, item) => accumulator + item.count * item.price, 0)
      : 0;
    return sumRev;
  };

  const renderValueByType = (item, type) => {
    switch (type) {
      case 'merchants_monthly':
        return item.merchants_monthly;
      case 'merchants_yearly':
        return item.merchants_yearly;
      case 'rev_monthly':
        return Math.round(item.rev_monthly);
      default:
        return Math.round(item.rev_yearly);
    }
  };

  const getSyntheticValue = (data, type) => {
    return data.reduce((accumulator, item) => accumulator + renderValueByType(item, type), 0).toLocaleString('en-US');
  };

  return (
    <div className="row-earning">
      <div className="title-earning">
        <span>Active Charge by Plans</span>
      </div>
      <div className="content-earning">
        <div className="table-earning-value">
          <table className="styled-table">
            <thead>
              <tr>
                <th rowSpan={2} className="thead-parent">
                  Price Plan
                </th>
                <th colSpan={3} className="thead-parent text-center">
                  Monthly
                </th>
                <th
                  colSpan={3}
                  className="text-center"
                  style={{
                    fontSize: '18px',
                  }}
                >
                  Yearly
                </th>
              </tr>
              <tr>
                <th>Merchants</th>
                <th>Revenue</th>
                <th>%</th>
                <th>Merchants</th>
                <th>Revenue</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((item, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 'bold' }}>{item.price || ' '}</td>
                    <td>{item.merchants_monthly ? item.merchants_monthly.toLocaleString('en-US') : ' '}</td>
                    <td>{item.rev_monthly ? `$${Math.round(item.rev_monthly).toLocaleString('en-US')}` : ' '}</td>
                    <td>{item.percent_monthly || ' '}</td>
                    <td>{item.merchants_yearly || ' '}</td>
                    <td>{item.rev_yearly ? `$${Math.round(item.rev_yearly).toLocaleString('en-US')}` : ' '}</td>
                    <td>{item.percent_yearly || ' '}</td>
                  </tr>
                ))}
              <tr className="sum-row">
                <td>
                  <p>Sum</p>
                  <p>Percent</p>
                </td>
                <td>
                  <p>{getSyntheticValue(data, 'merchants_monthly')}</p>
                  <p>
                    {((getSyntheticValue(data, 'merchants_monthly').replace(',', '') / getTotalMerchants(value)) * 100)
                      .toFixed(2)
                      .toLocaleString('en-US')}
                    %
                  </p>
                </td>
                <td>
                  <p>${getSyntheticValue(data, 'rev_monthly')}</p>
                  <p>
                    {(
                      (data.reduce((accumulator, item) => accumulator + +item.rev_monthly, 0) / getTotalRev(value)) *
                      100
                    )
                      .toFixed(2)
                      .toLocaleString('en-US')}
                    %
                  </p>
                </td>
                <td></td>
                <td>
                  <p>{getSyntheticValue(data, 'merchants_yearly')}</p>
                  <p>
                    {((getSyntheticValue(data, 'merchants_yearly').replace(',', '') / getTotalMerchants(value)) * 100)
                      .toFixed(2)
                      .toLocaleString('en-US')}
                    %
                  </p>
                </td>
                <td>
                  <p>${getSyntheticValue(data)}</p>
                  <p>
                    {(
                      (data.reduce((accumulator, item) => accumulator + +item.rev_yearly, 0) / getTotalRev(value)) *
                      100
                    )
                      .toFixed(2)
                      .toLocaleString('en-US')}
                    %
                  </p>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="percent-chart">
          <Pie {...config} style={{ maxHeight: '350px' }} />
        </div>
      </div>
    </div>
  );
}
