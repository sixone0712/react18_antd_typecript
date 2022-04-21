import { css } from '@emotion/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { convertPreviewSampleSelector } from '../../../reducers/slices/convert';

export type ConvertDefineTableRegexSampleProps = {};

export default function ConvertDefineTableRegexSample({}: ConvertDefineTableRegexSampleProps): JSX.Element {
  const previewData = useSelector(convertPreviewSampleSelector);

  if (!previewData.text) {
    return <></>;
  }

  return (
    <div css={style}>
      <pre className="text">{previewData.text}</pre>
    </div>
  );
}

const style = css`
  .text {
    margin-left: 1rem;
    margin-right: 1rem;
    max-height: 20rem;
  }
`;
