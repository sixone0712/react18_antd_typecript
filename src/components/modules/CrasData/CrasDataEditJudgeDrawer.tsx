import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Col, Divider, Drawer, Form, Row, Switch } from 'antd';
import React, { useMemo } from 'react';
import useCrasDataEditJudge from '../../../hooks/useCrasDataEditJudge';
import { convertRemToPixels } from '../../../lib/util/remToPixcels';
import FormInput from '../../atoms/CustomForm/FormInput';
import FormName from '../../atoms/CustomForm/FormName';
import FormNumber from '../../atoms/CustomForm/FormNumber';
import FormSelectMultiple from '../../atoms/CustomForm/FormSelectMultiple';
import CustomIcon from '../../atoms/CustomIcon';

export type CrasDataEditJudgeDrawerProps = {};

export default function CrasDataEditJudgeDrawer({}: CrasDataEditJudgeDrawerProps): JSX.Element {
  const {
    form,
    drawerType,
    isDrawer,
    closeDrawer,
    onFinish,
    judgeOptions,
    isDisableItems,
    isFetchingItems,
    isAdding,
    isEditing,
  } = useCrasDataEditJudge();

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
          <span>Add Cras Data Judge Rules Item</span>
        </div>
      );
    } else {
      return (
        <div css={titleStyle}>
          <CustomIcon name="circle_edit" className="icon" />
          <span>Edit Cras Data Judge Rules Item</span>
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
              ></Switch>
            </Form.Item>
          </FormInnerSection>
          <Divider type="vertical" css={formUpperDividerVStyle} />
          <FormInnerSection />
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
              loading={isFetchingItems}
            />
            <FormInput
              label="Title"
              name="title"
              placeholder="Enter the title."
              disabled={isFetchingItems}
              loading={isFetchingItems}
            />
            <FormNumber
              label="Calculate Range"
              name="calRange"
              placeholder="Enter the number of calculate range."
              required
              disabled={isDisableItems}
            />
            <FormSelectMultiple
              label="Calculate Condition"
              name="calCondition"
              placeholder="Select the calculate condition."
              options={judgeOptions?.calCondition}
              disabled={isDisableItems}
              loading={isFetchingItems}
            />
          </FormInnerSection>
          <Divider type="vertical" css={formDividerVStyle} />
          <FormInnerSection>
            <FormInput
              label="Description"
              name="description"
              placeholder="Enter the description."
              disabled={isFetchingItems}
              loading={isFetchingItems}
            />
            <FormNumber
              label="Threshold"
              name="threshold"
              placeholder="Enter the number of threshold."
              disabled={isDisableItems}
            />
            <FormSelectMultiple
              label="Compare value to Threshold"
              name="compare"
              placeholder="Select the compare value to threshold."
              options={judgeOptions?.compareValueToThreshold}
              disabled={isDisableItems}
              loading={isFetchingItems}
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
