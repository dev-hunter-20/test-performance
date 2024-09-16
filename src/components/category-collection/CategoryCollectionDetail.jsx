'use client';

import CategoriesApiService from '@/api-services/api/CategoriesApiService';
import { encodeQueryParams, getParameterQuery } from '@/utils/functions';
import { Breadcrumb, Col, Dropdown, Empty, Menu, message, Pagination, Row, Space, Spin } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import './CategoryCollectionDetail.scss';
import { optionsLanguage, optionsPricingtype, optionsSortBy, optionsSortType } from '@/utils/FilterOption';
import { ArrowLeftOutlined, DownOutlined } from '@ant-design/icons';
import ItemApp from './item-app/ItemApp';

export default function CategoryCollectionDetail() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const isCategory = pathname.includes('category');
  const [data, setData] = useState();
  const [pricingRange, setPricingRange] = useState();
  const [avgPrice, setAvgPrice] = useState();
  const [dataCategory, setDataCategory] = useState();
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState();
  const [sort_by, setSort_by] = useState(params.sort_by ? params.sort_by : 'best_match');
  const [language, setLanguage] = useState(params.language ? params.language : 'uk');
  const [priceType, setPriceType] = useState(params.price_type ? params.price_type : 'all');
  const [sortType, setSortType] = useState(params.sort_type ? params.sort_type : 'rank');
  const [priceRange, setPriceRange] = useState('all');
  const parts = pathname.split('/');
  const lastPart = parts[parts.length - 1];
  const id = lastPart;
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const fetchData = async (id, page, per_page, sort_by, language, sortType, priceType, priceRange) => {
    setLoading(true);
    const range = pricingRange ? pricingRange.find((item, index) => index + 1 == priceRange) : {};
    const rangeMax = range ? range.max : 0;
    const rangeMin = range ? range.min : 0;

    let result = isCategory
      ? await CategoriesApiService.getConversationCategory(
          id,
          sort_by,
          page,
          per_page,
          language,
          sortType,
          priceType,
          rangeMin,
          rangeMax,
        )
      : await CategoriesApiService.getConversationCollection(
          id,
          sort_by === 'popular' ? 'most_popular' : 'best_match',
          page,
          per_page,
          language,
          sortType,
          priceType,
          rangeMin,
          rangeMax,
        );
    setLoading(false);
    if (result && result.code == 0) {
      setData(result.data);
      setPricingRange(result.filter_range_price);
      setAvgPrice(result.price_avg);
      setDataCategory(result.data.apps);
      setCurrentPage(result.current_page);
      setTotal(result.total);
    } else {
      message.error('Internal Server Error');
    }
  };

  useEffect(() => {
    fetchData(id, page, perPage, sort_by, language, sortType, priceType, priceRange);
  }, [language, page, priceType, sortType, sort_by, priceRange]);

  const checkLocale = () => {
    if (language === 'us') {
      return '';
    }
    if (language === 'cn') {
      return 'zh-CN';
    }
    if (language === 'tw') {
      return 'zh-TW';
    }
    return `${language}`;
  };

  const getLinkNameCategory = () => {
    if (id === 'built-for-shopify') {
      return `apps.shopify.com/app-groups/highlights/${id}?sort_by=${sort_by}&locale=${checkLocale(language)}`;
    }
    if (id === 'made-by-shopify') {
      return `apps.shopify.com/partners/shopify`;
    }
    return `apps.shopify.com/${isCategory ? 'categories' : 'collections'}/${id}?${
      language === 'uk' ? '' : `locale=${checkLocale(language)}&`
    }sort_by=${!isCategory && sort_by === 'popular' ? 'most_popular' : sort_by}`;
  };

  const renderDropdown = (options, title, value) => {
    const isDisabled = title === 'Price Range' && priceType === 'free';
    return (
      <Dropdown overlay={options} disabled={isDisabled ? true : false}>
        <Space>
          <div className={`${isDisabled ? 'disabled' : ''} sort-container flex items-center`}>
            {title}:<div className="sort-value text-capitalize">{value}</div>
            <DownOutlined />
          </div>
        </Space>
      </Dropdown>
    );
  };

  const handleChangeSort = (type, value) => {
    switch (type) {
      case 'sortBy':
        setSort_by(value);
        return;
      case 'sortType':
        setSortType(value);
        return;
      case 'language':
        setLanguage(value);
        return;
      case 'priceType':
        setPriceType(value);
        return;
      default:
        setPriceRange(value);
        return;
    }
  };

  const renderOption = (options, type) => {
    return (
      <Menu>
        {options.map((item, index) => (
          <Menu.Item key={index} onClick={() => handleChangeSort(type, item.value)}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  const optionPricingRange = useMemo(() => {
    return pricingRange
      ? [
          { label: 'All', value: 0 },
          ...pricingRange.map((item, index) => {
            return { label: `$${item.min} - $${item.max}`, value: index + 1 };
          }),
        ]
      : [];
  }, [pricingRange]);

  const rangeSelected = useMemo(() => {
    const range = optionPricingRange.find((item, index) => index === priceRange);
    return range ? range.label : 'All';
  }, [optionPricingRange, priceRange]);

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page: page,
      per_page: per_page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    fetchData(id, page, per_page, sort_by, language, sortType, priceType, priceRange);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Spin spinning={loading}>
      <div className="detail-categories">
        <div className="detail-categories-header">
          <div className="container">
            <Breadcrumb>
              <Breadcrumb.Item>
              <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />

                <Link prefetch={false} href={data ? `/${isCategory ? 'categories' : 'collections'}` : ''}>
                  {isCategory ? 'Categories' : 'Collections'}
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{data && data.text ? data.text : ''}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        {data ? (
          <div className="detail-categories-body container">
            <div className="container-title-body">
              <div className="wrapper-title">
                <h1 className="title">{data && data.text ? data.text : ''}</h1>
                <div className="title-apps">
                  <span>{total}</span>&nbsp;apps - Average price:&nbsp;<span>${avgPrice}</span>/month
                </div>
                <div className="link">
                  <Link
                    href={`https://${getLinkNameCategory()}&utm_source=letsmetrix.com&utm_medium=${
                      isCategory ? 'category' : 'collection'
                    }&utm_content=${data && data.text ? data.text : ''}`}
                    target="_blank"
                    rel="noopener nofollow noreferrer"
                    prefetch={false}
                  >
                    {getLinkNameCategory()}
                  </Link>
                </div>
              </div>
              <div className="sort">
                {renderDropdown(
                  renderOption(optionsSortBy, 'sortBy'),
                  'Sort By',
                  sort_by === 'popular' ? 'Popular' : 'Best Match',
                )}
                {renderDropdown(renderOption(optionsSortType, 'sortType'), 'Sort Type', sortType)}
                {renderDropdown(
                  renderOption(optionsLanguage, 'language'),
                  'Language',
                  optionsLanguage.find((item) => item.value === language).label,
                )}
                {renderDropdown(
                  renderOption(optionsPricingtype, 'priceType'),
                  'Price Type',
                  priceType === 'just_paid' ? 'Needs payment' : priceType,
                )}
                {renderDropdown(
                  renderOption(optionPricingRange ? optionPricingRange : []),
                  'Price Range',
                  rangeSelected,
                )}
              </div>
            </div>

            <div className="line-top"></div>

            <div className="detail-category">
              <div className="title-column">
                <Row>
                  <Col className="title-styled" span={2}>
                    #
                  </Col>
                  <Col className="title-styled" span={10}>
                    App
                  </Col>
                  <Col className="title-styled" span={6}>
                    Highlights
                  </Col>
                  <Col className="title-styled flex " span={2}>
                    Added at
                  </Col>
                  <Col className="title-styled flex justify-center" span={2}>
                    Rating
                  </Col>
                  <Col className="title-styled flex justify-center" span={2}>
                    Reviews
                  </Col>
                </Row>
              </div>
              {dataCategory && dataCategory.length > 0 ? (
                dataCategory.map((itemChild, index) => {
                  return (
                    <ItemApp
                      key={index}
                      index={index}
                      itemChild={{
                        ...itemChild,
                        _id: itemChild.app_id,
                        index: itemChild.index,
                      }}
                      loading={loading}
                      sortType={sortType}
                    />
                  );
                })
              ) : (
                <>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </>
              )}
            </div>
            {total > 0 ? (
              <div className="pagination">
                <Pagination
                  pageSize={numberPage}
                  current={currentPage}
                  onChange={(page, pageSize) => {
                    setCurrentPage(page);
                    setNumberPage(pageSize);
                    onChangePage(page, pageSize);
                  }}
                  total={total}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} apps`}
                />
              </div>
            ) : (
              ''
            )}
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
        )}
      </div>
    </Spin>
  );
}
