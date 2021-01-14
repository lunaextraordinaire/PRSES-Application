sap.ui.controller("zcitapp.Login", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zcitapp.Login
*/
onInit: function() {
	
	//oCore.byId("App--idLogin--idLoginPage").addStyleClass("login_layout");
	oCore.byId("App--idLogin--idLoginPage_lblApp").addStyleClass("header_title");
	oCore.byId("App--idLogin--idContinue").addStyleClass("login_button");
	oCore.byId("App--idLogin--idChangePassword").addStyleClass("login_button");
	//oCore.byId("App--idLogin--idUsername").addStyleClass("input_box");
	//oCore.byId("App--idLogin--idPassword").addStyleClass("input_box");
	
	
	var oView = this.getView();
	oView.addEventDelegate({
		// not added the controller as delegate to avoid controller functions with similar names as the events
		onBeforeShow : jQuery.proxy(function(evt) {
			this.onBeforeShow(evt);
		}, this)
	});

},
	
	
	login:function()
	{
		debugger;
		busyLoader.open();
		

			var prodUserId = eneterdUserId; //for Production
			userId = (prodUserId).split("\\")[1];//for production

			//userId = eneterdUserId; //for Dev & QA

			password =	enteredPasswored;
            CookieId = smpAppId;
            //window.localStorage.setItem("cookieidcit",CookieId);

			//authHeader = 'Basic ' + btoa(userId+':'+password); //for Dev & QA
			authHeader = 'Basic ' + btoa(prodUserId+':'+password); //For Production


			headers = {
                        "X-Requested-With" : "XMLHttpRequest",
                        "Content-Type" : "application/json",
                        "DataServiceVersion" : "2.0",
                        "X-CSRF-Token" : "Fetch",
                        "Accept" : "application/json,application/atom+xml,application/xml,application/atomsvc+xml",
                        "Authorization":authHeader,
                        "X-SMP-APPCID" : CookieId
                };

			oCore.byId("App--idLogin").getController().successfulLogin();


	},
	
	
	successfulLogin: function(){
		debugger;

		var allRoles;
		var allRolesArray;

		odataModel = new sap.ui.model.odata.ODataModel(serviceURL, true, userId, password, headers);
		//odataModel.refreshSecurityToken(null, null, false);
		odataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		
		odataModel.read("/UserRolesSet('"+userId+"')", null, null, true,
				
				function(oData, oResponse) {
					debugger;
					busyLoader.close();
					allRoles=oData.Roles;
					
					if(allRoles != null){
						allRolesArray = allRoles.split(/\s*,\s*/);
					}
					
					if(jQuery.inArray(SESRoles, allRolesArray) !== -1){
						sesAuth = true;
						someAppAuth = true;
					}

					if(jQuery.inArray(PRRole, allRolesArray) !== -1){
                        prAuth = true;
                        someAppAuth = true;
                    }
					
					oEventBus.publish("nav","to",{
						goToPage : "App--idDashboard",
						data : null					
					});
					
				},
			
				function(readError) {
					debugger;
					busyLoader.close();

					if(readError.response.statusCode==401){
					    oCore.byId("App--idLogin--idMsg").setVisible(false);
					    oCore.byId("App--idLogin--idMsg2").setVisible(false);
                        oCore.byId("App--idLogin--idContinue").setVisible(true);
                        oCore.byId("App--idLogin--idChangePassword").setVisible(true);
					}else{
					    ErrorFn(readError);
					}

				});
		
	},

	continue: function(){
        oCore.byId("App--idLogin").getController().successfulLogin();
	},

	changePassword: function(){
        sap.Logon.changePassword(onsuccess, onerror);
	},
	
	onBeforeShow:function(){

		globalThis = this;

	},
	

	back:function()
    {
        debugger;
        oExitDialog.open();
    },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zcitapp.Login
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zcitapp.Login
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zcitapp.Login
*/
//	onExit: function() {
//
//	}

});

function onsuccess(result){
debugger;
//alert("success");
}

function onerror(error){
debugger;
alert("An error occurred " + JSON.stringify(e));
}