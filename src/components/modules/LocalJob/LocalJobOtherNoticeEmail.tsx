import { BookOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Button } from 'antd';
import React, { useMemo } from 'react';
import Highlighter from 'react-highlight-words';
import AsyncCreatableSelect from 'react-select/async-creatable';
import useLocalJobOtherNoticeEmail from '../../../hooks/localJob/useLocalJobOtherNoticeEmail';
import { H_SPACE, V_SPACE } from '../../atoms/Space';
import LocalJobNoticeAddrBookEdit from './Modal/LocalJobNoticeAddrBookEdit';

export type LocalJobOtherNoticeEmailProps = {};

export default React.memo(function LocalJobOtherNoticeEmail({}: LocalJobOtherNoticeEmailProps): JSX.Element {
  const {
    errorNotice: { recipient },
    deboundcedSearch,
    onChangeSelectEmail,
    onCreateCustomEmail,
    setVisibleAddr,
    selectRef,
    onSelectEscKeyPress,
  } = useLocalJobOtherNoticeEmail();

  const RecipientComponent = useMemo(
    () => (
      <>
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
        <Button
          type="primary"
          shape="circle"
          icon={<BookOutlined />}
          css={css``}
          onClick={() => setVisibleAddr(true)}
        />
      </>
    ),
    [
      recipient,
      deboundcedSearch,
      onChangeSelectEmail,
      onCreateCustomEmail,
      setVisibleAddr,
      onSelectEscKeyPress,
      selectRef,
    ]
  );

  return (
    <div css={style}>
      <div className="recipients">
        <div className="recipients-title">
          <Badge color="blue" />
          <span>Recipients</span>
        </div>
        <div className="recipients-value">{RecipientComponent}</div>
      </div>
      <V_SPACE />
      <LocalJobNoticeAddrBookEdit />
    </div>
  );
});

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

const style = css`
  display: flex;
  flex-direction: column;

  .recipients-title,
  .subject-title,
  .body-title {
    display: flex;
    width: 10rem;
  }

  .recipients {
    display: flex;
    .recipients-value {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }

  .subject {
    display: flex;
    .subject-value {
      display: flex;
      width: 50rem;
    }
  }

  .body {
    display: flex;
    .body-value {
      display: flex;
      width: 50rem;
    }
  }
`;

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
