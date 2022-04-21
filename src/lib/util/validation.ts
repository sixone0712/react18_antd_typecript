export function regExpEmail() {
  return new RegExp(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    'g'
  );
}

export function regExpName() {
  // return new RegExp(/^([a-zA-Z0-9])([a-zA-Z0-9._-]{0,28})([a-zA-Z0-9]$)/, 'g');
  return new RegExp(/^([a-zA-Z0-9])([a-zA-Z0-9._-]{0,28})([a-zA-Z0-9]$)/, 'gi');
}

export function regExpIpAddress() {
  return new RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
}

export function regExpIpAddressWithLocalhost() {
  return new RegExp(
    '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|localhost'
  );
}

export function validateEmail(email: string): boolean {
  if (regExpEmail().test(email)) return true;

  return false;
}

export const regExpVariable = new RegExp(/^[a-zA-Z_$]+([\w_$]*)$/);
export const regExpLambda = new RegExp(/^((?!").)*$/);

export const hasValue = (value: any): boolean => Boolean(value); // 0 is false
export const hasArrayWithData = (value: any): boolean => Array.isArray(value) && value.length > 0;
