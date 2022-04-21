import { ColumnType } from 'antd/lib/table/interface';
import { SiteDBInfo } from '../lib/api/axios/types';

export type SiteDBInfoColumnName =
  | 'crasServer'
  | 'index'
  | 'crasCompanyFabName'
  | 'crasAddress'
  | 'crasPort'
  | 'emailServer'
  | 'emailAddress'
  | 'emailPort'
  | 'emailUserName'
  | 'emailFrom'
  | 'rapidCollector'
  | 'rssAddress'
  | 'rssPort'
  | 'rssUserName'
  | 'edit'
  | 'delete';

// export type SiteInfoColumnPropsType = {
//   [name in SiteInfoColumnName]: {
//     key?: Key;
//     title?: React.ReactNode;
//     dataIndex?: DataIndex;
//     align?: AlignType;
//     sorter?:
//       | boolean
//       | CompareFn<SiteInfo>
//       | {
//           compare?: CompareFn<SiteInfo>;
//           /** Config multiple sorter order priority */
//           multiple?: number;
//         };
//   };
// };

export type SiteDBInfoColumnPropsType = {
  [name in SiteDBInfoColumnName]: ColumnType<SiteDBInfo>;
};
