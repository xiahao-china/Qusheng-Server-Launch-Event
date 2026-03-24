/**
 * 获取URL参数
 * @param url - 可选的URL字符串，默认取当前页面URL
 * @returns 参数对象
 */
export const getUrlParams = (url?: string): Record<string, string> => {
  const cloneUrl = url ? url : location.href;
  if (!cloneUrl.includes("?")) {
    return {};
  }
  const urlStr = cloneUrl.split("?")[1];
  const obj: Record<string, string> = {};
  const paramsArr = urlStr.split("&");
  for (let i = 0, len = paramsArr.length; i < len; i++) {
    const arr = paramsArr[i].split("=");
    obj[arr[0]] = arr[1];
  }
  return obj;
};

/**
 * 获取token
 * @returns token值
 */
export const getToken = (): string | null => {
  return getUrlParams().userToken || null;
};