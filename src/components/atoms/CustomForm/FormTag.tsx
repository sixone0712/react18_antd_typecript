import { PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Form, Input, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

export interface FormTagProps {
  label: string;
  name: string;
  setTag: (tags: string[]) => void;
  tag: string[];
}

export default function FormTag({ label, name, tag, setTag }: FormTagProps): JSX.Element {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<any>();

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: any) => {
    if (e.target.value.length <= 50) {
      setInputValue(e.target.value);
    }
  };

  const handleInputConfirm = () => {
    if (inputValue && tag.indexOf(inputValue) === -1) {
      setTag([...tag, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleTagClose = (removedTag: string) => {
    const newTag = tag.filter((item) => item !== removedTag);
    setTag(newTag);
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current.focus();
      setInputValue('');
    }
  }, [inputVisible]);

  useEffect(() => {
    setInputVisible(false);
  }, []);

  return (
    <Form.Item label={label} name={name}>
      {tag.map((item, index) => {
        const tagElem = (
          <Tag
            className="edit-tag"
            key={item}
            closable={true}
            onClose={() => handleTagClose(item)}
            css={css`
              user-select: none;
              margin-bottom: 0.3rem;
            `}
          >
            <span>{item}</span>
          </Tag>
        );
        return tagElem;
      })}

      <Input
        ref={inputRef}
        type="text"
        size="small"
        className="tag-input"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
        css={css`
          display: ${inputVisible ? 'initial' : 'none'};
          width: 5rem;
          vertical-align: top;
        `}
      />
      <Tag
        className="site-tag-plus"
        onClick={showInput}
        css={css`
          display: ${inputVisible ? 'none' : 'initial'};
          background: #fff;
          border-style: dashed;
        `}
      >
        <PlusOutlined /> New Tag
      </Tag>
    </Form.Item>
  );
}
