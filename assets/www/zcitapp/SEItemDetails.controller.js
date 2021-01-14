sap.ui.controller("zcitapp.SEItemDetails", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zcitapp.SEItemDetails
*/
	onInit: function() {
		
		oCore.byId("App--idSEItemDetails--idSEItemDetails_headerTitle").addStyleClass("header_title");
		
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
		//if (evt.data.context != undefined){
			var sPath = evt.data.context.sPath;
			context = oCore.getModel("model").oData.seItems[sPath.split("/")[2]];
		//}
		
				
		var seItemDetailsData = { "seItemDetails" : [] };
		seItemDetailsData.seItemDetails.push({
			itemNo:context.itemNo,
			itemNoTrimmed:context.itemNoTrimmed,
			itemText:context.itemText,
			itemQty:context.itemQty,	
			itemUom: context.itemUom,
			itemGrossval: context.itemGrossval,
			itemNetval: context.itemNetval
			
		});
		
		//set downlaoded sedetails data into model
		if(oCore.getModel("model").oData.seItemDetails != undefined)
		{
			oCore.getModel("model").oData.seItemDetails = [];
		}
		oCore.getModel("model").setData(seItemDetailsData,true);
		
		
		
	},
	
	back:function()
	{
		debugger;

		
		oEventBus.publish("nav","to",{
			goToPage : "App--idSEDetails",
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

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zcitapp.SEItemDetails
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zcitapp.SEItemDetails
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zcitapp.SEItemDetails
*/
//	onExit: function() {
//
//	}

});