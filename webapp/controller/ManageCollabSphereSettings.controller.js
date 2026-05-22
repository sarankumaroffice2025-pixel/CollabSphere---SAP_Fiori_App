sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  (Controller, JSONModel, Fragment, MessageToast, MessageBox) => {
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

        onCreateDepartment: async function () {
          var oModel = this.getOwnerComponent().getModel("collabSphereModel");

          var oControl = Fragment.byId(
            "departmentDialogFragment",
            "departmentNameInput",
          );
          var departmentName = oControl.getValue();
          if (!departmentName) {
            MessageToast.show("Please enter a department name.");
            return;
          }
          // Directly create a new entry in the OData model using EnitySet name and properties
          // var olistBiding = oModel.bindList("/Department");
          // var oContext = olistBiding.create({
          //   departmentName: departmentName,
          //   activeStatus: true,
          // });

          // await oContext.created();

          // Create the Record usig the ODataModel Action and pass the required parameters
          try {
            var oAction = await oModel.bindContext("/createDepartment(...)");
            oAction.setParameter("data", {
              departmentName: departmentName,
            });
            var oResult = await oAction.execute();
            var oResponse = oAction.getBoundContext().getObject();
            console.log("Response from Action: ", oResponse);
            MessageBox.success(
              `${departmentName} Department created successfully.`,
            );
            oModel.refresh(); // Refresh the model to reflect the new department in the list
          } catch (error) {
            console.error("Error creating department: ", error);
            MessageBox.error(
              `Error creating department: ${error.message || error}`,
            );
          }

          this._oDepartmentDialog.close();
        },

        onCancelDepartment: function () {
          this._oDepartmentDialog.close();
        },

        onDeleteDepartment: function (oEvent) {
          var oItem = oEvent.getSource().getBindingContext("collabSphereModel");
          MessageBox.confirm(
            `Are you sure you want to delete ${oItem.getProperty("departmentName")} department`,
            {
              title: "Confirm Deletion",
              actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
              onClose: async function (sAction) {
                try {
                  if (sAction === MessageBox.Action.OK) {
                    await oItem.delete("$auto");
                    MessageBox.success(`Department deleted successfully.`);
                  }
                } catch (error) {
                  console.error("Error deleting department: ", error);
                  MessageBox.error(
                    `Error deleting department: ${error.message || error}`,
                  );
                }
              },
            },
          );
        },
        onEditDepartment: function (oEvent) {
          var oItem = oEvent.getSource().getBindingContext("collabSphereModel");
          var oModel = this.getOwnerComponent().getModel("collabSphereModel");
          var oAction = oModel.bindContext("/updateDepartment(...)");
          MessageBox.confirm(
            `Do you want to edit ${oItem.getProperty("departmentName")} department?`,
            {
              title: "Edit Department",
              actios: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
              onClose: async function (sAction) {
                if (sAction === MessageBox.Action.OK) {
                  oAction.setParameter("data", {
                    departmentId: oItem.getProperty("ID"),
                    departmentName: oItem.getProperty("departmentName"),
                    activeStatus: oItem.getProperty("activeStatus"),
                  });
                  await oAction.execute();
                  MessageBox.success(`Department updated successfully.`);
                  oModel.refresh();
                }
              },
            },
          );
        },

        activeStatus: (oStatus) => {
          if (oStatus) {
            return "Active";
          }
          return "Inactive";
        },
      },
    );
  },
);
