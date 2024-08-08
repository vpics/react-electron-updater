const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const { autoUpdater, AppUpdater } = require("electron-updater");

let updateInterval = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // mainWindow.loadFile(path.join(__dirname, "build/index.html"));
  mainWindow.loadURL("https://react-electron-updator.vercel.app/");
  // updateInterval = setInterval(() => autoUpdater.checkForUpdates(), 600000);
  autoUpdater.checkForUpdates();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
  console.log("updates-available");
  const dialogOpts = {
    type: "info",
    buttons: ["Ok"],
    title: "Update Available",
    detail:
      "A new version download started. The app will be restarted to install the update.",
  };
  dialog.showMessageBox(dialogOpts);

  updateInterval = null;
});

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
  console.log("updates-downloaded");
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Application Update",
    detail:
      "A new version has been downloaded. Restart the application to apply the updates.",
  };
  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
});
