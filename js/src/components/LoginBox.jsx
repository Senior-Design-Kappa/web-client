let React = require("react");
let $ = require("lib/jquery-3.1.1.min.js");

let LoginMenu = require("./LoginMenu");
let RegisterMenu = require("./RegisterMenu");

class LoginBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isHidden: true,
			menu: "login",
		};
	}

	componentDidMount() {
		// Buttons on navbar
		let loginButton = document.getElementById('loginNavButton');
		loginButton.addEventListener("click", () => {
			this.setLoginMenu();
			this.showMenu();
		});
		let registerButton = document.getElementById('registerNavButton');
		registerButton.addEventListener("click", () => {
			this.setRegisterMenu();
			this.showMenu();
		});

		// Buttons for navigation on top of menu
		this.loginMenuButton.addEventListener("click", () => {
			this.setLoginMenu();
		});
		this.registerMenuButton.addEventListener("click", () => {
			this.setRegisterMenu();
		});

		// Close overlay
		this.overlay.addEventListener("click", () => {
			this.hideMenu();
		});
		window.addEventListener("keydown", (e) => {
			if (e.keyCode === 27) {
				this.hideMenu();
			}
		});
	}

	setLoginMenu() {
		this.setState({
			menu: "login",
		});
	}

	setRegisterMenu() {
		this.setState({
			menu: "register",
		});
	}

	hideMenu() {
		this.setState({
			isHidden: true,
		});
	}

	showMenu() {
		this.setState({
			isHidden: false,
		});
	}

	toggleHidden() {
		this.setState({
			isHidden: !this.state.isHidden,
		});
	}

	render() {
		let classNames = "login-box " + 
			((this.state.isHidden) ? "login-hidden" : "");
		let overlayClassNames = "login-overlay " +
			((this.state.isHidden) ? "login-hidden" : "");
		var loginClassNames = "login-title-button";
		var registerClassNames = "login-title-button";
		var menuContents = null;
		if (this.state.menu === "login") {
			loginClassNames += " login-title-selected";
			menuContents = <LoginMenu />;
		} else if (this.state.menu === "register") {
			registerClassNames += " login-title-selected";
			menuContents = <RegisterMenu />;
		}
		return (
			<div>
				<div ref={(l) => {this.loginBox = l;}} className={classNames}>
					<div className="login-title">
						<div ref={(b) => {this.loginMenuButton = b;}} className={loginClassNames}>
							<div className="login-title-flex">
								LOG IN
							</div>
						</div>
						<div ref={(b) => {this.registerMenuButton = b;}} className={registerClassNames}>
							<div className="login-title-flex">
								REGISTER
							</div>
						</div>
					</div>
					<div>
						{menuContents}
					</div>
				</div>
				<div ref={(o) => {this.overlay = o;}} className={overlayClassNames}>
				</div>
			</div>
		);
	}
}

module.exports = LoginBox;
