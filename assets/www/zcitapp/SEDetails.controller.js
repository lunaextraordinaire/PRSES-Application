sap.ui.controller("zcitapp.SEDetails", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zcitapp.SEDetails
*/
	onInit: function() {
		
		oCore.byId("App--idSEDetails--idSEDetails_headerTitle").addStyleClass("header_title");
		oCore.byId("App--idSEDetails--idPO_DetailPage_iconTabBar").setSelectedKey("info");
		
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
		var obj= oCore.byId("App--idSEDetails--idPO_DetailPage_footerBtn");
		
		if (evt.data.context != undefined){
			var sPath = evt.data.context.sPath;
			context = oCore.getModel("model").oData.se[sPath.split("/")[2]];
			selectedSEContext = context;
		

		oCore.byId("App--idSEList--idSEListPage_search").setValue("");
		
		oCore.byId("App--idSEDetails").getController().fetchSEDetails();
		oCore.byId("App--idSEDetails").getController().fetchSEHeaderText();
		
		var binding = sap.ui.getCore().byId("App--idSEList--idSEListPage_selist").getBinding("items");
		var filter = new sap.ui.model.Filter("seNo", sap.ui.model.FilterOperator.Contains, "");
		binding.filter([filter]);
		
		}

	},
	
	
	fetchSEDetails : function(){
		debugger;
		
		busyLoader.open();
		
		var selectedSENo = selectedSEContext.seNo;
		
		odataModel.read("/SEDetailsSet('"+selectedSENo+"')?$expand=Nav_SEItemList", null, null, true,
				
				function(oData, oResponse) {
				debugger;
				busyLoader.close();
				
				var seDetailsData = {seDetails : []};
				var seNoStr = (oData.SeNo).replace(/^0+/, '');
				debugger;
					var seDate=toDateString(oData.SeDate);
					var workComStDate=toDateString(oData.WorkComStdate);
					var workComEndDate=toDateString(oData.WorkComEnddate);
					seDetailsData.seDetails.push({
						seNo:oData.SeNo,
						seNoTrimmed:seNoStr,
						seDesc:oData.SeDesc,
						seDate:seDate,	
						seCreator: oData.SeCreator,
						seValue: oData.SeValue,
						poValue: oData.PoValue,
						seVendor: oData.Vendor,
						poNo: oData.Pono,
						invoiceNo: oData.Invoiceno,
						seWorkComStDate: workComStDate,
						seWorkComEndDate: workComEndDate,
						
					});
					
			
				
				//set downlaoded sedetails data into model
				if(oCore.getModel("model").oData.seDetails != undefined)
				{
					oCore.getModel("model").oData.seDetails = [];
				}
				oCore.getModel("model").setData(seDetailsData,true);
				
				//Fetch SE Item List
				var seItemsData = {seItems : []};
				
				debugger;
				for(var i=0;i<oData.Nav_SEItemList.results.length;i++){
					var obj=oData.Nav_SEItemList.results[i];
					var itemNoStr = (obj.Itemno).replace(/^0+/, '');
					seItemsData.seItems.push({
						itemNo:obj.Itemno,
						itemNoTrimmed:itemNoStr,
						itemText:obj.Shorttext,
						itemQty:obj.Qty,	
						itemUom: obj.Uom,
						itemGrossval: obj.Grossval,
						itemNetval: obj.Netval
					});
					
				}
				
				//set downlaoded seitem data into model
				if(oCore.getModel("model").oData.seItems != undefined)
				{
					oCore.getModel("model").oData.seItems = [];
				}
				oCore.getModel("model").setData(seItemsData,true);
				
				
				
				
			},
			
			function(readError) {
				debugger;
				busyLoader.close();
				ErrorFn(readError);

			}); 
		
	},

	fetchSEHeaderText : function(){
        debugger;
        busyLoader.open();

        var selectedSENo = selectedSEContext.seNo;

        osesheaderdataModel = new sap.ui.model.odata.ODataModel(sesheaderServiceURL, true, userId, password, headers);
        //odataModel.refreshSecurityToken(null, null, false);
        osesheaderdataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

        osesheaderdataModel.read("/SESHeaderTextSet('"+selectedSENo+"')", null, null, true,

                function(oData, oResponse) {
                debugger;
                busyLoader.close();

                var seHeaderTextData = {seHeaderText : []};

                var setSEHeaderText=oData.EText1 + oData.EText2 + oData.EText3 + oData.EText4 + oData.EText5 + oData.EText6 + oData.EText7 + oData.EText8 + oData.EText9 + oData.EText10 + oData.EText11 + oData.EText12 + oData.EText13 + oData.EText14 + oData.EText15 ;

                if(setSEHeaderText == "" || setSEHeaderText == null){
                    setSEHeaderText = "<No Available Text>";

                    //setPrHeaderText = "Similar to onAfterRendering, but this hook is \n invoked before the controller's \n View is re-rendered NOT before the first rendering is used for that one memberOf zcitapp.SEDetails";
                }


                seHeaderTextData.seHeaderText.push({
                    sesHeaderText: setSEHeaderText
                });

                //set downlaoded PR details data into model
                if(oCore.getModel("model").oData.seHeaderText != undefined)
                {
                    oCore.getModel("model").oData.seHeaderText = [];
                }
                oCore.getModel("model").setData(seHeaderTextData,true);

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

		
		oEventBus.publish("nav","to",{
			goToPage : "App--idSEList",
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
	
	listSelect:function(evt)
	{
		debugger;		
		var oEventBus = new oCore.getEventBus();
		oEventBus.publish("nav","to",{
			goToPage : "App--idSEItemDetails",
			data: {

				context:evt.getSource().getBindingContext("model")

			}
		});
	},
	
	confirmRelease : function(){
		debugger;
		
		busyLoader.open();
		
		var selectedSENo = selectedSEContext.seNo;
		var selectedSENoTrimmed = selectedSEContext.seNoTrimmed;
		
		odataModel.read("/SEApproveSet('"+selectedSENo+"')", null, null, true,
				
				function(oData, oResponse) {
				debugger;
				busyLoader.close();
				
				oDialog.removeAllContent();
				oDialog.addContent(new sap.m.Label({
					text:"SE "+selectedSENoTrimmed+" successfully Released!!",
				}).addStyleClass("dialog_message"));
				oDialog.open();
				oCore.byId("App--idSEDetails").getController().back();
							
		},
			
		function(readError) {
			debugger;
			busyLoader.close();
			ErrorFn(readError);

		}); 
		
	},
	
	release : function(){
		
		oConfirmDialog.removeAllContent();
		oConfirmDialog.addContent(new sap.m.Label({
			text:"Do you really want to Release Service Entry?",
		}).addStyleClass("dialog_message"));
		oConfirmDialog.open();
		
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