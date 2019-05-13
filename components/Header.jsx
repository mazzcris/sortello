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
        <div className="logout__button">
          <button className="logout__button--style" onClick={this.handleLogout}>Logout</button>
        </div>
      </div>
    );
  }
}

export default Header
