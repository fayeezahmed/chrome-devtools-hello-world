function doSomething(msg) {
  document.body.textContent = '';
  Object.keys(msg.data.data).forEach((keys) => {
    document.body.textContent += `\n ${keys}`;
  })
}

document.documentElement.onclick = function() { 
  console.log('onclick!')
  // We can do whatever we want from here. We could send this message back to the index.html if we wanted.
  respond('Responding from panel.js!')
}
