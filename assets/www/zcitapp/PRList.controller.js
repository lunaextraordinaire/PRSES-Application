sap.ui.controller("zcitapp.PRList", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zcitapp.SEList
*/
	onInit: function() {
		
		oCore.byId("App--idPRList--idPRList_headerTitle").addStyleClass("header_title");
		oCore.byId("App--idPRList--idPRList_prCount").addStyleClass("header_title");
		oCore.byId("App--idPRList--idPRList_close").addStyleClass("header_title");
		oCore.byId("App--idPRList--idPRListPage_search").addStyleClass("input_box");
		
		debugger;
		
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
		oCore.byId("App--idPRList").getController().fetchPRPendingList();
	},
	
	fetchPRPendingList: function(){
		
		busyLoader.open();
		
		odataModel = new sap.ui.model.odata.ODataModel(prServiceURL, true, userId, password, headers);
		
		//odataModel.refreshSecurityToken(null, null, false);
		
		odataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		
		debugger;
		
		//Read PRList entity set data
		var ps_no=userId;
		
		odataModel.read("/PRListSet/$count?$filter=IUser eq '"+ps_no+"'", null, null, true,
				
				function(oData, oResponse) {
					debugger;
					PRCount=oResponse.body;
					oCore.byId("App--idPRList--idPRList_prCount").setText(PRCount);
				},
			
				function(readError) {
					debugger;
					busyLoader.close();
					ErrorFn(readError);
			
				}); 
		
		
		odataModel.read("/PRListSet?$filter=IUser eq '"+ps_no+"'", null, null, true,
				
			function(oData, oResponse) {
			debugger;
			busyLoader.close();
			
			var prData = {pr : []};
			
			debugger;
			for(var i=0;i<oData.results.length;i++){
				var obj=oData.results[i];
				prData.pr.push({
					prNo:obj.PreqNo,
					prValue: obj.EValue,
					prCurrency: obj.ECurrency,
					prCreatedName: obj.ECreatedName,
                    prCostCenter: obj.Kostl,
                    prKText: obj.Ktext
				});
				
			}
			
			//set downlaoded PR data into model
			if(oCore.getModel("model").oData.pr != undefined)
			{
				oCore.getModel("model").oData.pr = [];
			}
			oCore.getModel("model").setData(prData,true);
			
		},
		
		function(readError) {
			debugger;
			busyLoader.close();
			ErrorFn(readError);

		}); 
		

		
	},
	
	refreshList : function(){
		debugger;
		oCore.byId("App--idPRList").getController().fetchPRPendingList();
	},
	
	
	listSelect:function(evt){
		debugger;

		var selectedItem=null;
        selectedItem=evt.getSource().getBindingContext("model");
                
		oEventBus.publish("nav","to",{
			goToPage : "App--idPRDetails",
			data:{
				context:selectedItem
			}					
		});
	},
	
	back:function()
	{
		debugger;
		oEventBus.publish("nav","to",{
			goToPage : "App--idDashboard",
			data : null					
		});
	},
	
	home:function(){
		debugger;
		oEventBus.publish("nav","to",{
			goToPage : "App--idDashboard",
			data : null					
		});
	},
	
	logout:function()
	{
		debugger;
		oLogoutDialog.open();
	},
	
	searchPR : function(){
		debugger;
		var searchValue = sap.ui.getCore().byId("App--idPRList--idPRListPage_search").getValue();
		var filter = new sap.ui.model.Filter("prNo",sap.ui.model.FilterOperator.Contains,searchValue);
		var binding = sap.ui.getCore().byId("App--idPRList--idPRListPage_prlist").getBinding("items");
		binding.filter([filter]);
		binding.refresh(true);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zcitapp.SEList
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zcitapp.SEList
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zcitapp.SEList
*/
//	onExit: function() {
//
//	}

});