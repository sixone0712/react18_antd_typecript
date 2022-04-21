import { css, SerializedStyles } from '@emotion/react';
import { Tag } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import React from 'react';

export interface MarkUpTagsProps {
  tags: string[];
  setTags: (value: string[]) => void;
  tagsStyle?: SerializedStyles;
}
function MarkUpTags({ tags, setTags, tagsStyle }: MarkUpTagsProps): JSX.Element {
  const handleClose = (removedTag: string) => {
    setTags(tags.filter((tag) => tag !== removedTag));
  };

  const forMapTags = (tag: string, index: number) => {
    const tagElem = (
      <Tag
        color="green"
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
        css={css`
          margin-bottom: 0.25rem;
        `}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
      // <div key={tag}>{tagElem}</div>
    );
  };
  return (
    <TweenOneGroup
      enter={{
        scale: 0.8,
        opacity: 0,
        type: 'from',
        duration: 100,
        onComplete: (e: { index: number; target: HTMLElement }) => {
          // e.target.style = '';
        },
      }}
      leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
      appear={false}
      css={tagsStyle}
    >
      {tags.map(forMapTags)}
    </TweenOneGroup>
  );
}

export default MarkUpTags;
