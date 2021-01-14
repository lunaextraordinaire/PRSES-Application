var appId = "com.lnt.citapp";


var context = {
    "serverHost": "lntappstore.ltindia.com",
    "https": false,
    "serverPort": "80",
    "communicatorId": "REST",
    //for Relay
    "farmId" : "WEB",
    "resourcePath" : "ias_relay_server/client/rs_client.dll",

    "custom": {
        "hiddenFields": ["serverHost","farmId", "resourcePath", "securityConfig", "serverPort", "https"],
        "backgroundImage": "../../../bg.png",
        "copyrightLogo":"../../../lntlogo.png",
        "styleSheet": "../../../custom.css",
        "copyrightMsg": ["© 2017 LARSEN & TOUBRO LIMITED.", "All rights reserved."],
        "hideLogoCopyright" : false
    }
};