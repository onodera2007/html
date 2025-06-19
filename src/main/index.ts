import { app, Menu, Tray, BrowserWindow, ipcMain, globalShortcut, net } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import img from '../../resources/icon.ico?asset'

let win: BrowserWindow | null = null
const preload = join(__dirname, '../preload/index.js')

function createWindow(): void {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        resizable: false,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: true
        }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        win.loadURL(process.env['ELECTRON_RENDERER_URL'])
        win.webContents.openDevTools()
        globalShortcut.register('CommandOrControl+R', () => {
            win!.webContents.reload()
        })
    } else {
        win.loadFile(join(__dirname, '../renderer/index.html'))
    }

    win.on('close', (e) => {
        win!.hide()
        win!.setSkipTaskbar(true)
        e.preventDefault()
    })
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
        // 打开的窗口，那么程序会重新创建一个窗口。
        const allWindows = BrowserWindow.getAllWindows()
        if (allWindows.length) allWindows[0].focus()
        else createWindow()
    })

    createTrayMenu()
    handleRegister()
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
        autoHideMenuBar: true,
        resizable: false,
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        childWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${arg}`)
    } else {
        childWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: arg })
    }
})

ipcMain.handle('api-call', async (_event, url: string) => {
    return new Promise((resolve) => {
        const request = net.request(url)
        let data = ''

        request.on('response', (response) => {
            response.on('data', (chunk) => {
                data += chunk
            })
            response.on('end', () => {
                resolve(JSON.parse(data))
            })
        })

        request.on('error', (err) => {
            resolve(err)
        })
        request.end()
    })
})

// ipcMain.handle('copy-to-clipboard', (event, text) => {
//     clipboard.writeText(text);
// });

ipcMain.on('renderer-loaded', (event) => {
    event.sender.send('remove-loading')
})

const handleRegister = () => {
    globalShortcut.register('CommandOrControl+`', () => {
        win!.isVisible() ? win!.hide() : win!.show()
    })
}

const createTrayMenu = () => {
    const tray = new Tray(img)

    let trayMenuList = [
        // {
        //     label: `${win!.isVisible() ? '显示' : '隐藏'} `,
        //     click: () => win!.isVisible() ? win!.hide() : win!.show()
        // },
        {
            label: '退出',
            click: () => {
                // app.quit()
                globalShortcut.unregisterAll()
                win!.destroy()
            }
        }
    ]
    const contextMenu = Menu.buildFromTemplate(trayMenuList)
    tray.setToolTip('tools')
    tray.setContextMenu(contextMenu)
    tray.on('click', () => (win!.isVisible() ? win!.hide() : win!.show()))

    return tray
}
