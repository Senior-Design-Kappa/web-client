let JsCookie = require("js-cookie");
let React = require("react");
let $ = require("lib/jquery-3.1.1.min.js");

class LoginMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errorMessage: "",
		};
	}

	componentDidMount() {
		this.loginButton.addEventListener("click", () => {
			$.ajax({
				data: {
					username: this.username.value,
					password: this.password.value,
				},
				error: (data) => {
					this.setState({
						errorMessage: "Login failed!",
					});
				},
				success: (data) => {
					let reply = JSON.parse(data);
					JsCookie.set("JWT_TOKEN", reply.token);
					window.location.replace("/");
				},
				url: "/auth/login",
			});
		});
	}

	render() {
		return (
			<div>
				<div className="login-content-wrapper">
					<div className="login-input-wrapper">
						<input ref={(f) => {this.username = f;}} type="text" placeholder="Username"></input>
					</div>
					<div className="login-input-wrapper">
						<input ref={(f) => {this.password = f;}} type="password" placeholder="Password"></input>
					</div>
					<div className="login-input-wrapper">
						<div className="login-error-message">
							{this.state.errorMessage}
						</div>
					</div>
					<div className="login-input-wrapper">
						<button ref={(b) => {this.loginButton = b;}}>Log In</button>
					</div>
				</div>
			</div>
		);
	}
}

module.exports = LoginMenu;
