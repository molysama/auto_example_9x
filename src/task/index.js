
import { cap$, pausable } from '@auto.pro/core'
import { of, Subject } from 'rxjs'
import { catchError, endWith, exhaustMap, filter, share, switchMap, take, throttleTime } from 'rxjs/operators'

/**
 * 如果输入'开始任务'，就进行一轮找色
 * 否则把当前的任务结束，并直接返回输入的值
 */
export const task$ = new Subject()

export const task$$ = task$.pipe(
    switchMap(v => {
        if (v === '开始任务') {
            return cap$.pipe(
                pausable(true, false),
                filter(cap => cap.isRecycled() === false),
                throttleTime(500),
                exhaustMap(cap => {
                    const result = images.findColor(cap, '#f14668')
                    return of(result)
                }),
                catchError(err => of(null)),
                filter(v => v),
                take(5),
                endWith('完成任务'),
            )

        } else {
            return of(v).pipe(
                pausable(true, true)
            )
        }
    }),
    share()
)

task$$.subscribe(toastLog)