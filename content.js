// content script
console.log('content script')
const contentPort = chrome.runtime.connect({
  name: 'content-script'
});

window.addEventListener('message', listenFromWebPage);
function listenFromWebPage(event) {
  if (event.data && event.data.source === 'my-chrome-extension-web-page') {
    console.log('posting from contentPort')
    contentPort.postMessage({ data: event.data.data, source: 'my-chrome-extension-content-script' });
  }
}

