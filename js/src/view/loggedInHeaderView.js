let JsCookie = require("js-cookie");
let $ = require("lib/jquery-3.1.1.min.js");

$(() => {
	let logoutButton = document.getElementById('logoutNavButton');
	logoutButton.addEventListener("click", () => {
		JsCookie.remove("JWT_TOKEN");
		window.location.replace("/");
	});
});
