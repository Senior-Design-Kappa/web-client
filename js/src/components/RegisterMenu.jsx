let React = require("react");

class RegisterMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errorMessage: "",
		};
	}

	componentDidMount() {
		this.registerButton.addEventListener("click", () => {
			$.ajax({
				data: {
					username: this.username.value,
					password: this.password.value,
					email: this.email.value,
				},
				error: (data) => {
					this.setState({
						errorMessage: "Registration failed!",
					});
				},
				success: (data) => {
					window.location.replace("/?showLogin=1");
				},
				url: "/auth/register",
			});
		});
	}

	render() {
		return (
			<div>
				<div className="login-content-wrapper">
					<div className="login-input-wrapper">
						<input ref={(f) => {this.email = f;}} type="text" placeholder="Email Address"></input>
					</div>
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
						<button ref={(b) => {this.registerButton = b;}}>Register</button>
					</div>
				</div>
			</div>
		);
	}
}

module.exports = RegisterMenu;
