import { AddressOption } from '../../types/address';
import { CRAS_LOCALHOST_NAME } from '../constants';

export function toCamelCase(str: string): string {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

export function secondToTime(secound: number) {
  let time = 0;
  let unit = 'day';

  const minutes = Math.floor(secound / 60);
  const hours = Math.floor(secound / (60 * 60));
  const days = Math.floor(secound / (60 * 60 * 24));

  if (days > 0) {
    time = days;
    unit = 'day';
  } else if (hours > 0) {
    time = hours;
    unit = 'hour';
  } else {
    time = minutes;
    unit = 'minute';
  }

  return {
    time,
    unit,
  };
}

export function timeToSecound(prevPeriod: { unit: string; time: number }): number {
  if (prevPeriod.unit === 'day') {
    return prevPeriod.time * 60 * 60 * 24;
  } else if (prevPeriod.unit === 'hour') {
    return prevPeriod.time * 60 * 60;
  } else {
    return prevPeriod.time * 60;
  }
}

export function convDateformat(value: string | undefined | null): string {
  if (!value) return '-';
  const year = value.substr(0, 4);
  const month = value.substr(4, 2);
  const day = value.substr(6, 2);
  const hour = value.substr(8, 2);
  const minute = value.substr(10, 2);
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

export function localhostToCrasLocalhostName(ipAddress: string) {
  return ipAddress === 'localhost' ? CRAS_LOCALHOST_NAME : ipAddress;
}

export function CrasLocalhostNameTolocalhost(ipAddress: string) {
  return ipAddress === CRAS_LOCALHOST_NAME ? 'localhost' : ipAddress;
}
