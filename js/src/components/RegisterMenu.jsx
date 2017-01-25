let React = require("react");

class RegisterMenu extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div className="login-content-wrapper">
					<div className="login-input-wrapper">
						<input type="text" placeholder="Email Address"></input>
					</div>
					<div className="login-input-wrapper">
						<input type="text" placeholder="Username"></input>
					</div>
					<div className="login-input-wrapper">
						<input type="password" placeholder="Password"></input>
					</div>
					<div className="login-input-wrapper">
						<button>Register</button>
					</div>
				</div>
			</div>
		);
	}
}

module.exports = RegisterMenu;
