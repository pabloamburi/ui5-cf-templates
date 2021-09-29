/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"worklist/template/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});