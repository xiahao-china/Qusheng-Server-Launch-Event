const jsbridgeMap:any = {
    sdk: {
        getNativeToken: 'setUserToken',
        getNativeRoomId: 'setRoomId',
        getNativeParam: 'setUserNumber',
        getNativeUserId: 'setUserId',
        getAppInfo: 'getNativeUbsInfo',
        getAppVersion: 'setAppVersion',
        contactCustomerService: '',
        openWhats: '',
        openMessage: '',
        jsToCommunityIssued: 'jsToCommunityIssued',
        jsOpenNativePage: '',
        nativeShare: 'ComponentShareMethod',
        jsActShare: '',
        jsOpenGiftsPanel: '',
        jsToNativePay: 'jsToNativePay',
        postMessage: '',
        startRecord: 'startRecord',
        saveRecord: 'saveRecord',
        saveImageToLocal: 'saveImageToLocal',
        savedAvatarModel: 'savedAvatarModel',
        getStatusBarHeight: 'setStatusHeight',
        jsLocalPay: 'jsLocalPay'
    },
    track: {
        getNativeUbsInfo: 'getNativeUbsInfo'
    }
};

const keyMap:any = {
    sdk: 'app',
    track: 'EventTracking'
};

export const JSBridge = (key: string, data: any = {}) => {
  return new Promise((resolve) => {
    if (!key) {
      return resolve(false);
    }

      let useKey = '';

      try {
          useKey = Object.keys(keyMap).filter((k) => ~Object.keys(jsbridgeMap[k]).indexOf(key))[0];
      } catch (e) {}

      if (!useKey) {
          Promise.reject(new Error(`"${key}" Key Not In Preset`));
          return;
      }

      const cb = jsbridgeMap[useKey][key];
      const jsKey = keyMap[useKey];

    const resolveCb = (resData: any) => {
      try {
        resolve(JSON.parse(resData));
      } catch (e) {
        resolve(resData);
      }
    };

      if (cb) {
          if (!window[jsKey]) {
              (window as any)[jsKey] = {};
          }
          (window as any)[jsKey][cb] = (res: any) => {
              resolveCb(res);
          };
      }

      const uri = { ...data, ...{ __functionName: key }, ...(cb ? { name: `${jsKey}.${cb}` } : {}) };

    const win = window as any;

    if (win.nativeJsBridge && win.nativeJsBridge[key]) {
      const res = Object.keys(data).length
        ? win.nativeJsBridge[key](JSON.stringify(data))
        : win.nativeJsBridge[key]();
      resolveCb(res);
    } else if (
        (window as any).webkit &&
        (window as any).webkit.messageHandlers &&
        (window as any).webkit.messageHandlers.nativeJsBridge
    ) {
        (window as any).webkit.messageHandlers.nativeJsBridge.postMessage(uri);
        if (!cb) {
            resolveCb(undefined);
        }
    } else {
      resolve(false);
    }
  });
};

/**
 * web调用native方法
 */
export const postMessage = (params: any) => JSBridge('postMessage', params);

/**
 * 跳转客户端页面
 * @param nativePage 跳转的页面类型
 * @param jsData 传给客户端的参数
 */
export const openNativePage = (nativePage: number, jsData: any = {}) => {
  return JSBridge('jsOpenNativePage', {
    nativePage,
    jsData
  });
};

/**
 * 关闭当前webview
 */
export const closeWebView = (params: any = {}) => {
  const win = window as any;
  if (win.JsBridge?.quit) {
    win.JsBridge.quit();
  }
  // 14 为 NATIVE_PAGE_CLOSE_CURRENT_WEBVIEW
  return openNativePage(14, params);
};

/**
 * 跳转充值
 */
export const rechargeMoney = () => {
  // 18 为 NATIVE_PAGE_GUGU_RECHARGE
  return openNativePage(18);
};

/**
 * 保存图片到本地
 * @param base64 图片的base64字符串
 */
export const saveImageToLocal = (base64: string) => {
  const win = window as any;
  if (
    win.webkit &&
    win.webkit.messageHandlers &&
    win.webkit.messageHandlers.nativeJsBridge
  ) {
    // 兼容部分iOS实现
    win.webkit.messageHandlers.nativeJsBridge.postMessage({
      parmas: JSON.stringify({ base64 }),
      func: 'saveImageToLocal',
      __functionName: 'postMessage',
      __msg_type: 'call'
    });
    return Promise.resolve();
  } else {
    return JSBridge('saveImageToLocal', base64);
  }
};

/**
 * 分享图片到微信
 * @param base64 图片的base64字符串
 */
export const shareImageToWechat = (base64: string) => {
  return postMessage({
    func: 'onShareToPlatform',
    params: JSON.stringify({
      shareType: 'wechat',
      base64
    }),
    __msg_type: 'call'
  });
};
