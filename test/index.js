
// toastLog(manager.topActivity.getClassName())
// toastLog(manager.topActivity.toString())
// toastLog(currentActivity())
// waitForPackage()
// waitForPackage(context.getPackageName())
// toastLog(context.getPackageName())

// var manager = context.getSystemService(android.content.Context.ACTIVITY_SERVICE).getRunningTasks(1).get(0)
// toastLog(context.getSystemService(android.content.Context.ACTIVITY_SERVICE).getRunningTasks(1).get(0).topActivity.getClassName())

// toastLog(context.getSystemService(android.content.Context.ACTIVITY_SERVICE).getRunningTasks(1).get(0).topActivity.getClassName())
// typeof activity !== 'undefined' && ui.emitter.on('resume', function () { toastLog('Wow!') })
app.startActivity({
    action: "android.settings.ACCESSIBILITY_SETTINGS"
});
