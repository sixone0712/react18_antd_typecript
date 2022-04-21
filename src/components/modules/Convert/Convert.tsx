import { blue } from '@ant-design/colors';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Button, Input, Popconfirm, Select, Space, Spin, Tooltip } from 'antd';
import React from 'react';
import useConvert from '../../../hooks/useConvert';
import { ConvertRuleItem } from '../../../types/convertRules';
import CustomIcon from '../../atoms/CustomIcon';
import ConvertAddLogModal from './Modal/ConvertAddLogModal';
import ConvertEditLogModal from './Modal/ConvertEditLogModal';
import ConvertErrorLogModal from './Modal/ConvertErrorLogModal';
import ConvertImportModal from './Modal/ConvertImportModal';
export type ConvertProps = {};

export default function Convert({}: ConvertProps): JSX.Element {
  const {
    itemlist,
    isFetching,
    refreshItemList,
    getComapnyFabName,
    showAddModal,
    showImportModal,
    onClickEdit,
    onClickDelete,
    openExportModal,
    search,
    onChange,
    onPressEnter,
    filteredItemList,
    filterRuleType,
    onSelectFilterRuleType,
    onClickErrorMsg,
  } = useConvert();

  return (
    <div>
      <div css={titleContainerStyle}>
        <div className="list-count">
          <Space size={2}>
            <Badge color="blue" />
            <div>{`Registered Convert Rules : ${itemlist?.length ?? 0}`}</div>
          </Space>
        </div>

        <div>
          <Space>
            <Input.Search
              className="log-search"
              placeholder="input search log name"
              value={search}
              onChange={onChange}
              onPressEnter={onPressEnter}
              onSearch={onPressEnter}
              enterButton
              allowClear
            />
            <Select
              className="filter-rule-type"
              style={{ width: '10.5rem' }}
              onSelect={onSelectFilterRuleType}
              value={filterRuleType}
              options={filtertRuleTypeOption}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} disabled={isFetching}>
              Add
            </Button>
            <Button type="primary" icon={<ImportOutlined />} disabled={isFetching} onClick={showImportModal}>
              Import
            </Button>
            <Button
              type="primary"
              icon={<ExportOutlined />}
              // disabled={isFetching || (itemlist && itemlist.length <= 0)}
              disabled={isFetching}
              onClick={openExportModal}
            >
              Export
            </Button>
            <Button type="primary" icon={<ReloadOutlined />} disabled={isFetching} onClick={refreshItemList} />
          </Space>
        </div>
      </div>
      <div css={boxContainerStyle}>
        {isFetching && (
          <div className="loading">
            <Spin size="large" />
          </div>
        )}
        {!isFetching && itemlist && (
          <div className="box-section">
            {filteredItemList?.map((item) => (
              <LogNameBox
                key={item.id}
                logItem={item}
                getSelectName={getComapnyFabName}
                onClickEdit={onClickEdit}
                onClickDelete={onClickDelete}
                onClickErrorMsg={onClickErrorMsg}
              />
            ))}
          </div>
        )}
      </div>
      <ConvertAddLogModal />
      <ConvertEditLogModal />
      <ConvertImportModal />
      <ConvertErrorLogModal />
    </div>
  );
}

const filtertRuleTypeOption = [
  {
    key: 'all',
    value: 'all',
    label: 'All',
  },
  {
    key: 'csv',
    value: 'csv',
    label: 'CSV',
  },
  {
    key: 'regex',
    value: 'regex',
    label: 'Regular Expression',
  },
];

const titleContainerStyle = css`
  width: 86rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 1rem;
  margin-right: 1rem;
  justify-content: space-between;
  .list-count {
    font-size: 0.875rem;
  }
  .ant-btn {
    border-radius: 0.625rem;
  }
  .log-search {
    .ant-input-affix-wrapper {
      border-radius: 0.625rem 0 0 0.625rem !important;
    }
    .ant-input-search-button {
      border-radius: 0 0.625rem 0.625rem 0 !important;
    }
  }
  .filter-rule-type {
    .ant-select-selector {
      border-radius: 0.625rem !important;
    }
  }
`;

const boxContainerStyle = css`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  .box-section {
    width: 78.2rem;
    display: flex;
    flex-direction: row;
    flex-flow: wrap;
    /* justify-content: center; */
    justify-content: flex-start;
  }
  .loading {
    display: flex;
    justify-content: center;
    margin-top: 4rem;
  }
`;

interface LogNameBoxProps {
  logItem: ConvertRuleItem;
  getSelectName: (siteId: number) => string;
  onClickEdit: (type: 'log' | 'rule', id: number, name: string) => void;
  onClickDelete: (id: number, name: string) => void;
  onClickErrorMsg: (id: number) => void;
}

const LogNameBox = React.memo(function LogNameBoxComp({
  logItem,
  getSelectName,
  onClickEdit,
  onClickDelete,
  onClickErrorMsg,
}: LogNameBoxProps) {
  const { id, log_name, rules, select, rule_type, errors } = logItem;

  return (
    <div css={logNameBoxStyle(Boolean(errors > 0))}>
      <div className="title">LogName</div>
      <div className="log">
        <Space>
          <div className="log-name">
            {log_name.length > 24 ? (
              <Tooltip placement="top" title={log_name} overlayInnerStyle={{ width: log_name.length * 9.4 }}>
                {log_name}
              </Tooltip>
            ) : (
              <div> {log_name} </div>
            )}
          </div>
          {errors > 0 && <CustomIcon className="warning-icon" name="warning" onClick={() => onClickErrorMsg(id)} />}
        </Space>
      </div>
      <div className="type">{`Rule Type : ${rule_type === 'csv' ? 'CSV' : 'Regular Expression'}`}</div>
      <div className="count">{`Registered Rules : ${rules}`}</div>
      <div className="select">
        <Tooltip
          title={
            select && select.length > 0 ? (
              select.map((item) => <div key={item}>{getSelectName(item)}</div>)
            ) : (
              <div>All User-Fab</div>
            )
          }
          color="cyan"
          placement="right"
        >
          {`Selected User-Fab : ${select?.length === 0 ? 'All' : select?.length}`}
        </Tooltip>
      </div>
      <div className="icons">
        {/* TODO: 추후 삭제.... */}
        {log_name !== 'StatusMonitor' && (
          <Space>
            <Popconfirm
              title="Select Edit"
              cancelText="Edit Log"
              okText="Edit Rule"
              cancelButtonProps={{ type: 'primary' }}
              onCancel={() => onClickEdit('log', id, log_name)}
              onConfirm={() => onClickEdit('rule', id, log_name)}
            >
              <EditOutlined className="icon" />
            </Popconfirm>
            <Popconfirm title="Delete Log" onConfirm={() => onClickDelete(id, log_name)}>
              <DeleteOutlined className="icon" />
            </Popconfirm>
          </Space>
        )}
      </div>
    </div>
  );
});

const logNameBoxStyle = (error: boolean) => css`
  border-radius: 1rem;
  width: 25rem;
  padding: 1rem;
  margin: 0.5rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-color: gray;
  background-color: ${error ? '#fff0f0' : '#f0f5ff'};
  cursor: default;
  .title {
    color: gray;
  }
  .log {
    font-size: 1.3rem;
    .log-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 21rem;
      display: block;
    }
    .warning-icon {
      color: #ff4d4f;
      :hover {
        color: #cf1322;
      }
    }
  }
  .icons {
    display: flex;
    justify-content: flex-end;
    .icon {
      &:hover {
        color: ${blue[4]};
      }
      &:active {
        color: ${blue[6]};
      }
    }
  }
  .select {
    &:hover {
      color: ${blue[4]};
    }
  }
`;
