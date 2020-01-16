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

  return keys.map((param) => `${param}=${params[param]}`).join('&');
};

export const displayMillisecInMinSec = (ms: number) => {
  const d = new Date(1000 * Math.round(ms / 1000));
  let seconds = d.getUTCSeconds().toString();
  seconds = seconds.length < 2 ? `0${seconds}` : seconds;
  return `${d.getUTCMinutes()}:${seconds}`;
};

export const searchParamsAsObj = (str: string) => {
  // @ts-ignore
  return Array.from(new URL(str).searchParams).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
};

export const getArtists = (artists: any[]) => {
  return artists.length > 2
    ? artists.map((artist) => artist.name).join(', ')
    : artists[0].name;
};
