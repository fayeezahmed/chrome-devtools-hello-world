// Background script is the interface between the other extension components:
//       **************************************
//       *    _______          __________     *  
//       *   | Popup |        | Devtools |    *     
//       *    -------          ----------     *    
//       *       \\                //         *   
//       *    ____________________________    *   
//       *   |        Background          |   * 
//       *    ----------------------------    *     
//       *  |-------------||---------------|  *      
//       *                ||                  *        
//       *         ________________           *       
//       *        | Content script |          *       
//       *         ----------------           *        
//       *                ||                  *         
//       *            __________              *     
//       *           | Web page |             *         
//       *            ----------              *    
//       **************************************


var ports = {};

chrome.runtime.onConnect.addListener(function (port) {
  // if(port.name !== 'content-script') return;

  // ports.push(port);
  ports[port.name] = port;
  // Remove port when destroyed (eg when devtools instance is closed)
    port.onDisconnect.addListener(function() {
        var i = ports.indexOf(port);
        if (i !== -1) ports.splice(i, 1);
    });

  port.onMessage.addListener(function(msg) {
    if(
      port.name === 'content-script' &&
      ports.devtools
    ) {
      ports.devtools.postMessage(msg)
      console.log(ports.devtools, '<1') 
      console.log(ports['devtools'], '<2') 
      // ports.devtools.postMessage('Communicating between content script and dev tools')
    }
    console.log(`Received from ${port.name}`, msg)
  })
})


// UI elements are declared in manifest, but you can also programmatically enable them here. 
// React Devtools does this:
// const iconPath = getIconBasedOnReactVersion();
// chrome.browserAction.setIcon({ tabId, path: iconPath });
// 
// function getIconBasedOnReactVersion() {
//   if (noReactDetected) {
//     return 'disabled-react-icon.png';
//   }
//   if (isReactDevelopment) {
//     return 'development-react-icon.png';
//   }
//   return 'production-react-icon.png';
// }
