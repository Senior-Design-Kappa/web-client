let $ = require("lib/jquery-3.1.1.min.js");
let React = require("react");
let ReactDOM = require("react-dom");
let LoginBox = require("../components/LoginBox");

$(() => {
	let loginPopup = document.getElementById('loginPopup');
	ReactDOM.render(
		<LoginBox />,
		loginPopup
	);
});
