import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import axios from "axios";
import { AxiosError } from "axios";

let authToken: string | null = null; // store token in memory (safer than localStorage)

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon:
      process.platform === "win32"
        ? join(__dirname, "../../resources/icon.ico")
        : process.platform === "linux"
          ? join(__dirname, "../../resources/icon.png")
          : undefined, // macOS handled by app bundle
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC HANDLER
  // TODO: Separate the different routes
  ipcMain.handle("auth:login", async (_event, { adminUser, password }) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/admin/login",
        {
          adminUser,
          password,
        }
      );

      if (res.data && res.data.success) {
        authToken = res.data.token; // save in memory
        return { success: true, token: authToken };
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
