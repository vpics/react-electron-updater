const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const package = require("./package.json");

// Logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "build/index.html"));
  // mainWindow.loadURL("https://react-electron-updator.vercel.app/");
  // autoUpdater.checkForUpdates();
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

autoUpdater.autoDownload = false;
var currentVersion;

autoUpdater
  .checkForUpdates()
  .then((updateCheckResult) => {
    let info = updateCheckResult.updateInfo;
    console.log("Info: ", info, info.releaseNotes);

    // var isNewer = false;
    currentVersion = package.version;
    // let cvs = currentVersion.split(".").map((s) => Number(s));
    // let uvs = info.version.split(".").map((s) => Number(s));
    // if (
    //   uvs[0] > cvs[0] ||
    //   (uvs[0] === cvs[0] && uvs[1] > cvs[1]) ||
    //   (uvs[0] === cvs[0] && uvs[1] === cvs[1] && uvs[2] > cvs[2])
    // ) {
    //   isNewer = true;
    // }
    // if (isNewer) {
    const messageBoxOptions = {
      type: "question",
      buttons: ["Download", "Skip"],
      defaultId: 0,
      cancelId: 1,
      title: "Update Available",
      message: `A new version (${info.version}) is available. You are currently using version ${currentVersion}. Do you want to download it now?`,
    };

    dialog.showMessageBox(messageBoxOptions).then((response) => {
      if (response.response === messageBoxOptions.defaultId) {
        autoUpdater.downloadUpdate(updateCheckResult.cancellationToken);
      } else {
        console.log("User has skip the update.");
      }
    });
    // }
  })
  .catch((e) => {
    console.error("Auto-update error:");
    console.error(e);
  });

autoUpdater.on("update-downloaded", (info) => {
  console.log("update-downloaded", info);

  const messageBoxOptions = {
    type: "question",
    buttons: ["Install Now", "Later"],
    defaultId: 0,
    cancelId: 1,
    title: "Update Downloaded",
    message: `Version ${info.releaseName} has been downloaded. Do you want to install it now?`,
    detail: info.releaseNotes ? info.releaseNotes : "No release notes available.",
  };

  dialog.showMessageBox(messageBoxOptions).then((response) => {
    if (response.response === messageBoxOptions.defaultId) {
      autoUpdater.quitAndInstall();
    } else {
      console.log("User declined the update.");
    }
  });

  // console.log("updates-downloaded");
  // autoUpdater.quitAndInstall();

  // const dialogOpts = {
  //   type: "info",
  //   buttons: ["Restart"],
  //   title: "Application Update",
  //   detail:
  //     "A new version has been downloaded. Restart the application to apply the updates.",
  // };
  // dialog.showMessageBox(dialogOpts).then((returnValue) => {
  //   if (returnValue.response === 0) autoUpdater.quitAndInstall();
  // });

  // dialog.showMessageBox(dialogOpts).then((returnValue) => {
  //   setTimeout(function () {
  //     autoUpdater.quitAndInstall();
  //   }, 5000);
  // });
});
