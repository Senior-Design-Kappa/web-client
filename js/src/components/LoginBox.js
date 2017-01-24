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

	// TODO: make it so that the box closes when you click outside
	componentDidMount() {
		let loginButton = document.getElementById('loginNavButton');
		loginButton.addEventListener("click", () => {
			this.setLoginMenu();
			this.toggleHidden();
		});
		// TODO: there's weird behavior if you click login then register
		// on the outside
		let registerButton = document.getElementById('registerNavButton');
		registerButton.addEventListener("click", () => {
			this.setRegisterMenu();
			this.toggleHidden();
		});

		this.loginMenuButton.addEventListener("click", () => {
			this.setLoginMenu();
		});
		this.registerMenuButton.addEventListener("click", () => {
			this.setRegisterMenu();
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

	toggleHidden() {
		this.setState({
			isHidden: !this.state.isHidden,
		});
	}

	render() {
		let classNames = "login-box " + 
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
		);
	}
}

module.exports = LoginBox;
