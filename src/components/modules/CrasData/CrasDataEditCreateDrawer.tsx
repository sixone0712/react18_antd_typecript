import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Badge, Button, Col, Divider, Drawer, Form, Row, Switch } from 'antd';
import React, { useMemo } from 'react';
import useCrasDataEditCreate, { TestQueryStatusInfo } from '../../../hooks/useCrasDataEditCreate';
import { convertRemToPixels } from '../../../lib/util/remToPixcels';
import FormInput from '../../atoms/CustomForm/FormInput';
import FormName from '../../atoms/CustomForm/FormName';
import FormNumber from '../../atoms/CustomForm/FormNumber';
import FormSelectMultiple from '../../atoms/CustomForm/FormSelectMultiple';
import CustomIcon from '../../atoms/CustomIcon';

export type CrasDataEditCreateDrawerProps = {};

export default function CrasDataEditCreateDrawer({}: CrasDataEditCreateDrawerProps): JSX.Element {
  const {
    form,
    drawerType,
    isDrawer,
    closeDrawer,
    onFinish,
    createOptions,
    onSelectTargetTable,
    onChangeTargetColumn,
    isDisableItems,
    isFetchingItems,
    isTestQuerying,
    isAdding,
    isEditing,
    isFetchingTargetTable,
    isFetchingTargetColumn,
    selectTable,
    testQuery,
    testQueryStatus,
  } = useCrasDataEditCreate();

  const DrawerTitle = useMemo(() => {
    const titleStyle = css`
      display: flex;
      align-items: center;
      .icon {
        margin-right: 0.5rem;
      }
    `;

    if (drawerType === 'add') {
      return (
        <div css={titleStyle}>
          <CustomIcon name="circle_plus" className="icon" />
          <span>Add Create Cras Data Item</span>
        </div>
      );
    } else {
      return (
        <div css={titleStyle}>
          <CustomIcon name="circle_edit" className="icon" />
          <span>Edit Create Cras Data Item</span>
        </div>
      );
    }
  }, [drawerType]);

  return (
    <Drawer
      title={DrawerTitle}
      placement="right"
      width={convertRemToPixels(45)}
      closable={true}
      onClose={closeDrawer}
      visible={isDrawer}
      destroyOnClose={true}
      // getContainer={false}
      forceRender
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <FormInnerContainer>
          <FormInnerSection>
            <Form.Item label="Eanble" name="enable" valuePropName="checked" required css={formEnableStyle}>
              <Switch
                disabled={isDisableItems}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>
          </FormInnerSection>
          <Divider type="vertical" css={formUpperDividerVStyle} />
          <FormInnerSection
            css={css`
              display: flex;
              align-items: flex-end;
              flex-direction: column;
            `}
          >
            <Button
              type="primary"
              css={testQueryBtnStyle}
              loading={isTestQuerying}
              disabled={isDisableItems}
              onClick={testQuery}
            >
              Test Query
            </Button>
            <TestQueryStatus statusInfo={testQueryStatus} />
          </FormInnerSection>
        </FormInnerContainer>
        <Divider type="horizontal" css={formDividerHStyle} />
        <FormInnerContainer>
          <FormInnerSection>
            <FormInput
              label="Item Name"
              name="itemName"
              placeholder="Enter the item name."
              required
              disabled={isDisableItems}
            />
            <FormSelectMultiple
              label="Target Table"
              name="targetTable"
              placeholder="Select the target table."
              options={createOptions?.targetTable}
              disabled={isDisableItems}
              loading={isFetchingTargetTable || isFetchingItems}
              onSelect={onSelectTargetTable}
            />
            <FormSelectMultiple
              label="Target Column"
              name="targetCol"
              placeholder={selectTable ? 'Select the target column.' : 'Select the target table first.'}
              options={createOptions?.columnTable}
              disabled={!selectTable || isDisableItems}
              loading={isFetchingTargetColumn || isFetchingItems}
              mode="multiple"
              onChange={onChangeTargetColumn}
            />
            <FormInput
              label="Comments"
              name="comments"
              placeholder="Enter the comments."
              loading={isFetchingItems}
              disabled={isDisableItems}
            />
          </FormInnerSection>

          <Divider type="vertical" css={formDividerVStyle} />

          <FormInnerSection>
            <FormSelectMultiple
              label="Operations"
              name="operations"
              placeholder="Select the operations."
              options={createOptions?.operations}
              disabled={isDisableItems}
              loading={isFetchingItems}
            />
            <FormSelectMultiple
              label="Calculate Period Unit"
              name="calPeriodUnit"
              placeholder="Select the calculate period unit."
              options={createOptions?.calPeriodUnit}
              disabled={isDisableItems}
              loading={isFetchingItems}
            />
            <FormSelectMultiple
              label="Calculate Result Type"
              name="calResultType"
              placeholder="Select the calculate reulst type."
              options={createOptions?.calResultType}
              disabled={isDisableItems}
              loading={isFetchingItems}
            />
            <FormNumber
              label="Coefficient"
              name="coef"
              placeholder="Enter the number of coefficient"
              required
              disabled={isDisableItems}
            />
            <FormInput
              label="Manual Input Search Condition"
              name="manualWhere"
              placeholder="Select the manual input search condition."
              disabled={isDisableItems}
              loading={isFetchingItems}
              required={false}
            />
          </FormInnerSection>
        </FormInnerContainer>

        <Divider type="horizontal" css={formDividerHStyle} />

        <Form.Item css={formSubmitStyle}>
          <Button
            type="primary"
            htmlType="submit"
            css={applyBtnStyle}
            loading={isAdding || isEditing}
            disabled={isDisableItems}
          >
            Apply
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

const FormInnerContainer = styled(Row)`
  flex-direction: row;
  flex-wrap: nowrap;
`;

const FormInnerSection = styled(Col)`
  width: 20rem;
`;

const formSubmitStyle = css`
  .ant-form-item-control-input-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const testQueryBtnStyle = css`
  width: 9.375rem;
`;

const applyBtnStyle = css`
  width: 20rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  margin-top: 1rem;
`;

const formDividerHStyle = css``;

const formDividerVStyle = css`
  height: auto;
  margin-left: 1rem;
  margin-right: 1rem;
`;

const formUpperDividerVStyle = css`
  height: auto;
  margin-left: 1rem;
  margin-right: 1rem;
  border-color: white;
`;

const formEnableStyle = css`
  flex-direction: row !important;
  align-items: center;
  margin-bottom: 0;
  .ant-form-item-label {
    padding: 0;
  }
  .ant-form-item-control {
    margin-left: 1rem;
  }
`;

const FormHidden = styled(Form.Item)`
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
`;

function TestQueryStatus({ statusInfo }: { statusInfo: TestQueryStatusInfo }) {
  const statusText = useMemo(() => {
    switch (statusInfo.status) {
      case 'default':
        return 'Not tested yet';
      case 'success':
        return 'Success';
      case 'processing':
        return 'Processing';
      case 'error':
        return 'Error';
    }
  }, [statusInfo.status]);

  return (
    <div
      css={css`
        width: 20rem;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .error-msg {
          width: 20rem;
          text-align: right;
        }
      `}
    >
      <Badge status={statusInfo.status} text={statusText} />
      {statusInfo.error && <div className="error-msg">{statusInfo.error}</div>}
    </div>
  );
}
