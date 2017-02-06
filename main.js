const fs = require('fs');
const menubar = require('menubar')
const { app, Menu } = require('electron');

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

function setUpMainMenu() {
  const template = [{
    label: "Build Kitten",
    submenu: [
      { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
  ]}, {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
  }, {
    label: 'Help',
    submenu: [{
      label: 'Raise an issue',
      click() {
        shell.openExternal('https://github.com/jamesmacfie/buildkitten/issues');
      }
    }]
}];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function setupContextMenu() {
  mb.window.webContents.on('context-menu', (e, props) => {
    const {
      x,
      y
    } = props;

    Menu.buildFromTemplate([{
      label: 'Inspect element',
      click() {
        mb.window.inspectElement(x, y);
      }
    }]).popup(mb.window);
  });
}


mb.on('ready', () => {
  setUpMainMenu();
  setupContextMenu();
  mb.window.webContents.on('did-navigate', loadCSS);
})
