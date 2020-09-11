import core, { closeForeground, setSystemUiVisibility } from '@auto.pro/core'
import { run } from '@auto.pro/webview'

// 设置脚本分辨率和需要的权限
core({
    baseWidth: 1280,
    baseHeight: 720,
    needCap: true,
    needFloaty: true,
    needService: true,
    needForeground: true,
})

export const webview = run('file://' + files.path('assets/index.html'), {
    afterLayout() {
        setSystemUiVisibility('有状态栏的沉浸式界面')
    }
})

events.on('exit', () => {
    threads.shutDownAll()
    closeForeground()
})