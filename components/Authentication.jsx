import React from "react"
import Logo from "./Logo.jsx"
import queryString from "query-string";

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        if (this.checkTrelloTokenDefined()) {
            this.props.BoardApi.authenticate(this.props.onAuthentication)
        }
    }

    checkTrelloTokenDefined() {
        const params = queryString.parse(location.search);
        return localStorage.getItem("trello_token") && localStorage.getItem("trello_token") !== undefined &&
           params.fw !== "g" && params.code === undefined
    }

    handleStartButtonClick() {
        if (this.props.BoardApi.getName() === "Github") {
            this.props.BoardApi.authenticate(null);
        } else {
            this.props.BoardApi.authenticate(this.props.onAuthentication);
        }
    }

    render() {
        return (
            <div id="api_key_div">
                <div className="wrapper__api-key">
                    <div className="centered-logo">
                        <Logo/>
                        <div className="api-key__claim">Prioritize your {this.props.BoardApi.getName() + "'s "}
                            board in just a few steps
                        </div>
                        <button className="continue-to-choices--button button__primary button__text"
                                onClick={() => this.handleStartButtonClick()}>Authorize {this.props.BoardApi.getName()} and
                            let's start!
                        </button>
                        <a href="/landing.html">
                            <div className="button__suggestion">Want to learn more about sortello?</div>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Authentication
