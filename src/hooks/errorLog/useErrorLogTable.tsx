import { SearchOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button, Input, Modal, Space } from 'antd';
import { FilterConfirmProps, FilterDropdownProps } from 'antd/lib/table/interface';
import { saveAs } from 'file-saver';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getErrorLogExport, getErrorLogList, getErrorLogSettingList } from '../../lib/api/axios/requests';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { openNotification } from '../../lib/util/notification';
import {
  errorLogSiteInfo,
  setErrorLogReqDownloadReducer,
  setErrorLogShowReducer,
} from '../../reducers/slices/errorLog';
import {
  ErrorLogSettingState,
  ErrorLogState,
  SearchedColumnState,
  SearchInputRef,
  SearchTextState,
} from '../../types/errorLog';

export default function useErrorLogTable() {
  const [searchText, setSearchText] = useState<SearchTextState>(initialSearchText);
  const [searchedColumn, setSearchedColumn] = useState<SearchedColumnState>(initialSearchedColumn);
  const searchInputRef = useRef<SearchInputRef>(initialSearchedInputRef);
  const dispatch = useDispatch();
  const siteInfo = useSelector(errorLogSiteInfo);

  const { data: list, isFetching: isFetchingList, refetch: refetchList } = useQuery<ErrorLogState[]>(
    [QUERY_KEY.ERROR_LOG_LIST, siteInfo.siteId] as const,
    // ({ queryKey }) => {
    //   const [_key, { siteId }] = queryKey as [string, { siteId: number }];

    //   return getErrorLogList(siteId);
    // },
    () => getErrorLogList(siteInfo.siteId as number),
    {
      enabled: Boolean(siteInfo.siteId),
      onError: () => {
        openNotification('error', 'Error', `Failed to get list of error log!`);
      },
    }
  );

  const { data: settingList, isFetching: isFetchingSettingList, refetch: refetchSettingList } = useQuery<
    ErrorLogSettingState[]
  >(
    [QUERY_KEY.ERROR_LOG_SETTING_LIST, siteInfo.siteId as number],
    () => getErrorLogSettingList(siteInfo.siteId as number),
    {
      enabled: Boolean(siteInfo.siteId),
      onError: () => {
        openNotification('error', 'Error', `Failed to get list of  error log setting list!`);
      },
    }
  );

  const isFetching = useMemo(() => isFetchingList || isFetchingSettingList, [isFetchingList, isFetchingSettingList]);

  const handleSearch = (
    selectedKeys: React.Key[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof ErrorLogState
  ) => {
    confirm();
    setSearchText((prev) => ({
      ...prev,
      [dataIndex]: selectedKeys[0],
    }));

    setSearchedColumn((prev) => ({
      ...prev,
      [dataIndex]: true,
    }));
  };

  const handleReset = (clearFilters: (() => void) | undefined, dataIndex: keyof ErrorLogState) => {
    if (clearFilters) {
      clearFilters();
    }
    setSearchText((prev) => ({
      ...prev,
      [dataIndex]: '',
    }));
  };

  const handleFilter = (selectedKey: React.Key, dataIndex: keyof ErrorLogState) => {
    setSearchText((prev) => ({
      ...prev,
      [dataIndex]: selectedKey,
    }));

    setSearchedColumn((prev) => ({
      ...prev,
      [dataIndex]: true,
    }));
  };

  const errorCodeProps = useMemo(
    () =>
      getColumnSearchProps({
        dataIndex: 'error_code',
        searchText: searchText['error_code'],
        searchedColumn: searchedColumn['error_code'],
        searchInputRef: searchInputRef.current['error_code'],
        handleSearch,
        handleReset,
        handleFilter,
      }),
    [searchText['error_code'], searchedColumn['error_code'], searchInputRef.current['error_code']]
  );

  const equipmentNameProps = useMemo(
    () =>
      getColumnSearchProps({
        dataIndex: 'equipment_name',
        searchText: searchText['equipment_name'],
        searchedColumn: searchedColumn['equipment_name'],
        searchInputRef: searchInputRef.current['equipment_name'],
        handleSearch,
        handleReset,
        handleFilter,
      }),
    [searchText['chuck'], searchedColumn['chuck'], searchInputRef.current['chuck']]
  );

  const errorMessageProps = useMemo(
    () =>
      getColumnSearchProps({
        dataIndex: 'error_message',
        searchText: searchText['error_message'],
        searchedColumn: searchedColumn['error_message'],
        searchInputRef: searchInputRef.current['error_message'],
        handleSearch,
        handleReset,
        handleFilter,
      }),
    [searchText['error_message'], searchedColumn['error_message'], searchInputRef.current['error_message']]
  );

  const occurrenceCountProps = useMemo(
    () =>
      getColumnSearchProps({
        dataIndex: 'occurrence_count',
        searchText: searchText['occurrence_count'],
        searchedColumn: searchedColumn['occurrence_count'],
        searchInputRef: searchInputRef.current['occurrence_count'],
        handleSearch,
        handleReset,
        handleFilter,
      }),
    [searchText['occurrence_count'], searchedColumn['occurrence_count'], searchInputRef.current['occurrence_count']]
  );

  const occurredDateProps = useMemo(
    () =>
      getColumnSearchProps({
        dataIndex: 'occurred_date',
        searchText: searchText['occurred_date'],
        searchedColumn: searchedColumn['occurred_date'],
        searchInputRef: searchInputRef.current['occurred_date'],
        handleSearch,
        handleReset,
        handleFilter,
      }),
    [searchText['occurred_date'], searchedColumn['occurred_date'], searchInputRef.current['occurred_date']]
  );

  const ppidProps = useMemo(
    () =>
      getColumnSearchProps({
        dataIndex: 'ppid',
        searchText: searchText['ppid'],
        searchedColumn: searchedColumn['ppid'],
        searchInputRef: searchInputRef.current['ppid'],
        handleSearch,
        handleReset,
        handleFilter,
      }),
    [searchText['ppid'], searchedColumn['ppid'], searchInputRef.current['ppid']]
  );

  const deviceProps = useMemo(
    () =>
      getColumnSearchProps({
        dataIndex: 'device',
        searchText: searchText['device'],
        searchedColumn: searchedColumn['device'],
        searchInputRef: searchInputRef.current['device'],
        handleSearch,
        handleReset,
        handleFilter,
      }),
    [searchText['device'], searchedColumn['device'], searchInputRef.current['device']]
  );

  const processProps = useMemo(
    () =>
      getColumnSearchProps({
        dataIndex: 'process',
        searchText: searchText['process'],
        searchedColumn: searchedColumn['process'],
        searchInputRef: searchInputRef.current['process'],
        handleSearch,
        handleReset,
        handleFilter,
      }),
    [searchText['process'], searchedColumn['process'], searchInputRef.current['process']]
  );

  const glassIdProps = useMemo(
    () =>
      getColumnSearchProps({
        dataIndex: 'glass_id',
        searchText: searchText['glass_id'],
        searchedColumn: searchedColumn['glass_id'],
        searchInputRef: searchInputRef.current['glass_id'],
        handleSearch,
        handleReset,
        handleFilter,
      }),
    [searchText['glass_id'], searchedColumn['glass_id'], searchInputRef.current['glass_id']]
  );

  const lotIdProps = useMemo(
    () =>
      getColumnSearchProps({
        dataIndex: 'lot_id',
        searchText: searchText['lot_id'],
        searchedColumn: searchedColumn['lot_id'],
        searchInputRef: searchInputRef.current['lot_id'],
        handleSearch,
        handleReset,
        handleFilter,
      }),
    [searchText['lot_id'], searchedColumn['lot_id'], searchInputRef.current['lot_id']]
  );

  const chuckProps = useMemo(
    () =>
      getColumnSearchProps({
        dataIndex: 'chuck',
        searchText: searchText['chuck'],
        searchedColumn: searchedColumn['chuck'],
        searchInputRef: searchInputRef.current['chuck'],
        handleSearch,
        handleReset,
        handleFilter,
      }),
    [searchText['chuck'], searchedColumn['chuck'], searchInputRef.current['chuck']]
  );

  const searchDownloadItem = useCallback(
    (record: ErrorLogState): ErrorLogSettingState | undefined => {
      const findItem = settingList?.find((item) => {
        if (item.error_code_range && record.error_code) {
          const condition = item.error_code_range.split('-');
          if (condition.length > 1) {
            return record.error_code >= condition[0] && record.error_code <= condition[1];
          } else {
            return record.error_code === condition[0];
          }
        }
        return false;
      });

      return findItem;
    },
    [settingList]
  );

  const onClickReqDownload = useCallback(
    (record: ErrorLogState, searched: ErrorLogSettingState | undefined) => {
      if (searched) {
        dispatch(
          setErrorLogShowReducer({
            isDownloadModal: true,
          })
        );
        dispatch(
          setErrorLogReqDownloadReducer({
            error_code: record.error_code,
            occurred_date: record.occurred_date,
            equipment_name: record.equipment_name,
            type: searched.type,
            command: searched.command,
            before: searched.before,
            after: searched.after,
            device: record.device,
            process: record.process,
          })
        );
      }
    },
    [dispatch]
  );
  const onClickDownloadList = useCallback(() => {
    dispatch(
      setErrorLogShowReducer({
        isDownloadDrawer: true,
      })
    );
  }, [dispatch]);

  const onClickImport = useCallback(() => {
    dispatch(
      setErrorLogShowReducer({
        isImportModal: true,
      })
    );
  }, [dispatch]);

  const onClickExport = useCallback(() => {
    const confirm = Modal.confirm({
      className: 'export-errorlog-setting',
      title: 'Export Error Log Setting File',
      content: 'Are you sure to export error log setting file?',
      onOk: async () => {
        diableCancelBtn();
        try {
          if (!siteInfo.siteId) {
            throw Error('no siteId');
          }
          const { data, fileName } = await getErrorLogExport(siteInfo.siteId as number);
          saveAs(data, fileName);
          openNotification('success', 'Success', `Succeed to export error log setting file '${fileName}'.`);
        } catch (e) {
          console.error(e);
          openNotification('error', 'Error', 'Failed to export error log setting file!');
        }
      },
    });

    const diableCancelBtn = () => {
      confirm.update({
        cancelButtonProps: {
          disabled: true,
        },
      });
    };
  }, [siteInfo.siteId]);

  const onClickRefresh = useCallback(() => {
    refetchList();
    refetchSettingList();
  }, [refetchList, refetchSettingList]);

  return {
    errorCodeProps,
    equipmentNameProps,
    errorMessageProps,
    occurrenceCountProps,
    occurredDateProps,
    ppidProps,
    deviceProps,
    processProps,
    glassIdProps,
    lotIdProps,
    chuckProps,
    list,
    settingList,
    isFetching,
    siteInfo,
    searchDownloadItem,
    onClickReqDownload,
    onClickDownloadList,
    onClickImport,
    onClickExport,
    onClickRefresh,
  };
}

const initialSearchText: SearchTextState = {
  error_code: '',
  equipment_name: '',
  error_message: '',
  occurrence_count: '',
  occurred_date: '',
  ppid: '',
  device: '',
  process: '',
  glass_id: '',
  lot_id: '',
  chuck: '',
};

const initialSearchedColumn: SearchedColumnState = {
  error_code: false,
  equipment_name: false,
  error_message: false,
  occurrence_count: false,
  occurred_date: false,
  ppid: false,
  device: false,
  process: false,
  glass_id: false,
  lot_id: false,
  chuck: false,
};

const initialSearchedInputRef: SearchInputRef = {
  error_code: null,
  equipment_name: null,
  error_message: null,
  occurrence_count: null,
  occurred_date: null,
  ppid: null,
  device: null,
  process: null,
  glass_id: null,
  lot_id: null,
  chuck: null,
};

const getColumnSearchProps = ({
  dataIndex,
  searchText,
  searchedColumn,
  searchInputRef,
  handleSearch,
  handleReset,
  handleFilter,
}: {
  dataIndex: keyof ErrorLogState;
  searchText: React.Key;
  searchedColumn: boolean;
  searchInputRef: React.MutableRefObject<Input | null>['current'];
  handleSearch: (
    selectedKeys: React.Key[],
    confirm: (param?: FilterConfirmProps | undefined) => void,
    dataIndex: keyof ErrorLogState
  ) => void;
  handleReset: (clearFilters: (() => void) | undefined, dataIndex: keyof ErrorLogState) => void;
  handleFilter: (selectedKey: React.Key, dataIndex: keyof ErrorLogState) => void;
}) => ({
  filterDropdown: function filterDropdownFunc({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps) {
    return (
      <div
        // style={{ padding: 8 }}
        css={css`
          padding: 0.5rem;
        `}
      >
        <Input
          ref={(node) => {
            searchInputRef = node;
          }}
          placeholder={`Search ${convertColumnName(dataIndex)}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space
          css={css`
            display: flex;
            justify-content: space-between;
          `}
        >
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters, dataIndex)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              handleFilter(selectedKeys[0], dataIndex);
            }}
          >
            Filter
          </Button> */}
        </Space>
      </div>
    );
  },
  filterIcon: function FilterIconFunc(filtered: boolean): React.ReactNode {
    return <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />;
  },
  onFilter: function onFilterFunc(value: string | number | boolean, record: ErrorLogState) {
    return record[dataIndex]
      ? record[dataIndex]?.toString().toLowerCase().includes(value.toString().toLowerCase()) ?? false
      : false;
  },
  onFilterDropdownVisibleChange: function onFilterDropdownVisibleChange(visible: boolean) {
    if (visible) {
      setTimeout(() => searchInputRef?.select(), 100);
    }
  },
  render: function RenderFunc(text: string) {
    return searchedColumn ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[`${searchText}`]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    );
  },
});

const convertColumnName = (name: keyof ErrorLogState) =>
  ({
    error_code: 'Error Code',
    error_message: 'Error Message',
    occurrence_count: 'Count',
    occurred_date: 'Date',
    ppid: 'PPID',
    device: 'Device',
    process: 'Process',
    glass_id: 'Glass Id',
    lot_id: 'Lot Id',
    chuck: 'Chunk',
  }[name as string] ?? '');
