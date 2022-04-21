import { ColumnProps } from 'antd/lib/table';
import { CompareFn } from 'antd/lib/table/interface';
import { AlignType, DataIndex } from 'rc-table/lib/interface';
import { Key } from 'react';

// export type TableColumnPropsType<T, K extends string> = {
//   [name in K]: {
//     key?: Key;
//     title?: React.ReactNode;
//     dataIndex?: DataIndex;
//     align?: AlignType;
//     sorter?:
//       | boolean
//       | CompareFn<T>
//       | {
//           compare?: CompareFn<T>;
//           /** Config multiple sorter order priority */
//           multiple?: number;
//         };
//     shouldCellUpdate?: (record: T, prevRecord: T) => boolean;
//     fixed?: 'left' | 'right' | boolean;
//     width?: number | string;
//   };
// };

export type TableColumnPropsType<T, K extends string> = {
  [name in K]: ColumnProps<T>;
};
