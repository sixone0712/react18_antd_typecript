import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { useDispatch, useSelector } from 'react-redux';
import {
  convertRegexSelector,
  convertSelectRegexSelector,
  convertShowRegexSelector,
  setConvertInfo,
  setConvertRegexCodeReducer,
} from '../../../../reducers/slices/convert';

import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/snippets/python';
import 'ace-builds/src-noconflict/theme-github';
export type ConvertDefineRegexModalProps = {};

function ConvertDefineRegexModal({}: ConvertDefineRegexModalProps): JSX.Element {
  const visible = useSelector(convertShowRegexSelector);
  const select = useSelector(convertSelectRegexSelector);
  const selectRegex = useSelector(convertRegexSelector(select));
  const dispatch = useDispatch();
  const [code, setCode] = useState<string>('');

  const onChange = (value: string) => {
    setCode(value);
  };

  const onClose = useCallback(() => {
    dispatch(
      setConvertInfo({
        show_regex: false,
        select_regex: undefined,
      })
    );
  }, [dispatch]);

  const onOk = useCallback(() => {
    if (select !== undefined) {
      dispatch(setConvertRegexCodeReducer({ index: select, value: code !== '' ? code : null }));
      dispatch(setConvertInfo({ show_regex: false, select_regex: undefined }));
    }
  }, [dispatch, select, code]);

  useEffect(() => {
    setCode(selectRegex ?? '');
  }, [selectRegex]);

  return (
    <Modal title="Regex Editor" visible={visible} onOk={onOk} onCancel={onClose} width={600}>
      {visible && select !== undefined && (
        <StyledEditor css={style}>
          <AceEditor
            placeholder="Input Python Code Here!"
            mode="python"
            theme="github"
            name="regex"
            width={'552px'}
            onChange={onChange}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={code ?? undefined}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 4,
            }}
            enableSnippets={true}
          />
        </StyledEditor>
      )}
    </Modal>
  );
}

export default React.memo(ConvertDefineRegexModal);

const style = css``;

const StyledEditor = styled.div`
  margin-top: 10px;
  * {
    font-family: consolas;
    line-height: 1;
  }
`;
