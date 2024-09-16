'use client';

import React, { useState, useEffect, useRef } from 'react';
import './CustomSelect.scss';
import Image from 'next/image';
import { Button, Spin, Tag, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const CustomSelect = ({
  options,
  selectedItems,
  onSearch,
  onSelect,
  onDeselect,
  placeholder,
  searchPlaceholder,
  searchLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectItem = (item) => {
    if (onSelect) {
      onSelect(item);
    }
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleDeselectItem = (item) => {
    if (onDeselect) {
      onDeselect(item);
    }
  };

  const handleClearAll = () => {
    selectedItems.forEach((item) => handleDeselectItem(item));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const visibleItems = selectedItems.slice(0, 4);
  const hiddenItemsCount = selectedItems.length - visibleItems.length;

  return (
    <div className="custom-select-container" ref={containerRef}>
      <div className="search-box" onClick={toggleDropdown}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder={isOpen ? searchPlaceholder : placeholder}
        />
        <div className="tags-container">
          {visibleItems.map((item) => (
            <Tag key={item.app_id} closable onClose={() => handleDeselectItem(item)} className="custom-tag">
              <Image src={item.icon} alt={item.name} width={35} height={35} />
              <Tooltip title={item.name}>
                <span className="tag-name">{item.name}</span>
              </Tooltip>
            </Tag>
          ))}
          {hiddenItemsCount > 0 && (
            <Tooltip
              title={
                <div className="tags-container-tooltip">
                  {selectedItems.slice(4).map((item) => (
                    <div key={item.app_id} className="tooltip-item-compare">
                      <Image src={item.icon} alt={item.name} width={35} height={35} />
                      <Tooltip title={item.name}>
                        <span className="tooltip-item-name">{item.name}</span>
                      </Tooltip>
                      <span className="deselect-item" onClick={() => handleDeselectItem(item)}>
                        ×
                      </span>
                    </div>
                  ))}
                </div>
              }
              placement="bottomLeft"
            >
              <div className="more-items">+{hiddenItemsCount}...</div>
            </Tooltip>
          )}
        </div>
        {visibleItems.length > 0 && (
          <div className="clear-all-button">
            <Tooltip title="Clear all">
              <CloseOutlined onClick={handleClearAll} />
            </Tooltip>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          {searchLoading ? (
            <div className="loading-container">
              <Spin size="small" />
            </div>
          ) : options.length === 0 ? (
            <div className="no-results">No results found</div>
          ) : (
            <ul>
              {options.map((item) => (
                <li key={item.value} onClick={() => handleSelectItem(item)}>
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
