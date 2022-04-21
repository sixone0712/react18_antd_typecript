import { MutableRefObject } from 'react';
import { MutationStatus } from 'react-query';

export const waitMutationStatus = async function* (): any {
  while (true) {
    const isFetching: MutableRefObject<boolean> = yield;
    if (isFetching.current) {
      yield new Promise((resolve) => {
        setTimeout(() => resolve(resolve), 100);
      });
    } else {
      return;
    }
  }
};

/*
const deleteMutating = useIsMutating({ mutationKey: ['delete_local_job'] });
const deleteMutatingRef = useRef(false);

let result;
while ((result = await generator.next(deleteMutatingRef)) && !result.done) {
  // noting to do
}

useEffect(() => {
    deleteMutatingRef.current = deleteMutating > 0 ? true : false;
}, [deleteMutating]);
*/
