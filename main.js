const fs = require('fs');
const menubar = require('menubar')

const mb = menubar({
  index: 'https://buildkite.com/builds',
  webPreferences: {
    nodeIntegration: false
  },
  preloadWindow: true,
  height: 500,
  width: 430
});

function loadCSS() {
  fs.readFile(__dirname+ '/style.css', "utf-8", function(err, data) {
    if (err) {
      console.log('ARGH! Error reading CSS file');
      return;
    }
    mb.window.webContents.insertCSS(data.replace(/\s{2,10}/g, ' ').trim())
  });
}

mb.on('ready', () => {
  mb.window.webContents.on('did-navigate', loadCSS);
})
