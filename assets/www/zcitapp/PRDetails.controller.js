sap.ui.controller("zcitapp.PRDetails", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zcitapp.SEDetails
*/
	onInit: function() {
		
		oCore.byId("App--idPRDetails--idPRDetails_headerTitle").addStyleClass("header_title");
		oCore.byId("App--idPRDetails--idPR_DetailPage_iconTabBar").setSelectedKey("info");
		
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

		var obj= oCore.byId("App--idPRDetails--idPR_DetailPage_footerBtn");

		if (evt.data.context != undefined){
			var sPath = evt.data.context.sPath;
			context = oCore.getModel("model").oData.pr[sPath.split("/")[2]];
			selectedPRContext = context;

		oCore.byId("App--idPRList--idPRListPage_search").setValue("");
		
		oCore.byId("App--idPRDetails").getController().fetchPRDetails();
		oCore.byId("App--idPRDetails").getController().fetchPRHeaderText();
		
		var binding = sap.ui.getCore().byId("App--idPRList--idPRListPage_prlist").getBinding("items");
		var filter = new sap.ui.model.Filter("prNo", sap.ui.model.FilterOperator.Contains, "");
		binding.filter([filter]);
		
		}

	},
	
	
	fetchPRDetails : function(){
		debugger;
		
		busyLoader.open();
		
		var selectedPRNo = selectedPRContext.prNo;
		var prCreatedName = selectedPRContext.prCreatedName;
		var prValue = selectedPRContext.prValue;
		var prCurrency = selectedPRContext.prCurrency;
		var prCostCenter = selectedPRContext.prCostCenter;
        var prKText = selectedPRContext.prKText;
		
		odataModel.read("/PRDetailsSet('"+selectedPRNo+"')?$expand=Nav_PRItemList", null, null, true,
				
				function(oData, oResponse) {
				debugger;
				busyLoader.close();
				
				var prDetailsData = {prDetails : []};
				debugger;
				serviceFlag = oData.EServiceFlag;
					prDetailsData.prDetails.push({
						prNo:oData.EPrNumber,
						prDate:oData.ECreatedDate,	
						prCreator: prCreatedName,
						prValue: prValue,
						prCurrency: prCurrency,
						prDocType: oData.EDocType,
						prDocTypeText: oData.EDocTypeText,
						prItemCatText: oData.EItmCatDesc,
						prPlant: oData.EPlant,
						prServiceFlag: oData.EServiceFlag,
						prCostCenter: prCostCenter,
                        prReviewedBy: oData.EPrevapp,
                        prKText: prKText
						
					});
					
			
				
				//set downlaoded PR details data into model
				if(oCore.getModel("model").oData.prDetails != undefined)
				{
					oCore.getModel("model").oData.prDetails = [];
				}
				oCore.getModel("model").setData(prDetailsData,true);
				
				//Fetch PR Item List
				var prItemsData = {prItems : []};
				
				debugger;
				for(var i=0;i<oData.Nav_PRItemList.results.length;i++){
					var obj=oData.Nav_PRItemList.results[i];
					prItemsData.prItems.push({
						prItemNo:obj.EItemNumber,
						prNo: obj.EPrNumber,
						prItemDesc: obj.EItemDescription,
						prItemQty: obj.EItemQty,
						prItemValue:obj.EValue,
						prItemCurrency: obj.ECurrency,
						prItemDelDate:obj.EDelivDate
						
					});
					
				}
				
				//set downlaoded PR item data into model
				if(oCore.getModel("model").oData.prItems != undefined)
				{
					oCore.getModel("model").oData.prItems = [];
				}
				oCore.getModel("model").setData(prItemsData,true);
		
				
			},
			
			function(readError) {
				debugger;
				busyLoader.close();
				ErrorFn(readError);

			}); 
		
	},

	fetchPRHeaderText : function(){
    		debugger;
    		busyLoader.open();

    		var selectedPRNo = selectedPRContext.prNo;

    		odataModel.read("/PRHeaderTextSet('"+selectedPRNo+"')", null, null, true,

    				function(oData, oResponse) {
    				debugger;
    				busyLoader.close();

    				var prHeaderTextData = {prHeaderText : []};

    				var setPrHeaderText=oData.EText1 + oData.EText2 + oData.EText3 + oData.EText4 + oData.EText5 + oData.EText6 + oData.EText7 + oData.EText8 + oData.EText9 + oData.EText10 + oData.EText11 + oData.EText12 + oData.EText13 + oData.EText14 + oData.EText15 ;

                        if(setPrHeaderText == "" || setPrHeaderText == null){
                            setPrHeaderText = "<No Available Text>";
                        }

    				prHeaderTextData.prHeaderText.push({
    					prHeaderText: setPrHeaderText
    				});

    				//set downlaoded PR details data into model
    				if(oCore.getModel("model").oData.prHeaderText != undefined)
    				{
    					oCore.getModel("model").oData.prHeaderText = [];
    				}
    				oCore.getModel("model").setData(prHeaderTextData,true);

    		},

    		function(readError) {
    			debugger;
    			busyLoader.close();
    			ErrorFn(readError);

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
* @memberOf zcitapp.SEDetails
*/
//	onBeforeRendering: function() {
//
//	},
	
	back:function()
	{
		debugger;

		serviceFlag = "";
        oCore.byId("App--idPRItemDetails--idPRItemServiceList").setVisible(false);

		oEventBus.publish("nav","to",{
			goToPage : "App--idPRList",
			data : null					
		});
	},
	
	home:function(){
		debugger;

		serviceFlag = "";
        oCore.byId("App--idPRItemDetails--idPRItemServiceList").setVisible(false);

		oEventBus.publish("nav","to",{
			goToPage : "App--idDashboard",
			data : null					
		});
	},
	
	listSelect:function(evt)
	{
		debugger;		
		var oEventBus = new oCore.getEventBus();
		oEventBus.publish("nav","to",{
			goToPage : "App--idPRItemDetails",
			data: {
				context:evt.getSource().getBindingContext("model")
			}
		});
	},
	
	confirmRelease : function(){
		debugger;
		
		busyLoader.open();
		
		var selectedPRNo = selectedPRContext.prNo;
		
		
		odataModel.read("/PRReleaseSet('"+selectedPRNo+"')", null, null, true,
				function(oData, oResponse) {
				debugger;
				busyLoader.close();
				
				oDialog.removeAllContent();
				oDialog.addContent(new sap.m.Label({
					text:"PR "+selectedPRNo+" successfully Released!!",
				}).addStyleClass("dialog_message"));
				oDialog.open();
				oCore.byId("App--idPRDetails").getController().back();
		},
			
		function(readError) {
			debugger;
			busyLoader.close();
			ErrorFn(readError);
		}); 
		
	},
	
	release : function(){
		oPRConfirmDialog.removeAllContent();
		oPRConfirmDialog.addContent(new sap.m.Label({
			text:"Do you really want to Release PR?",
		}).addStyleClass("dialog_message"));
		oPRConfirmDialog.open();	
	},
			
	

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zcitapp.SEDetails
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zcitapp.SEDetails
*/
//	onExit: function() {
//
//	}

});