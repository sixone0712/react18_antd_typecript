export const sleep = (sec: number): Promise<unknown> => new Promise((r) => setTimeout(r, sec));
