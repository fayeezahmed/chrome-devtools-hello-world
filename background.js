// Background script is the interface between the content script and other extension components:
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
  // Add reference to the ports when they connect so that we can call them later
  ports[port.name] = port;

  // Remove port when destroyed (eg when devtools instance is closed)
  port.onDisconnect.addListener(function() {
      ports[port.name] = null
  });

  port.onMessage.addListener(function(msg) {
    // One way comms from content-script to devtools for now.
    // This can be generalised to work from/to any port when needed.
    // No need to add unecessary complexity right now.
    if(
      port.name === 'content-script' &&
      ports.devtools
    ) {
      console.log(`Received from ${port.name} and sending to ${ports.devtools.name}`)
      ports.devtools.postMessage(msg)
    }
  })
})

