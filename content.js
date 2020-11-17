// content script
const contentPort = chrome.runtime.connect({
  name: 'content-script'
});

window.addEventListener('message', listenFromWebPage);
function listenFromWebPage(event) {
  if (event.data && event.data.source === 'my-chrome-extension-web-page') {
    console.log('posting from contentPort')
    contentPort.postMessage({ data: event.data.data, source: 'my-chrome-extension-content-script' });
    // contentPort.postMessage({ data: event.data.data, source: 'my-chrome-extension-content-script' });
  }
}

function installHook() {
    if (window.__MY_EXTENSION_HOOK__) {
    return;
  }
    
  console.log('installing')
  const listeners = new Map();
  const hook = {
    subscribe(eventName, listener) {
      if (!listeners.has(eventName)) listeners.set(eventName, []);
      listeners.get(eventName).push(listener);
    },
    sendMessage(data) {
      console.log('data', data)
      window.postMessage({
        source: 'my-chrome-extension-web-page',
        ...data,
      });
    },
  };

  // listen for events
  window.addEventListener('message', listenFromContentScript);
  function listenFromContentScript(event) {
    if (
      event.source === window &&
      event.data &&
      event.data.source === 'my-chrome-extension-content-script'
    ) {
      if (listeners.has(event.data.type)) {
        listeners
          .get(event.data.type)
          .forEachlistener(event => listener(event.data));
      }
    }
  }
  // define a read only, non-overridable and couldn't be found on globalThis property keys
  Object.defineProperty(globalThis, '__MY_EXTENSION_HOOK__', {
    configurable: false,
    enumerable: false,
    get() {
      return hook;
    },
  });
}
// execute the install hook in web page context
const script = document.createElement('script');
script.textContent = `;(${installHook.toString()})();`;
document.documentElement.appendChild(script);
