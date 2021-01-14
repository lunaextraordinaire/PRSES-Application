sap.ui.controller("zcitapp.SEList", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zcitapp.SEList
*/
	onInit: function() {
		
		
		//oCore.byId("App--idSEList--idSEListPage").addStyleClass("login_layout");
		oCore.byId("App--idSEList--idSEList_headerTitle").addStyleClass("header_title");
		oCore.byId("App--idSEList--idSEList_seCount").addStyleClass("header_title");
		oCore.byId("App--idSEList--idSEList_close").addStyleClass("header_title");
		oCore.byId("App--idSEList--idSEListPage_search").addStyleClass("input_box");
		
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
		oCore.byId("App--idSEList").getController().fetchSEPendingList();
	},
	
	fetchSEPendingList: function(){
		
		busyLoader.open();
		
		odataModel = new sap.ui.model.odata.ODataModel(sesServiceURL, true, userId, password, headers);
		
		//odataModel.refreshSecurityToken(null, null, false);
		
		odataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		
		debugger;
		
		//Read SEList entity set data
		var ps_no=userId;


		odataModel.read("/SEListSet/$count?$filter=IUser eq '"+ps_no+"'", null, null, true,

    		function(oData, oResponse) {
    			debugger;
    			SECount=oResponse.body;
    			oCore.byId("App--idSEList--idSEList_seCount").setText(SECount);
    		},

    		function(readError) {
    			debugger;
    			busyLoader.close();
    			ErrorFn(readError);

    		});

		odataModel.read("/SEListSet?$filter=IUser eq '"+ps_no+"'", null, null, true,
				
			function(oData, oResponse) {
			debugger;
			busyLoader.close();
			
			var seData = {se : []};
			
			debugger;
			for(var i=0;i<oData.results.length;i++){
				var obj=oData.results[i];
				var seNoStr = (obj.Lblni).replace(/^0+/, '');
				seData.se.push({
					seNo:obj.Lblni,
					seNoTrimmed:seNoStr,
					seText:obj.Txz01,
					seDate:obj.Erdat,	
					seValue: obj.Lwert
				});
				
			}
			
			//set downlaoded se data into model
			if(oCore.getModel("model").oData.se != undefined)
			{
				oCore.getModel("model").oData.se = [];
			}
			oCore.getModel("model").setData(seData,true);
			
		},
		
		function(readError) {
			debugger;
			busyLoader.close();
			ErrorFn(readError);

		}); 
		

		
	},
	
	refreshList : function(){
		debugger;
		oCore.byId("App--idSEList").getController().fetchSEPendingList();
	},
	
	
	listSelect:function(evt){
		debugger;

		var selectedItem=null;
        selectedItem=evt.getSource().getBindingContext("model");
                
		oEventBus.publish("nav","to",{
			goToPage : "App--idSEDetails",
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
	
	searchSE : function(){
		debugger;
		var searchValue = sap.ui.getCore().byId("App--idSEList--idSEListPage_search").getValue();
		var filter = new sap.ui.model.Filter("seNo",sap.ui.model.FilterOperator.Contains,searchValue);
		var binding = sap.ui.getCore().byId("App--idSEList--idSEListPage_selist").getBinding("items");
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