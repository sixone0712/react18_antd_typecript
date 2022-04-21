import { useSelector } from 'react-redux';
import { RootState } from './rootReducer';

export default function useTypedSelector<R>(selector: (state: RootState) => R): R {
  return useSelector(selector);
}
