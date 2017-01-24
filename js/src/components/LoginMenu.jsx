let React = require("react");

// TODO: link up everything to the backend
class LoginMenu extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div className="login-content-wrapper">
					<div className="login-input-wrapper">
						<input type="text" placeholder="Username"></input>
					</div>
					<div className="login-input-wrapper">
						<input type="password" placeholder="Password"></input>
					</div>
					<div className="login-input-wrapper">
						<button>Log In</button>
					</div>
				</div>
			</div>
		);
	}
}

module.exports = LoginMenu;
