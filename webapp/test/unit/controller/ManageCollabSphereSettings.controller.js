/*global QUnit*/

sap.ui.define([
	"comcollabspheresettings/controller/ManageCollabSphereSettings.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ManageCollabSphereSettings Controller");

	QUnit.test("I should test the ManageCollabSphereSettings controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
