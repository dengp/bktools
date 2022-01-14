/**
 * H5与客户端通信api
 */
const userAgent = navigator.userAgent;
const isIphone = userAgent.indexOf('iPhone') > -1 || (userAgent.match(/(iPad)/) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
const isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1;
const isListenApp = userAgent.indexOf('kuwopage') > -1;
let callbackIndex = 0;

const ctJsApi = {
  isListenApp: isListenApp,
  isAndroid: isAndroid,
  isIphone: isIphone,
  modal: {
    toast
  },
  kwMusic: {
    getRecentlyPlay,
    play
  },
  kwTool: {
    openApp,
    openRewardedVideoAD,
    specificShare,
    registerEventNotifyListener,
    getTopPage,
    writeSysCalendar,
    getContacts,
    wxAuthorization,
    getAuthCode,
    lrtsBindFinish,
    showLoading,
    hideLoading
  },
  kwAxios: {
    fetch
  },
  kwRouter: {
    pageBack,
    openDialog,
    jumpRouter
  },
  globalEvent: {

  },
  storage: {
    getItem,
    setItem
  },
  kwTask: {
    getTotalPlayTime,
    getTotalWatchVideoTime,
    getTotalPlayMiniGameTime,
    openActiveScan,
    closeActiveScan
  },
  onResume,
  h5Toast
}
/**
*
*
* @param {object} data 数据对象
* @param {boolean} [hasOnlyCallback=true] weex是否有单个回调函数
* @returns
*/
function callNative (data: any, hasOnlyCallback = true, isHasCallback = true) {
  const callbackName = `ctJsBridgeCallback${callbackIndex++}`;
  let jsonStr = '';
  return new Promise<void>((resolve, reject) => {
    function callback () {
      return function (res: any) {
        let result = res;
        if (res && typeof res === 'string') {
          try {
            result = JSON.parse(res);
          } catch (error) {
            console.warn('JSON.parse err:', res);
          }
        }
        return resolve(result);
      };
    }
    if (!data.action) {// weex
      if (isAndroid) {
        data = Object.assign({}, data, {
          action: 'wx_method'
        });
      }
      if (hasOnlyCallback) {
        (window as any)[callbackName] = callback();
        if (data.params && data.params.callback) {
          (window as any)[callbackName] = data.params.callback;
          delete data.params.callback;
        }
        data = Object.assign({}, data, {
          callback: [callbackName]
        });
      }
    } else {// h5
      (window as any)[callbackName] = data.callback ? data.callback : callback();
      data = Object.assign({}, data, {
        callback: callbackName
      });
    }
    jsonStr = JSON.stringify(data);
    console.log(jsonStr)
    try {
      if (isIphone && (window as any).webkit && (window as any).webkit.messageHandlers && (window as any).webkit.messageHandlers.KuwoInterface) {
        (window as any).webkit.messageHandlers.KuwoInterface.postMessage(data);
      } else {
        (window as any).webkit && (window as any).webkit.jsCallNative(jsonStr);
      }
      if (!hasOnlyCallback) {
        resolve();
      }
    } catch (e) {
      reject();
    }
  })
}
// weex api
function toast(data: any) {
  data = Object.assign({}, {
    module: 'modal',
    method: 'toast',
    params: data
  });
  return callNative(data, false);
}

function getRecentlyPlay(data: any) {
  data = Object.assign({}, {
    module: 'kwMusic',
    method: 'getRecentlyPlay',
    params: data
  });
  return callNative(data);
}

function play(data: any) {
  data = Object.assign({}, {
    module: 'kwMusic',
    method: 'play',
    params: data
  });
  return callNative(data);
}

/**
* openApp
* @param data.type (weixin、qq、weibo)
* */
function openApp(data: any) {
  data = Object.assign({}, {
    module: 'kwTool',
    method: 'openApp',
    params: data
  });
  return callNative(data);
}

// h5 api
function onResume(data: any) {
  document.addEventListener('resume', function (e: any) {
    data.callback(e.data);
  });
}
// 测试action 整理时可删除
function h5Toast(data: any) {
  data = Object.assign({}, data, {
    action: 'control_toast'
  });
  return callNative(data, false);
}


/**
* openRewardedVideoAD  浏览广告视频
* @param data.slotId  广告ID  iOS和安卓不一样
* */
function openRewardedVideoAD(data: any) {
  data = Object.assign({}, {
    module: 'kwTool',
    method: 'openRewardedVideoAD',
    params: data
  });
  return callNative(data);
}

// weex 发请求
// url: "",
// data: {}
// method: 'GET',
// header: {},
// timeout: 3000,
// cache: false,
// encryptRequest: false,
// encryptResponse: false,
// zipResponse: false
function fetch(data: any) {
  data = Object.assign({}, {
    module: 'kwAxios',
    method: 'fetch',
    params: data
  });
  return callNative(data);
}

function specificShare(data: any) {
  data = Object.assign({}, {
    module: 'kwTool',
    method: 'specificShare',
    params: data
  });
  return callNative(data);
}


//  页面返回
function pageBack() {
  let data = isAndroid ? {action: 'closercmwindow'} : {
    module: 'kwRouter',
    method: 'back',
    params: {
      type: "PUSH",
      length: 1
    }
  }
  return callNative(data, false);
}

function getItem(data: any) {
  data = Object.assign({}, {
    module: 'storage',
    method: 'getItem',
    params: data
  });
  return callNative(data);
}

function setItem(data: any) {
  data = Object.assign({}, {
    module: 'storage',
    method: 'setItem',
    params: data
  });
  return callNative(data);
}

function getTotalPlayTime(data: any) {
  data = Object.assign({}, {
    module: 'kwTask',
    method: 'getTotalPlayTime',
    params: data
  });
  return callNative(data);
}

function getTotalWatchVideoTime(data: any) {
  data = Object.assign({}, {
    module: 'kwTask',
    method: 'getTotalWatchVideoTime',
    params: data
  });
  return callNative(data);
}

function getTotalPlayMiniGameTime(data: any) {
  data = Object.assign({}, {
    module: 'kwTask',
    method: 'getTotalPlayMiniGameTime',
    params: data
  });
  return callNative(data);
}

function registerEventNotifyListener(data: any) {
  data = Object.assign({}, {
    module: 'kwTool',
    method: 'registerEventNotifyListener',
    params: data
  });
  return callNative(data);
}

function openActiveScan(data: any) {
  data = Object.assign({}, {
    module: 'kwTask',
    method: 'openActiveScan',
    params: data
  });
  return callNative(data);
}

function closeActiveScan(data: any) {
  data = Object.assign({}, {
    module: 'kwTask',
    method: 'closeActiveScan',
    params: data
  });
  return callNative(data, false);
}

function openDialog(data: any) {
  data = Object.assign({}, {
    module: 'kwRouter',
    method: 'openDialog',
    params: data
  });
  return callNative(data, false);
}

function getTopPage(data: any) {
  data = Object.assign({}, {
    module: 'kwTool',
    method: 'getTopPage',
    params: data
  });
  return callNative(data);
}

function writeSysCalendar(data: any) {
  data = Object.assign({}, {
    module: 'kwTool',
    method: 'writeSysCalendar',
    params: data
  });
  return callNative(data);
}

function getContacts(data: any) {
  data = Object.assign({}, {
    module: 'kwTool',
    method: 'getContacts',
    params: data
  });
  return callNative(data);
}

function wxAuthorization(data: any) {
  data = Object.assign({}, {
    module: 'kwTool',
    method: 'wxAuthorization',
    params: data
  });
  return callNative(data);
}

function getAuthCode(data: any) {
  data = Object.assign({}, {
    module: 'kwTool',
    method: 'getAuthCode',
    params: data
  });
  return callNative(data);
}
function lrtsBindFinish(data: any) {
  data = Object.assign({}, {
    module: 'kwTool',
    method: 'lrtsBindFinish',
    params: data
  });
  return callNative(data);
}

function jumpRouter(data: any) {
  data = Object.assign({}, {
    module: 'kwRouter',
    method: 'jumpRouter',
    params: data
  });
  return callNative(data);
}

function showLoading() {
  const data = Object.assign({}, {
    module: 'kwTool',
    method: 'showLoading'
  });
  return callNative(data);
}

function hideLoading() {
  const data = Object.assign({}, {
    module: 'kwTool',
    method: 'hideLoading'
  });
  return callNative(data);
}



export default ctJsApi;


