import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobPlanTable, {
  RemoteJobPlanTableProps,
} from '../../../../components/modules/RemoteJob/RemoteJobPlanTable';

describe('renders the component', () => {
  it('renders correctly', () => {
    const props: RemoteJobPlanTableProps = {
      plans: [],
      selectPlanIds: [1],
      setSelectPlanIds: (value: React.Key[]) => {},
      isFetchingPlans: false,
      refreshPlans: () => {},
      selectSiteInfo: { key: '1', value: 1, label: '1' },
    };

    const component = shallow(<RemoteJobPlanTable {...props} />);
  });
});
