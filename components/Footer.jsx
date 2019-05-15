import React from "react"

class Footer extends React.Component {

  render () {
    return (
      <div className="footer__container">
        <div className="footer__item">Proudly supported by <a href="//ideato.it" target="_blank" className="footer__link">ideato</a></div>
        <a className="footer__item footer__link" href="policy.html" target="blank">Disclaimer</a>

      </div>
    );
  }

};

export default Footer
