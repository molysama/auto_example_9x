import { webview } from '@/system'
import { effect$, pause, resume } from '@auto.pro/core'
import { createFloaty } from '@auto.pro/floaty'
import { interval } from 'rxjs'
import { filter, share, take, takeUntil, tap } from 'rxjs/operators'

// 导入task$，当向task$输入'开始任务'时，将执行任务。输入其他值则停止任务
import { task$, task$$ } from './task'

// 使用effect$的好处是不需要创建新线程，且effect$的所有订阅都共存于一个线程环境
effect$.subscribe(() => {
    log('我是在webview -> effect$下执行的', threads.currentThread())

    // 监听html发送的prompt('stop', JSON.stringify(param))事件，并使用share共享到变量上，避免多次监听
    // 监听webview事件时，应该主动给html赋予返回值，也就是使用done(返回值)，既可以在pipe里执行，也能在subscribe里执行
    const stop$ = webview.on('stop').pipe(
        take(1),
        // 在pipe里用tap统一处理，则subscribe不需要再执行done
        tap(([param, done]) => done(true)),
        share(),
    )
    stop$.subscribe(([param, done]) => {

        // 给html返回一个true
        log('stop', threads.currentThread())
    })

    // // 监听截图监听器的数量
    interval(1000).pipe(
        // 当stop$发出值时，结束监听流
        takeUntil(stop$)
    ).subscribe(() => {
        toastLog(`监听器数量：${$images.listenerCount('screen_capture')}`)
    })

    let f

    // 监听html发送的prompt('submit')事件
    webview.on('submit').pipe(
        tap(([param, done]) => done()),
        filter(() => f == null)
    ).subscribe(([param, done]) => {

        // 在提交事件里进行一个effect$订阅
        effect$.subscribe(([t, e]) => {

            f = createFloaty({
                logoSize: 30,
                angle: 90,
                items: [
                    {
                        id: 'start',
                        icon: ['ic_play_arrow_black_48dp', 'ic_stop_black_48dp'],
                        color: '#048444',
                        toggleOnClick: false,
                        callback(state) {
                            log('callback', threads.currentThread() === t)
                            // 当icon为数组时，按钮点击后可以切换，state为点击时icon的索引
                            if (state === 0) {
                                task$.next('开始任务')
                            } else {
                                task$.next('结束任务')
                            }

                        }
                    },
                    {
                        id: 'pause',
                        icon: ['ic_pause_black_48dp', 'ic_restaurant_menu_black_48dp'],
                        color: '#048444',
                        toggleOnClick: false,
                        callback(state) {
                            if (state === 0) {
                                pause()
                            } else {
                                resume()
                            }
                        }
                    },
                    {
                        id: 'exit',
                        icon: 'ic_exit_to_app_black_48dp',
                        color: '#E61015',
                        callback() {
                            f.close()
                            f = null
                        }
                    }
                ]
            })

            // task$$接受到一次'完成任务'时，切换悬浮窗第一个按钮
            task$$.pipe(
                filter(v => v === '完成任务')
            ).subscribe((v) => {
                f.items[0].toggleIcon()
            })
        })

    })

})