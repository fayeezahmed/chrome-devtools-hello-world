function doSomething(msg) {
  document.body.textContent = '';
  console.log(msg)
  Object.keys(msg.data.data).forEach((keys) => {
    document.body.textContent += `\n ${keys}`;
  })
}

document.documentElement.onclick = function() { 
  console.log('onclick!!')
  respond('Responding from panel.js!')
}
