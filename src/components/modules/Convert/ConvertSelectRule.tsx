import { UploadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Divider, Form, Upload } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { FormInstance } from 'antd/lib/form/Form';
import { UploadFile } from 'antd/lib/upload/interface';
import React from 'react';
import { FormConvertSelectRule } from '../../../hooks/useConvertEdit';
import useConvertSelectRule from '../../../hooks/useConvertSelectRule';
import FormReadOnly from '../../atoms/CustomForm/FormReadOnly';
import FormSelect from '../../atoms/CustomForm/FormSelect';
import ConvertPreview from './ConvertPreview';

export type ConvertSelectRuleProps = {
  form: FormInstance<FormConvertSelectRule>;
};

export default function ConvertSelectRule({ form }: ConvertSelectRuleProps): JSX.Element {
  const {
    uploadFiles,
    setUploadFiles,
    ruleList,
    onChangeRuleName,
    onChangeNewRule,
    newRule,
    isFetchingBaseData,
    isFetchingRuleItem,
    disabledRegexAdd,
  } = useConvertSelectRule({ form });

  const draggerProps = {
    name: 'files',
    multiple: false,
    maxCount: 1,
    beforeUpload: (file: UploadFile) => {
      setUploadFiles([file]);
      return false;
    },
    onRemove: () => {
      setUploadFiles([]);
    },
    fileList: uploadFiles,
  };

  return (
    <div css={style}>
      <div className="select-rule-form">
        <Form form={form} layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <div className="title">1. Select Sample Log</div>
          <Form.Item label="Upload Log File">
            <Upload {...draggerProps}>
              <Button icon={<UploadOutlined />} disabled={isFetchingBaseData || isFetchingRuleItem}>
                Click to Upload
              </Button>
            </Upload>
          </Form.Item>
          <FormDivider />
          <div className="title">2. Select Rule</div>
          <FormReadOnly label="Log Name" name="log_name" required loading={isFetchingBaseData || isFetchingRuleItem} />
          <FormReadOnly
            label="Table Name"
            name="table_name"
            required
            loading={isFetchingBaseData || isFetchingRuleItem}
          />
          <FormSelect
            label="Rule Name"
            name="select_rule"
            placeholder={newRule ? 'Add new rule' : 'Select a rule name.'}
            options={ruleList ?? []}
            ObjkeyName={'id'}
            ObjvalueName={'id'}
            ObjLabelName={['rule_name', 'col']}
            loading={isFetchingBaseData || isFetchingRuleItem}
            onSelect={onChangeRuleName}
            required={!newRule}
            disabled={isFetchingBaseData || isFetchingRuleItem || newRule}
          />
          <Form.Item name="is_new_rule" valuePropName="checked" className="add-new-rule">
            <Checkbox
              onChange={onChangeNewRule}
              disabled={isFetchingBaseData || isFetchingRuleItem || disabledRegexAdd}
            >
              Add New Rule
            </Checkbox>
          </Form.Item>
          <FormReadOnly label="Rule Type" name="rule_type" required />
        </Form>
      </div>
      <ConvertPreview type="sample" selectRuleForm={form} />
    </div>
  );
}

const style = css`
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  width: 85.75rem;
  display: flex;
  align-items: center;
  flex-direction: column;

  .select-rule-form {
    margin-bottom: 1rem;
    background-color: #f0f5ff;
    width: 30rem;
    padding: 1rem;
    .title {
      color: #1890ff;
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .ant-form-item {
      margin-left: 1rem;
    }

    .add-new-rule {
      margin-left: 10rem;
      margin-bottom: 1rem;
    }
    .file-type {
      margin-left: 10rem;
    }
  }
`;

const FormDivider = styled(Divider)`
  border-color: #f0f5ff;
`;
