import { blue } from '@ant-design/colors';
import { DeleteOutlined, EditOutlined, HistoryOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Checkbox, Popconfirm, Space, Table, Tooltip } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { useCallback } from 'react';
import useRemoteJobSteps from '../../../hooks/remoteJob/useRemoteJobSteps';
import { TableColumnTitle } from '../../../lib/util/commonStyle';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { TableColumnPropsType } from '../../../types/common';
import { AVAILABLE_MANUAL_EXCUTE_STEPS, JobModeType, JobStepType, RemoteJobStepDetailState } from '../../../types/Job';
import { ellipsisLineStyle } from '../../atoms/Common/Common';
import CustomIcon from '../../atoms/CustomIcon';
import TableTitle from '../../atoms/TableTitle';
import StepMilestoneModal from '../Common/Modal/StepMilestoneModal';
import RemoteJobStepsDrawer from './Drawer/RemoteJobStepsDrawer';
import { convertStepType } from './Drawer/RemoteJobStepsDrawerCommon';
import RemoteJobStepsModalAdd from './Modal/RemoteJobStepsModalAdd';

export type RemoteJobStepsProps = {};

export default function RemoteJobSteps({}: RemoteJobStepsProps): JSX.Element {
  const {
    stepList,
    enableList,
    setEnableList,
    onChangeEnable,
    onToggleAllEnable,
    openAddStepDrawer,
    openEditStepDrawer,
    onDeleteStep,
    form,
    stepMilestone,
    isMilestone,
    setMilestone,
  } = useRemoteJobSteps();

  const AllCheckEnable = () => (
    <Checkbox
      checked={enableList && enableList.length ? true : false}
      indeterminate={stepList && enableList && enableList.length > 0 && enableList.length < stepList.length}
      onChange={onToggleAllEnable}
    />
  );

  const rowSelection: TableRowSelection<RemoteJobStepDetailState> = {
    type: 'checkbox',
    selectedRowKeys: enableList as string[],
    onChange: onChangeEnable,
    columnTitle: AllCheckEnable,
  };

  const onCell = (record: RemoteJobStepDetailState, rowIndex: number | undefined) => ({
    // onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    //   if (enableList.find((item) => item === record.uuid) !== undefined) {
    //     setEnableList(enableList.filter((item) => item !== record.uuid) as string[]);
    //   } else {
    //     setEnableList(enableList.concat(record.uuid) as string[]);
    //   }
    // },
  });

  const renderTitle = useCallback(() => {
    const btn1 = {
      icon: <HistoryOutlined />,
      // toolTip: 'Milestone',
      onClick: () => setMilestone(true),
      name: 'Milestone',
    };
    const btn2 = {
      icon: <PlusOutlined />,
      // toolTip: 'Add',
      onClick: openAddStepDrawer,
      name: 'Add',
    };

    return (
      <TableTitle
        title={
          <Space>
            <div>{`- Registered Remote Job Step List : ${stepList?.length ?? 0}`}</div>
          </Space>
        }
        btn1={btn1}
        btn2={btn2}
      />
    );
  }, [stepList, openAddStepDrawer, setMilestone]);

  const stepTypeRender = useCallback(
    (value: JobStepType, record: RemoteJobStepDetailState, index: number) => <div>{convertStepType(value)}</div>,
    []
  );

  const excuteModeRender = useCallback(
    (value: JobModeType, record: RemoteJobStepDetailState, index: number) => {
      let title: React.ReactNode = null;

      switch (value) {
        case 'time':
          title = record.time ? (
            <>
              {record.time.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </>
          ) : null;
          break;
        case 'cycle':
          title = `${record.period} ${record.cycle}` ?? null;
          break;
        case 'pre':
          title = stepList.find((item) => item.uuid === record.preStep)?.stepName ?? null;
          break;
        case 'next':
          title = stepList.find((item) => item.uuid === record.nextStep)?.stepName ?? null;
          break;
        case 'none':
          title = '';
          break;
        default:
          break;
      }

      return (
        <Tooltip placement="right" title={title}>
          <Space>
            <div>{convertExcuteMode(value)}</div>
            {title === null && AVAILABLE_MANUAL_EXCUTE_STEPS.includes(record.stepType) && (
              <Tooltip placement="right" title={'No Value'} color="red">
                <CustomIcon css={errorIconStyle} name="warning" />
                {/* it need to diplay tooltip */}
                <div></div>
              </Tooltip>
            )}
          </Space>
        </Tooltip>
      );
    },
    [stepList]
  );

  const editRender = useCallback(
    (value: string, record: RemoteJobStepDetailState, index: number) => {
      return (
        <Popconfirm
          title="Are you sure to edit this step?"
          onConfirm={() => openEditStepDrawer(record)}
          okText="Ok"
          cancelText="Cancel"
        >
          <EditOutlined css={iconStyle} />
        </Popconfirm>
      );
    },
    [openEditStepDrawer]
  );

  const deleteRender = useCallback(
    (value: string, record: RemoteJobStepDetailState, index: number) => {
      return (
        <Popconfirm
          title="Are you sure to delete this step?"
          onConfirm={() => onDeleteStep(value)}
          okText="Ok"
          cancelText="Cancel"
        >
          <DeleteOutlined css={iconStyle} />
        </Popconfirm>
      );
    },
    [onDeleteStep]
  );

  return (
    <div css={style}>
      <Table<RemoteJobStepDetailState>
        rowKey={'uuid'}
        rowSelection={rowSelection}
        dataSource={stepList ?? []}
        bordered
        title={renderTitle}
        size="middle"
        pagination={{
          position: ['bottomCenter'],
        }}
        // onRow={onRow}
        tableLayout="fixed"
      >
        {/* <Table.Column<RemoteJobStepDetailState> {...setpColumnProps.stepName} width={250} onCell={onCell} />
        <Table.Column<RemoteJobStepDetailState>
          {...setpColumnProps.stepType}
          width={150}
          onCell={onCell}
          render={stepTypeRender}
        />
        <Table.Column<RemoteJobStepDetailState> {...setpColumnProps.description} width={400} onCell={onCell} />
        <Table.Column<RemoteJobStepDetailState> {...setpColumnProps.edit} width={80} render={editRender} />
        <Table.Column<RemoteJobStepDetailState> {...setpColumnProps.delete} width={80} render={deleteRender} /> */}
        <Table.Column<RemoteJobStepDetailState> {...setpColumnProps.stepName} width={200} onCell={onCell} />
        <Table.Column<RemoteJobStepDetailState>
          {...setpColumnProps.stepType}
          width={150}
          onCell={onCell}
          render={stepTypeRender}
        />
        <Table.Column<RemoteJobStepDetailState>
          {...setpColumnProps.excuteMode}
          width={150}
          onCell={onCell}
          render={excuteModeRender}
        />
        <Table.Column<RemoteJobStepDetailState> {...setpColumnProps.description} width={300} onCell={onCell} />
        <Table.Column<RemoteJobStepDetailState> {...setpColumnProps.edit} width={80} render={editRender} />
        <Table.Column<RemoteJobStepDetailState> {...setpColumnProps.delete} width={80} render={deleteRender} />
      </Table>
      <RemoteJobStepsModalAdd form={form} />
      <RemoteJobStepsDrawer form={form} />
      <StepMilestoneModal steps={stepMilestone} visible={isMilestone} setVisible={setMilestone} />
    </div>
  );
}

const style = css`
  .ant-table {
    .ant-table-tbody {
      .ant-table-cell.stepName,
      .ant-table-cell.stepType,
      .ant-table-cell.mode,
      .ant-table-cell.description {
        cursor: default;
      }
    }
  }
`;

const iconStyle = css`
  cursor: pointer;
  &:hover {
    color: ${blue[4]};
  }
  &:active {
    color: ${blue[6]};
  }
`;

const errorIconStyle = css`
  color: #ff4d4f;
  &:hover {
    color: #cf1322;
  }
`;

type StepColumnName = 'stepName' | 'stepType' | 'excuteMode' | 'description' | 'edit' | 'delete';

const setpColumnProps: TableColumnPropsType<RemoteJobStepDetailState, StepColumnName> = {
  stepName: {
    key: 'stepName',
    title: <TableColumnTitle>Step Name</TableColumnTitle>,
    dataIndex: 'stepName',
    className: 'stepName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'stepName'),
    },
  },
  stepType: {
    key: 'stepType',
    title: <TableColumnTitle>Step Type</TableColumnTitle>,
    dataIndex: 'stepType',
    className: 'stepType',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'stepType'),
    },
  },
  excuteMode: {
    key: 'mode',
    title: <TableColumnTitle>Excute Mode</TableColumnTitle>,
    dataIndex: 'mode',
    className: 'mode',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'mode'),
    },
  },
  description: {
    key: 'description',
    title: <TableColumnTitle>Description</TableColumnTitle>,
    dataIndex: 'description',
    className: 'description',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'description'),
    },
    render: function renderDescription(value: string, record: RemoteJobStepDetailState, index: number) {
      return (
        <div title={value} css={ellipsisLineStyle({ line: 2 })}>
          {value}
        </div>
      );
    },
  },
  edit: {
    key: 'edit',
    title: <TableColumnTitle>Edit</TableColumnTitle>,
    dataIndex: 'uuid',
    className: 'edit',
    align: 'center',
  },
  delete: {
    key: 'delete',
    title: <TableColumnTitle>Delete</TableColumnTitle>,
    dataIndex: 'uuid',
    className: 'delete',
    align: 'center',
  },
};

export const convertExcuteMode = (value: JobModeType): string =>
  ({
    time: 'Time',
    cycle: 'Cycle',
    pre: 'Previous',
    next: 'Next',
    none: 'None',
  }[value] ?? '-');
