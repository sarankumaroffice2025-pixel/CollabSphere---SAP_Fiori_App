sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
  ],
  (Controller, JSONModel, Fragment, MessageToast) => {
    "use strict";

    return Controller.extend(
      "comcollabspheresettings.controller.ManageCollabSphereSettings",
      {
        onInit() {
          this.onLoadData();
        },

        onLoadData: function () {
          //Department Data
          this.getOwnerComponent().setModel("collabSphereModel");
        },

        // function to expand or collapse the side navigation
        onSideNavPress: function () {
          var oView = this.byId("sideNavigation");
          if (oView.getExpanded()) {
            oView.setExpanded(false);
          } else {
            oView.setExpanded(true);
          }
        },

        onNavigationItemPress: function (oEvent) {
          var oItem = oEvent.getParameter("item").getKey();
          console.log("Selected Item: " + oItem);
        },

        onAddDepartment: async function () {
          if (!this._oDepartmentDialog) {
            this._oDepartmentDialog = await Fragment.load({
              id: "departmentDialogFragment",
              name: "comcollabspheresettings.fragment.Department",
              controller: this,
            });
            this.getView().addDependent(this._oDepartmentDialog);
          }
          this._oDepartmentDialog.open();
        },

        onCreateDepartment: async function (oEvent) {
          var oModel = this.getOwnerComponent().getModel("collabSphereModel");
          var oValue = Fragment.byId(
            "departmentDialogFragment",
            "departmentNameInput",
          ).getValue();
          var oListBinding = oModel.bindList("/collabSphereDepartment");
          var oContext = oListBinding.create({ departmentName: oValue });
          await oContext.created();
          MessageToast.show(`${oValue} department created successfully!`);
        },

        onCancelDepartment: function () {
          this._oDepartmentDialog.close();
        },

        activeStatus: (oStatus) => {
          return oStatus === true ? "Active" : "Inactive";
        },
      },
    );
  },
);
