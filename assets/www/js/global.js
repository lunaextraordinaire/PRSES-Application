window.onerror = onError;
var startTime = null;
var eneterdUserId;
var enteredPasswored;
var smpAppId;

function onError(msg, url, line) {
    console.log("EventLogging: onError");
    var idx = url.lastIndexOf("/");
    var file = "unknown";
    if (idx > -1) {
        file = url.substring(idx + 1);
    }
    //alert("An error occurred in " + file + " (at line # " + line + "): " + msg);
    console.log("EventLogging: An error occurred in " + file + " (at line # " + line + "): " + msg);
    return false; //suppressErrorAlert;
}

function init() {
    console.log("EventLogging: init");
    if (sap.Logger) {
        sap.Logger.setLogLevel(sap.Logger.ERROR);  //enables the display of error log messages from the Kapsel plugins.
        sap.Logger.debug("Log level set to ERROR");
    }
    sap.Logon.init(logonSuccessCallback, logonErrorCallback, appId, context);
    if (device.platform == "Android") {      //only for Android not supported in iOS
        document.addEventListener("backbutton", backbuttonhandler, false);
    }

}

//Will be used only for Android
function backbuttonhandler(evt) {
    debugger;
    if(oDialog.isOpen()){
        oDialog.close();
    }else if(oServiceDialog.isOpen()){
        oServiceDialog.close();
    }else if(oDialog.isOpen()){
        oDialog.close();
    }else if(oNoAuthDialog.isOpen()){
        oNoAuthDialog.close();
    }else if(oLogoutDialog.isOpen()){
        oLogoutDialog.close();
    }else if(oConfirmDialog.isOpen()){
        oConfirmDialog.close();
    }else if(oPRConfirmDialog.isOpen()){
        oPRConfirmDialog.close();
    }else if(oExitDialog.isOpen()){
        oExitDialog.close();
    }else if(oPushDialog.isOpen()){
        oPushDialog.close();
    }else{
        globalThis.back();
    }
}

function register() {
   console.log("EventLogging: register");
   sap.Logon.init(logonSuccessCallback, logonErrorCallback, appId, context);
}

function logonErrorCallback(error) {
    console.log("EventLogging: logonErrorCallback:  " + JSON.stringify(error));
    if (device.platform == "Android") {  //Not supported on iOS
        navigator.app.exitApp();
    }
}

function unRegister() {
    console.log("EventLogging: unRegister");
    busyLoader.open();
    try {
        sap.Logon.core.deleteRegistration(logonUnregisterSuccessCallback, errorCallback);
    }
    catch (e) {
        alert("problem with unregister");
    }
}

function logonSuccessCallback(result) {
    debugger;
    console.log("EventLogging: logonSuccessCallback " + JSON.stringify(result));
    applicationContext = result;
    startTime = performance.now();
    if (window.localStorage.getItem("isPushRegistered") == "true") {
        initPush();  //faster then calling registerForPush
    }
    else {
        window.localStorage.setItem("isPushRegistered", "false");
        registerForPush();
    }
    eneterdUserId = result.registrationContext.user;
    enteredPasswored = result.registrationContext.password;
    smpAppId = result.applicationConnectionId;

    oCore.byId("App--idLogin").getController().login();
}

function logonUnregisterSuccessCallback(result) {
    console.log("EventLogging: logonUnregisterSuccessCallback");
    window.localStorage.setItem("isPushRegistered", "false");
    //Clear temp stored data
    sesAuth = false;
    prAuth = false;
    someAppAuth = false;
    serviceFlag="";
    oCore.byId("App--idDashboard--idSEVBox").setVisible(false);
    oCore.byId("App--idDashboard--idPRVBox").setVisible(false);
    SECount=null;
    PRCount=null;

    sap.Logon.core.reset();
    busyLoader.close();
}

function errorCallback(e) {
    console.log("EventLogging: errorCallback " + JSON.stringify(e));
    busyLoader.close();
    alert("An error occurred " + JSON.stringify(e));
}

function registerForPush() {
    console.log("EventLogging: registerForPush");
    var nTypes = sap.Push.notificationType.SOUNDS | sap.Push.notificationType.ALERT;
    sap.Push.registerForNotificationTypes(nTypes, pushRegistrationSuccess, pushRegistrationFailure, processNotification, 498618822374 /* optional GCM Sender ID */);
}

function initPush() {
    console.log("EventLogging: initPush");
    sap.Push.initPush(processNotification);
}

function unregisterForPush() {
    console.log("EventLogging: unregisterForPush");
    var nTypes = sap.Push.notificationType.SOUNDS | sap.Push.notificationType.ALERT;
    sap.Push.unregisterForNotificationTypes(pushUnregistrationCallback);
}

function pushRegistrationSuccess(result) {
    console.log("EventLogging: pushRegistrationSuccess" + JSON.stringify(result));
    window.localStorage.setItem("isPushRegistered", "true");
}

function pushRegistrationFailure(errorInfo) {
    console.log("EventLogging: pushRegistrationFailure  " + JSON.stringify(errorInfo));
    alert("Error while registering for Push.  " + JSON.stringify(errorInfo));
}

function pushUnregistrationCallback(result) {
    console.log("EventLogging: pushUnregistration: " + JSON.stringify(result));
    alert("Successfully unregistered for Push: " + JSON.stringify(result));
    window.localStorage.setItem("isPushRegistered", "false");
}

function processNotification(notification) {
    debugger;
    var endTime = performance.now();
    console.log("EventLogging Perf: " + ((endTime - startTime)/1000).toFixed(3) + " seconds from logonSuccess till message received");
    //Send alert to the device
    oPushDialog.removeAllContent();
    oPushDialog.setTitle(notification.title);
    oPushDialog.addContent(new sap.m.Text({
        text:notification.data,
    }).addStyleClass("dialog_message"));
    oPushDialog.open();

    //alert("!!! " + notification.title + " !!!\n\n" + notification.data +"");
    console.log("EventLogging: processNotification: " + JSON.stringify(notification));
    if (sap.Push.setPushFeedbackStatus && notification.additionalData) {  //SP15 new feature
        sap.Push.setPushFeedbackStatus('consumed', notification.additionalData.notificationId, pushFeedbackStatusSuccessCallback, pushFeedbackStatusErrorCallback);
    }
}

function pushFeedbackStatusSuccessCallback(status) {
    console.log("EventLogging: set the push feedback status to consumed");
}

function pushFeedbackStatusErrorCallback(status) {
    console.log("EventLogging: push feedback error: " + JSON.stringify(status));
}

function onLoad() {
    console.log("EventLogging: onLoad");
}

function onBeforeUnload() {
    console.log("EventLogging: onBeforeUnLoad");
}

function onUnload() {
    console.log("EventLogging: onUnload");
}

function onPause() {
    console.log("EventLogging: onPause");
}

function onResume() {
    console.log("EventLogging: onResume");
}

function onSapResumeSuccess() {
    console.log("EventLogging: onSapResumeSuccess");
}

function onSapResumeError(error) {
    console.log("EventLogging: onSapResumeError " + JSON.stringify(error));
}

function onSapLogonSuccess() {
    console.log("EventLogging: onSapLogonSuccess");
}

