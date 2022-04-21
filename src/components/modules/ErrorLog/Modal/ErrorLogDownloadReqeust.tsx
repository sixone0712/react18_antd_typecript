import { css } from '@emotion/react';
import { Badge, Button, DatePicker, Modal } from 'antd';
import React, { useMemo } from 'react';
import useErrorLogDownloadRequest from '../../../../hooks/errorLog/useErrorLogDownloadRequest';
import { V_SPACE } from '../../../atoms/Space';

export default React.memo(function ErrorLogDownloadReqeust(): JSX.Element {
  const {
    siteInfo,
    visible,
    onOk,
    onClose,
    date,
    onChangeDate,
    command,
    reqDownload,
    isFetchingDownload,
  } = useErrorLogDownloadRequest();
  const closeButton = useMemo(() => {
    return (
      <Button key="close" type="primary" onClick={onClose} disabled={isFetchingDownload}>
        Close
      </Button>
    );
  }, [onClose, isFetchingDownload]);

  const downloadButton = useMemo(() => {
    return (
      <Button key="download" type="primary" onClick={onOk} loading={isFetchingDownload} disabled={isFetchingDownload}>
        Download
      </Button>
    );
  }, [onOk, isFetchingDownload]);

  return (
    <Modal
      title="Error Log Download"
      visible={visible}
      onOk={onOk}
      onCancel={onClose}
      width={700}
      destroyOnClose
      footer={[closeButton, downloadButton]}
    >
      <div css={style}>
        <div className="user-fab-name">
          <div className="name">
            <Badge color="blue" />
            <span>User-Fab Name</span>
          </div>
          <div className="value">{siteInfo.siteName}</div>
        </div>
        <V_SPACE />
        <div className="error-code">
          <div className="name">
            <Badge color="blue" />
            <span>Error Code</span>
          </div>
          <div className="value">{reqDownload.error_code}</div>
        </div>
        <V_SPACE />
        <div className="equipment-name">
          <div className="name">
            <Badge color="blue" />
            <span>Equipment Name</span>
          </div>
          <div className="value">{reqDownload.equipment_name}</div>
        </div>
        <V_SPACE />
        <div className="error-date">
          <div className="name">
            <Badge color="blue" />
            <span>Error Date</span>
          </div>
          <div className="value">{reqDownload.occurred_date}</div>
        </div>
        <V_SPACE />
        <div className="device">
          <div className="name">
            <Badge color="blue" />
            <span>Device</span>
          </div>
          <div className="value">{reqDownload.device}</div>
        </div>
        <V_SPACE />
        <div className="process">
          <div className="name">
            <Badge color="blue" />
            <span>Process</span>
          </div>
          <div className="value">{reqDownload.process}</div>
        </div>
        <V_SPACE />
        <div className="collecting-date">
          <div className="name">
            <Badge color="blue" />
            <span>Collecting Date</span>
          </div>
          <DatePicker.RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={onChangeDate}
            // onOk={onOk}
            value={date}
          />
        </div>
        <V_SPACE />
        <div className="type">
          <div className="name">
            <Badge color="blue" />
            <span>Type</span>
          </div>
          <div className="value">{reqDownload.type}</div>
        </div>

        <V_SPACE />
        <div className="command">
          <div className="name">
            <Badge color="blue" />
            <span>{reqDownload.type === 'FTP' ? 'Log Name' : 'Command'}</span>
          </div>
          <div className="value">{reqDownload.type === 'FTP' ? command.split(',').join(', ') : command}</div>
        </div>
      </div>
    </Modal>
  );
});

const style = css`
  display: flex;
  flex-direction: column;

  .user-fab-name,
  .error-code,
  .equipment-name,
  .error-date,
  .device,
  .process,
  .collecting-date,
  .type,
  .command {
    display: flex;
    flex-direction: row;
    .name {
      width: 10rem;
    }
    .value {
      width: 30.75rem;
    }
  }

  .collecting-date {
    align-items: center;
  }
`;

export const requestSuccessMessage = (
  <div>
    <div>{'Succeed to request error log download.'}</div>
    <div> {'Click the Downloaded File List button to check the downloaded files'}</div>
  </div>
);

export const requestFailureTooMayRequestMessage = (
  <div>
    <div>{'The server is processing a previous download request.'}</div>
    <div> {'Please retry again after a while.'}</div>
  </div>
);
