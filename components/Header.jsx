import React from "react"

class Header extends React.Component {

    handleLogout () {
        localStorage.removeItem('sortelloTrelloDevApiKey');
        localStorage.removeItem('trello_token');
        localStorage.removeItem('token');
        location.reload();
    }

    render () {
        return (
            <div>
                <button className="logout__button--style" onClick={this.handleLogout}>Logout</button>
            </div>
        );
    }
};

export default Header
