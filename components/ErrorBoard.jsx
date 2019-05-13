import React from "react";
import AccessdeniedAnimation from './AccessdeniedAnimation.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

class ErrorBoard extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="no-access-board__container">
                <div className="no-access-message__container">
                    <AccessdeniedAnimation/>
                    <div id="forbidden-div" className="no-access-message__heading">Ooops!</div>
                    <div className="no-access-message__paragraph">{this.props.text}
                        <p>{this.props.message? <a href="../index.html" style={{color:'blue'}}>Learn how to use Sortello!</a>:null}</p>
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

export default ErrorBoard