sap.ui.controller("zcitapp.AppDashboard", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zcitapp.AppDashboard
*/
	onInit: function() {
		
		oCore.byId("App--idDashboard--idDashboard_lblApp").addStyleClass("header_title");
		oCore.byId("App--idDashboard--idSECountText").addStyleClass("pending_count");
		oCore.byId("App--idDashboard--idSECountHBox").addStyleClass("pending_count_hbox");
		oCore.byId("App--idDashboard--idPRCountText").addStyleClass("pending_count");
        oCore.byId("App--idDashboard--idPRCountHBox").addStyleClass("pending_count_hbox");

			
		var oView = this.getView();
		oView.addEventDelegate({
			// not added the controller as delegate to avoid controller functions with similar names as the events
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});
	},
	
	
	onBeforeShow:function(evt)
	{
		debugger;

		globalThis = this;
		
		if(sesAuth){
			oCore.byId("App--idDashboard--idSEVBox").setVisible(true);
			oCore.byId("App--idDashboard").getController().getSECount();
		}

		if(prAuth){
        	oCore.byId("App--idDashboard--idPRVBox").setVisible(true);
        	oCore.byId("App--idDashboard").getController().getPRCount();
        }
		
		if(!someAppAuth){
			
			oNoAuthDialog.removeAllContent();
			oNoAuthDialog.addContent(new sap.m.Label({
				text:"Not Authorized for this Application !",
			}).addStyleClass("dialog_message"));
			
			unRegister();
            applicationContext = null;
				
			oNoAuthDialog.open();
			
		}
		
	},
	
	
	logout:function()
	{
		debugger;
		//unRegister();
		oLogoutDialog.open();
	},
	
	
	openSES:function(){
		debugger;
		
		oEventBus.publish("nav","to",{
			goToPage : "App--idSEList",
			data : null					
		});
	},

    openPR:function(){
        debugger;

        oEventBus.publish("nav","to",{
            goToPage : "App--idPRList",
            data : null
        });
    },
	
	
	getSECount: function(){
		busyLoader.open();
		debugger;
		
		odataModel = new sap.ui.model.odata.ODataModel(sesServiceURL, true, userId, password, headers);
		//odataModel.refreshSecurityToken(null, null, false);
		odataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		

		var ps_no=userId;
		
		odataModel.read("/SEListSet/$count?$filter=IUser eq '"+ps_no+"'", null, null, true,
				
				function(oData, oResponse) {
					debugger;
					busyLoader.close();
					SECount=oResponse.body;
					oCore.byId("App--idDashboard--idSECountText").setText(SECount);
				},
			
				function(readError) {
					debugger;
					busyLoader.close();
					SECount=null;
					oCore.byId("App--idDashboard--idSECountText").setText(SECount);
					ErrorFn(readError);
			
				});
	},

	getPRCount: function(){
        busyLoader.open();
        debugger;

        odataModel = new sap.ui.model.odata.ODataModel(prServiceURL, true, userId, password, headers);
        //odataModel.refreshSecurityToken(null, null, false);
        odataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);


        var ps_no=userId;

        odataModel.read("/PRListSet/$count?$filter=IUser eq '"+ps_no+"'", null, null, true,

                function(oData, oResponse) {
                    debugger;
                    busyLoader.close();
                    PRCount=oResponse.body;
                    oCore.byId("App--idDashboard--idPRCountText").setText(PRCount);
                },

                function(readError) {
                    debugger;
                    busyLoader.close();
                    SECount=null;
                    oCore.byId("App--idDashboard--idPRCountText").setText(PRCount);
                    ErrorFn(readError);

                });

    },
	
	refreshDashboard : function(){
		debugger;
		if(sesAuth){
            oCore.byId("App--idDashboard").getController().getSECount();
        }
        if(prAuth){
            oCore.byId("App--idDashboard").getController().getPRCount();
        }
	},

	back:function()
    	{
    		debugger;
    		oExitDialog.open();
    	},

    handleOpen : function (oEvent) {
        debugger;
        var oButton = oEvent.getSource();

        // create action sheet only once
        if (!this._actionSheet) {
            this._actionSheet = sap.ui.xmlfragment(
                "zcitapp.Menu",
                this
            );
            this.getView().addDependent(this._actionSheet);
        }

        this._actionSheet.openBy(oButton);

    },

    actionSelected : function(oEvent){
        debugger;
        if(oEvent.getSource().getText()=="Change Passcode"){
            //alert("change passcode");
            sap.Logon.managePasscode(onsuccess, onerror);
        }
        else if(oEvent.getSource().getText()=="Change Password"){
            //alert("change password");
            sap.Logon.changePassword(onsuccess, onerror);
         }

        else if(oEvent.getSource().getText()=="Logout"){
            //alert("logout");
            oCore.byId("App--idDashboard").getController().logout();
        }
    },





/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zcitapp.AppDashboard
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zcitapp.AppDashboard
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zcitapp.AppDashboard
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
//alert("An error occurred " + JSON.stringify(e));
}