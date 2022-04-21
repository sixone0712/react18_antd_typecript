export const compareTableItem = <T extends unknown>(a: T, b: T, key: keyof T): number => {
  switch (typeof a[key]) {
    case 'number':
      return +a[key] - +b[key];
    case 'string':
    case 'object': {
      const aLower = JSON.stringify(a[key]).toLowerCase();
      const bLower = JSON.stringify(b[key]).toLowerCase();
      // return aLower < bLower ? -1 : aLower == bLower ? 1 : 0;
      return aLower.localeCompare(bLower);
    }
    case 'boolean':
      return a[key] === b[key] ? 0 : a[key] ? -1 : 1;
    default:
      return -1;
  }
};
