sap.ui.controller("zcitapp.PRItemDetails", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zcitapp.SEItemDetails
*/
	onInit: function() {
		
		oCore.byId("App--idPRItemDetails--idPRItemDetails_headerTitle").addStyleClass("header_title");

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
			context = oCore.getModel("model").oData.prItems[sPath.split("/")[2]];
		//}
		
				
		var prItemDetailsData = { "prItemDetails" : [] };
		prItemDetailsData.prItemDetails.push({		
			prItemNo:context.prItemNo,
			prNo: context.prNo,
			prItemDesc: context.prItemDesc,
			prItemQty: context.prItemQty,
			prItemValue:context.prItemValue,
			prItemCurrency: context.prItemCurrency,
			prItemDelDate:context.prItemDelDate,

			
		});
		
		//set downlaoded PR details data into model
		if(oCore.getModel("model").oData.prItemDetails != undefined)
		{
			oCore.getModel("model").oData.prItemDetails = [];
		}
		oCore.getModel("model").setData(prItemDetailsData,true);
		
		
		//Fetch All the PR List
		if(serviceFlag == 'X'){
			oCore.byId("App--idPRItemDetails--idPRItemServiceList").setVisible(true);
			oCore.byId("App--idPRItemDetails").getController().fetchPRItemServiceList();
			
		}
		
	},
	
	back:function()
	{
		debugger;

		oEventBus.publish("nav","to",{
			goToPage : "App--idPRDetails",
			data : null					
		});
	},
	
	home:function(){
		debugger;
		
		serviceFlag = null;
		oCore.byId("App--idPRItemDetails--idPRItemServiceList").setVisible(false);
		
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
	
	fetchPRItemServiceList:function(){
		debugger;
		
		busyLoader.open();
		
		var prNum=context.prNo;
		var itemNum=context.prItemNo;
		
		odataModel.read("/PRServiceListSet?$filter=IPurchaseNum eq '"+prNum+"' and IItemNo eq '"+itemNum+"'", null, null, true,
				
				function(oData, oResponse) {
				debugger;
				busyLoader.close();
				
				var prItemServiceData = {prItemServiceList : []};
				
				
				debugger;
				
				for(var i=0;i<oData.results.length;i++){
					var obj=oData.results[i];
					
					prItemServiceData.prItemServiceList.push({
						prNumber:obj.PrNumber,
						itemNo:obj.ItemNo,
						lineNo:obj.LineNo,	
						service: obj.Service,
						shortText: obj.ShortText,
						qty: obj.Quantity,
						unit: obj.Unit,
						gross: obj.Gross,
						deliveryDate: obj.DeliveryDate,
						currency: obj.Currency
						
					});
					
				}
					
				
				//set downlaoded PR details data into model
				if(oCore.getModel("model").oData.prItemServiceList != undefined)
				{
					oCore.getModel("model").oData.prItemServiceList = [];
				}
				oCore.getModel("model").setData(prItemServiceData,true);
				
		},
		
		function(readError) {
			debugger;
			busyLoader.close();
			ErrorFn(readError);

		}); 
		
		
	},

	serviceSelect:function(evt){
    		debugger;
    		var selectedService=null;
    		selectedService=evt.getSource().getBindingContext("model");

    		var servicePath = selectedService.sPath;
    		var serviceData = oCore.getModel("model").oData.prItemServiceList[servicePath.split("/")[2]];

    		oServiceDialog.removeAllContent();
    		oServiceDialog.setTitle(serviceData.shortText);

    		oServiceDialog.addContent(new sap.m.Panel({
    			content:[
                     new sap.m.StandardListItem({
                    	 title: "Line No",
                    	 info: serviceData.lineNo

                     }),
                     new sap.m.StandardListItem({
                    	 title: "Service",
                    	 info: serviceData.service

                     }),
                     new sap.m.StandardListItem({
                    	 title: "Quantity",
                    	 info: serviceData.qty

                     }),
                     new sap.m.StandardListItem({
                    	 title: "Unit",
                    	 info: serviceData.unit

                     }),
                     new sap.m.StandardListItem({
                    	 title: "Net Value",
                    	 info: serviceData.gross

                     }),
                     new sap.m.StandardListItem({
                    	 title: "Currency Info",
                    	 info: serviceData.currency

                     }),
                     new sap.m.StandardListItem({
                    	 title: "Delivery Date",
                    	 info: serviceData.deliveryDate
                     })
    				]
    		}));

    		oServiceDialog.open();
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