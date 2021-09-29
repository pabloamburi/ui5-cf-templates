/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"worklist/template/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});