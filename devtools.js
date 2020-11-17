// filename: devtools.js
// You need to programmatically add panels to the devtools.
chrome.devtools.panels.create(
  'My Devtools Panel 1',
   '',//'img_16.png',
  'panel.html',
  function(extensionPanel) {
    var _window; // panel html's window object
    var data=[];
    var port = chrome.runtime.connect({ name: 'devtools' });
    port.onMessage.addListener(function (msg) {
      // push msg on a queue if the panels is not open. Otherwise just run it.
      if(_window) {
        _window.doSomething(msg)
      } else {
        data.push(msg);
      }
    });

    extensionPanel.onShown.addListener(function tmp(panelWindow) {
      extensionPanel.onShown.removeListener(tmp); // run this only once
      _window = panelWindow;

      // Release the queued data
      var msg;
      while(msg = data.shift()) {
        _window.doSomething(msg);
      }

      // attach function 'respond' to the panel window context, so we can call it in panel.js
      _window.respond = function(msg) {
        console.log(port)
        port.postMessage(msg)
      }
    })
  }
);
