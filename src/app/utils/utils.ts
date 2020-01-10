export const parseHash = (urlString = ''): any => {
  const fragmentsList = urlString.split('&');
  return fragmentsList.reduce((res, el) => {
    const [key, value] = el.split('=');
    res[key] = value;
    return res;
  }, {});
};

export const createQueryString = (params = {}) => {
  if (!params) {
    return '';
  }
  const keys = Object.keys(params);
  if (!keys.length) {
    return '';
  }

  return keys.map(param => `${param}=${params[param]}`).join('&');
};

export const displayMillisecInMinSec = (ms: number) => {
  const d = new Date(1000 * Math.round(ms / 1000));
  let seconds = d.getUTCSeconds().toString();
  seconds.length < 2 ? seconds = `0${seconds}` : seconds;
  return `${d.getUTCMinutes()}:${seconds}`;
}