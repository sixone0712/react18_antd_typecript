import { BookOutlined, FileProtectOutlined, HomeOutlined, PartitionOutlined, SettingOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Breadcrumb } from 'antd';
import qs from 'qs';
import React from 'react';
import { useLocation } from 'react-router';
import { DEAFULT_URL } from '../../../lib/constants';
import CustomIcon from '../../atoms/CustomIcon';

export type DashBoardBreadcrumbProps = {};

interface DashParams {
  type?: string;
  id?: string;
}

interface DashLocation {
  search: string;
  pathname: string;
}

export default function DashBoardBreadcrumb({}: DashBoardBreadcrumbProps): JSX.Element {
  const location = useLocation<DashLocation>();
  const { icon, locations } = getBreadcrumb(location);

  return (
    <Breadcrumb css={breadcrumbStyle} separator=">">
      <Breadcrumb.Item>
        <HomeOutlined />
      </Breadcrumb.Item>
      {locations.map(
        (item: string, idx: number) =>
          item && (
            <Breadcrumb.Item key={item}>
              {idx === 0 && icon}
              <span>{item}</span>
            </Breadcrumb.Item>
          )
      )}
    </Breadcrumb>
  );
}

const breadcrumbStyle = css`
  padding-top: 1rem;
  padding-bottom: 1rem;
  /* width: 84rem;  */
  /* background-color: #eff2f5; */
`;

const getLocationName = (path: string) => {
  switch (path) {
    case 'status':
      return 'Status';
    case 'remote':
      return 'Remote';
    case 'local':
      return 'Local';
    case 'step':
      return 'Step';
    case 'add':
      return 'Add Job';
    case 'edit':
      return 'Edit Job';
    case 'history':
      return 'Build History';
    case 'errorlog':
      return 'Error Log Download';
    case 'convert':
      return 'Collect/Convert/Insert';
    case 'error':
      return 'Send Error Summary';
    case 'cras':
      return 'Create Cras Data';
    case 'version':
      return 'Version Check';
    case 'configure':
      return 'Configure';
    case 'rules':
      return 'Rules';
    case 'address':
      return 'Address Book';
    case 'account':
      return 'Account';
    case 'convert-log':
      return 'Convert Rules';
    case 'cras-data':
      return 'Cras Data';
    default:
      return '';
  }
};

const getLocationRuleName = (path: string) => {
  switch (path) {
    case 'rules':
      return 'Rules';
    case 'convert-rules':
      return 'Convert Rules';
    case 'cras-data':
      return 'Cras Data';
    case 'create':
      return 'Create Cras Data';
    case 'judge':
      return 'Judge Rules';
    case 'edit':
      return 'Edit';
    default:
      return '';
  }
};

const getBreadcrumb = (location: DashLocation) => {
  const { pathname } = location;

  if (pathname.startsWith(DEAFULT_URL + '/status')) {
    return {
      icon: <PartitionOutlined />,
      locations: getStatusLocation(location),
    };
  } else if (pathname.startsWith(DEAFULT_URL + '/configure')) {
    return {
      icon: <SettingOutlined />,
      locations: getConfigureLocation(location),
    };
  } else if (pathname.startsWith(DEAFULT_URL + '/rules')) {
    return {
      icon: <FileProtectOutlined />,
      locations: getRulesLocation(location),
    };
  } else if (pathname.startsWith(DEAFULT_URL + '/address')) {
    return {
      icon: <BookOutlined />,
      locations: getAddressLocation(location),
    };
  } else if (pathname.startsWith(DEAFULT_URL + '/account')) {
    return {
      icon: <CustomIcon name="idcard" />,
      locations: getAccountLocation(location),
    };
  }

  return {
    icon: null,
    locations: [],
  };
};

const getStatusLocation = (location: DashLocation) => {
  const { pathname, search } = location;
  const path = pathname.substring(1).split('/');
  const { name } = qs.parse(search, {
    ignoreQueryPrefix: true, // /about?details=true 같은 쿼리 주소의 '?'를 생략해주는 옵션입니다.
  });

  if (name) {
    return path.map((item, idx) => {
      if (idx === path.length - 1) return '';
      else return getLocationName(item);
    });
  } else {
    return path.map((item) => getLocationName(item));
  }
};

const getConfigureLocation = (location: DashLocation) => {
  const { pathname } = location;
  const path = pathname.substring(1).split('/');
  return path.map((item) => getLocationName(item));
};

const getRulesLocation = (location: DashLocation) => {
  const { pathname } = location;

  const path = pathname.substring(1).split('/');
  return path.map((item) => getLocationRuleName(item));
};

const getAddressLocation = (location: DashLocation) => {
  const { pathname } = location;
  const path = pathname.substring(1).split('/');
  return path.map((item) => getLocationName(item));
};

const getAccountLocation = (location: DashLocation) => {
  const { pathname } = location;
  const path = pathname.substring(1).split('/');
  return path.map((item) => getLocationName(item));
};
