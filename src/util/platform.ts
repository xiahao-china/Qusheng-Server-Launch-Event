/**
 * 判断当前设备平台
 * @returns {'iOS' | 'Android' | 'PC'}
 */
export const getPlatform = () => {
  const ua = navigator.userAgent;

  // 优先检查 custom UA 标识
  if (ua.indexOf('wolf_ios') > -1) return 'iOS';
  if (ua.indexOf('wolf_android') > -1) return 'Android';

  // 检查标准 UA
  if (ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) return 'Android';
  if (ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'iOS';

  return 'PC';
};

/**
 * 判断是否为 iOS
 */
export const isIOS = () => getPlatform() === 'iOS';

/**
 * 判断是否为 Android
 */
export const isAndroid = () => getPlatform() === 'Android';

/**
 * 判断是否为 PC
 */
export const isPC = () => getPlatform() === 'PC';