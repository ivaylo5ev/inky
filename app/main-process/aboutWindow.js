const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const ipc = electron.ipcMain;
const fs = require("fs");
const inkjsPackage = require('inkjs/package.json');


const electronWindowOptions = {
    width: 340,
    height: 270,
    resizable: false,
    title: "About Inky"
};

const versionFilePath = "ink/version.txt";
const inklecateRootPathRelease = path.join(__dirname, "../../app.asar.unpacked/main-process");
const inklecateRootPathDev = __dirname;
var fullVersionFilePath = path.join(inklecateRootPathRelease, versionFilePath);

try { fs.accessSync(versionFilePath) }
catch(e) {
    fullVersionFilePath = path.join(inklecateRootPathDev, versionFilePath);
}


var inkyVersion = null;
var inkVersion = fs.readFileSync(fullVersionFilePath, "utf8");
var inkjsVersion = null;

var aboutWindow = null;


function AboutWindow() {
    var w = new BrowserWindow(electronWindowOptions);
    w.loadURL("file://" + __dirname + "/../renderer/about/about.html");

    // w.webContents.openDevTools();

    w.webContents.on("did-finish-load", () => {
        w.webContents.send("set-about-data", {
            "inkyVersion": electron.app.getVersion(),
            "inkVersion": inkVersion,
            "inkjsVersion": inkjsPackage.version
        });
    });

    this.browserWindow = w;

    w.on("close", () => {
        aboutWindow = null;
    });
}
AboutWindow.showAboutWindow = function () {
    if( aboutWindow == null ) {
        aboutWindow = new AboutWindow();
        return aboutWindow;
    }
}

exports.AboutWindow = AboutWindow;