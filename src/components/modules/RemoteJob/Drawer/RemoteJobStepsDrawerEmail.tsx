import { css } from '@emotion/react';
import { Button, Form, FormInstance, Input, Switch } from 'antd';
import React from 'react';
import Highlighter from 'react-highlight-words';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { FormRemoteJobStepsDrawer } from '../../../../hooks/remoteJob/useRemoteJobStepsDrawer';
import useRemoteJobStepsDrawerEmail from '../../../../hooks/remoteJob/useRemoteJobStepsDrawerEmail';
import { EMAIL_SUBJECT_MAX } from '../../../../lib/constants';
import { H_SPACE } from '../../../atoms/Space';
import { StepCommonLabel } from './RemoteJobStepsDrawerCommon';
import { BookOutlined } from '@ant-design/icons';
import RemoteJobStepsModalAddrBook from '../Modal/RemoteJobStepsModalAddrBook';
export default function RemoteJobStepsDrawerEmail({ form }: { form: FormInstance<FormRemoteJobStepsDrawer> }) {
  const {
    recipient,
    selectRef,
    deboundcedSearch,
    onChangeSelectEmail,
    onCreateCustomEmail,
    onSelectEscKeyPress,
    isEnableEmail,
    setEnableEmail,
    itemVisible,
    openAddrBookModal,
  } = useRemoteJobStepsDrawerEmail({ form });

  return (
    <div css={style}>
      <Form.Item label={<StepCommonLabel label="Email" />} className="isEmail" name="isEmail">
        <Switch checkedChildren="On" unCheckedChildren="Off" onChange={setEnableEmail} checked={isEnableEmail} />
      </Form.Item>
      {isEnableEmail && (
        <>
          <Form.Item
            label={<StepCommonLabel label="Recipients" depth={1} />}
            name="recipient"
            rules={[{ required: true, message: 'Please input recipients!' }]}
            colon={false}
          >
            <div
              css={css`
                display: flex;
                flex-direction: row;
                align-items: center;
              `}
            >
              <AsyncCreatableSelect
                classNamePrefix="address"
                placeholder="Input recipients"
                styles={colourStyles}
                isMulti
                formatOptionLabel={formatOptionLabel}
                value={recipient as any}
                cacheOptions
                formatCreateLabel={(userInput) => `Add custom email address '${userInput}'`}
                isSearchable
                loadOptions={deboundcedSearch}
                onChange={onChangeSelectEmail}
                onCreateOption={onCreateCustomEmail}
                defaultValue={[]}
                ref={selectRef}
                onKeyDown={onSelectEscKeyPress}
                css={css`
                  border-radius: 2px;
                  z-index: 100;
                  &:hover {
                    border-color: #40a9ff;
                  }
                `}
              />
              <H_SPACE />
              <Button type="primary" shape="circle" icon={<BookOutlined />} onClick={openAddrBookModal} />
            </div>
          </Form.Item>
          {itemVisible.isSubject && (
            <Form.Item
              label={<StepCommonLabel label="Subject" depth={1} />}
              name="subject"
              rules={[{ required: true, message: 'Please input a subject!' }]}
              colon={false}
            >
              <Input placeholder="Input a subject." allowClear maxLength={EMAIL_SUBJECT_MAX} />
            </Form.Item>
          )}
          {itemVisible.isBody && (
            <Form.Item
              label={<StepCommonLabel label="Body" depth={1} />}
              name="body"
              rules={[{ required: true, message: 'Please input a body!' }]}
              colon={false}
            >
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} placeholder="Input a body." allowClear />
            </Form.Item>
          )}
          <RemoteJobStepsModalAddrBook form={form} />
        </>
      )}
    </div>
  );
}

function formatOptionLabel(
  { label, name, __isNew__ }: { label: string; name: string; email: string; group: boolean; __isNew__: boolean },
  { inputValue }: { inputValue: string }
) {
  if (__isNew__) {
    return <div>{label}</div>;
  } else {
    // const newLable = group ? `@${name}` : `${name} <${email}>`;
    return (
      <Highlighter
        searchWords={[inputValue]}
        textToHighlight={label}
        autoEscape={true}
        highlightStyle={{ padding: 0, fontWeight: 700, backgroundColor: 'transparent' }}
      />
    );
  }
}

const colourStyles: any = {
  control: (styles: any) => {
    return {
      ...styles,
      // width: '49.25rem',
      width: '46rem',
      borderRadius: 0,
    };
  },
  multiValue: (styles: any, { data }: { data: any }) => {
    let color = '#d9d9d9';
    if (data.group) {
      color = '#ffe7ba';
    } else {
      if (data.id) {
        color = '#d6e4ff';
      }
    }

    return {
      ...styles,
      backgroundColor: color,
      fontSize: '1rem',
    };
  },
};

const style = css`
  .isEmail {
    label::after {
      color: transparent;
    }
  }
`;
