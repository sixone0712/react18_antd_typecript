import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';

type StateSelector<T> = (state: RootState) => T;
type EqualityFn<T> = (left: T, right: T) => boolean;

export default function useRootState<T>(selector: StateSelector<T>, equalityFn?: EqualityFn<T>) {
  return useSelector(selector, equalityFn);
}
