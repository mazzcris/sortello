import React from "react";
import AccessdeniedAnimation from './AccessdeniedAnimation.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

class NoAccessBoard extends React.Component {
    render() {
        return (
            <div className="no-access-board__container">
                <div className="no-access-message__container">
                    <AccessdeniedAnimation/>
                    <div id="forbidden-div" className="no-access-message__heading">Ooops!</div>
                    <div className="no-access-message__paragraph">You have no access to this board, please contact
                        board's administrator to gain access.
                    </div>
                </div>
                <div className={"footer footer--fade"}>
                    <Footer/>
                    <Header/>
                </div>
            </div>
        );
    }
}

export default NoAccessBoard