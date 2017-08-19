import React from "react"

const Footer = React.createClass({
   
    render: function() {
        return (
			<div className="footer__container">
    			<a className="footer__item footer__link" href="disclaimer.html" target="blank">Disclaimer</a>
    			<div className="footer__item">Proudly supported by <a href="//ideato.it" target="_blank" className="footer__link">ideato</a></div>
			</div>
        );
    }

});

export default Footer