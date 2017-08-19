import React from "react"




var LOCAL_STORAGE_KEY = "sortelloTrelloDevApiKey";

const ApiKey = React.createClass({
  componentDidMount: function () {
    if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
      this.authenticateTrello(localStorage.getItem(LOCAL_STORAGE_KEY));
    }

    if (this.apiKeyIsHardCoded()) {
      localStorage.setItem(LOCAL_STORAGE_KEY, trelloApiKey);
    }

    this.props.centerContent();
  },
  componentDidUpdate(){
    this.props.centerContent();
  },
  apiKeyIsHardCoded: function () {
    try {
      if (trelloApiKey) {
        return true;
      }
      return false;
    } catch (e) {
      return false
    }
  },
  saveAPIKey: function () {
    localStorage.setItem(LOCAL_STORAGE_KEY, this.apiKey.value);
    this.authenticateTrello(this.apiKey.value);
  },
  handleButtonClick: function () {
    this.saveAPIKey()
  },
  handleStartButtonClick: function () {
    this.authenticateTrello(localStorage.getItem(LOCAL_STORAGE_KEY));
  },
  authenticateTrello: function (apiKey) {
    var that = this;
    this.props.Trello.setKey(apiKey);
    this.props.Trello.authorize({
      type: 'popup',
      name: 'Sortello',
      scope: {
        read: 'true',
        write: 'true'
      },
      expiration: 'never',
      success: that.authenticationSuccess,
      error: that.authenticationFailure
    });
  },
  authenticationSuccess: function () {
    this.props.onAuthentication();
  },
  authenticationFailure: function () {
    console.log("Failed authentication");
  },
  getContent: function () {
    if (this.apiKeyIsHardCoded()) {
      return ( <div>
        <button className="continue-to-choices--button button__primary button__text" onClick={this.handleStartButtonClick}>Authorize Sortello and
          let's start!
        </button>
        <a href="/landing-page.html"><div className="button__suggestion">You want to learn more about sortello?</div></a>
      </div>);
    }

    return (
      <div className="container__api-key-input">
        <input type="text" id="api_key" className={"input__api-key"} ref={(apiKey) => this.apiKey = apiKey}
                 placeholder="Please insert your api key on this field"/>
        <div className="button__text">
          <button className="button__primary" id="check_api_key" onClick={this.handleButtonClick}>Continue
          </button>
        </div>
        <a href="https://trello.com/app-key" target="_blank">
          <div className={"button__suggestion"}>Click here to get your API key</div>
        </a>
      </div>
    );
  },
  render: function () {
    return (
        <div id="api_key_div">
          <div className="wrapper__api-key">

            <div className="centered-logo">
              {this.logo()}
              <div className="api-key__claim">Prioritize your Trello's board in just a few steps</div>
            </div>
            {this.getContent()}

          </div>
        </div>
    )
  }
  ,
  logo: function () {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="150px" height="150px"
        >

          <path className="st0" d="M15.9,118.6c0.7-0.7,1.6-0.6,2.7,0.3c0.8,0.7,2,1.1,3.3,1.1c1.8,0,2.6-0.7,2.6-1.7c0-0.7-0.5-1.2-2-1.6
      					l-1.9-0.5c-3.3-1-5.1-2.5-5.1-5.3c0-3,2.5-5,6.1-5c2.1,0,3.7,0.5,5,1.6c1,0.7,0.9,1.9,0.2,2.7c-0.7,0.7-1.6,0.7-2.7-0.1
      					c-0.8-0.6-1.7-0.8-2.7-0.8c-1.4,0-2.3,0.7-2.3,1.6c0,0.8,0.5,1.3,1.6,1.6l2.3,0.6c3.4,0.8,5.1,2.5,5.1,5.2c0,3-2.4,5.2-6.6,5.2
      					c-2.2,0-4.1-0.6-5.6-2C15.1,120.4,15.1,119.2,15.9,118.6z"/>
          <path className="st0" d="M46,108.3c1.7,1.7,2.5,3.7,2.5,6.2c0,2.5-0.9,4.6-2.5,6.2c-1.7,1.7-3.7,2.5-6.1,2.5s-4.5-0.8-6.1-2.5
      					s-2.5-3.7-2.5-6.2c0-2.5,0.8-4.6,2.5-6.2s3.7-2.5,6.1-2.5S44.4,106.6,46,108.3z M43.3,118.3c0.9-1,1.3-2.2,1.3-3.7
      					c0-1.5-0.4-2.8-1.3-3.7c-0.8-1-2-1.5-3.3-1.5c-2.7,0-4.7,2.2-4.7,5.2s1.9,5.2,4.7,5.2C41.3,119.7,42.4,119.2,43.3,118.3z"/>
          <path className="st0" d="M61.7,109.7c-2.9,0-4.3,2.2-4.3,6.5v4.8c0.2,2.8-4.1,2.8-3.9,0v-12.8c-0.2-2.8,4-2.7,3.8-0.1
      					c1.1-1.4,2.5-2,4.4-2c0.5,0,1,0.1,1.5,0.2c1,0.2,1.5,0.8,1.5,1.7c0,1.1-0.6,1.9-1.9,1.9C62.6,109.8,62,109.7,61.7,109.7z"/>
          <path className="st0" d="M77.2,121.1c0,1-1,1.8-2.2,1.8c-4.3,0-6.2-1.6-6.2-5.9v-7.4h-0.9c-1.2,0-1.9-0.7-1.9-1.7
      					c0-1.1,0.6-1.8,1.9-1.8h0.9v-2.7c0-2.8,3.9-2.8,3.9,0v2.7h2.4c1.2,0,1.9,0.8,1.9,1.8c0,1.1-0.6,1.7-1.9,1.7h-2.4v6.7
      					c0,2.3,0.6,3,2.6,3C76.5,119.3,77.2,120.1,77.2,121.1z"/>
          <path className="st0" d="M92.9,115.7h-9.1c0.2,2.5,1.9,4,4.4,4c1.2,0,2.3-0.4,3.3-1.2c1-0.8,1.9-0.9,2.7-0.1
      					c0.7,0.7,0.7,1.9-0.2,2.7c-1.5,1.4-3.4,2.1-5.7,2.1c-2.5,0-4.5-0.8-6.1-2.4s-2.3-3.7-2.3-6.2c0-2.5,0.7-4.6,2.2-6.3
      					c1.5-1.7,3.4-2.6,5.8-2.6c2.5,0,4.6,1.1,5.7,2.6c1.1,1.5,1.6,3.2,1.6,4.9C95.1,114.7,94.3,115.7,92.9,115.7z M84,112.6h7.1
      					c0-1.8-1-3.3-3.3-3.3C85.6,109.3,84.4,110.8,84,112.6z"/>
          <path className="st0" d="M103.7,120.9c0.2,2.8-4.1,2.8-3.9,0v-20c-0.2-2.8,4.1-2.8,3.9,0V120.9z"/>
          <path className="st0" d="M113.4,120.9c0.2,2.8-4.1,2.8-3.9,0v-20c-0.2-2.8,4.1-2.8,3.9,0V120.9z"/>
          <path className="st0" d="M132.7,108.3c1.7,1.7,2.5,3.7,2.5,6.2c0,2.5-0.9,4.6-2.5,6.2c-1.7,1.7-3.7,2.5-6.1,2.5s-4.5-0.8-6.1-2.5
      					s-2.5-3.7-2.5-6.2c0-2.5,0.8-4.6,2.5-6.2s3.7-2.5,6.1-2.5S131,106.6,132.7,108.3z M129.9,118.3c0.9-1,1.3-2.2,1.3-3.7
      					c0-1.5-0.4-2.8-1.3-3.7c-0.8-1-2-1.5-3.3-1.5c-2.7,0-4.7,2.2-4.7,5.2s1.9,5.2,4.7,5.2C127.9,119.7,129,119.2,129.9,118.3z"/>
          <path className="st0" d="M115.4,46H113v-2v-2.4c0-3.1-2.5-5.6-5.6-5.6H104v-1v-2.6c0-3.5-2.9-6.4-6.4-6.4H52.4
      					c-3.5,0-6.4,2.9-6.4,6.4V35v1h-3.4c-3.1,0-5.6,2.5-5.6,5.6V44v2h-2.4c-3.1,0-5.6,2.5-5.6,5.6V54v14.4v2c0,3.1,2.5,5.6,5.6,5.6
      					h2.7c0.7,2,2.8,4,5.3,4H46v0.6c0,3.5,2.9,6.4,6.4,6.4h45.1c3.5,0,6.4-2.9,6.4-6.4V80h3.4c2.5,0,4.7-2,5.3-4h2.7
      					c3.1,0,5.6-2.5,5.6-5.6v-2V54v-2.4C121,48.5,118.5,46,115.4,46z M37,70h-2.4c-0.9,0-1.6-0.7-1.6-1.6V54v-2.4
      					c0-0.9,0.7-1.6,1.6-1.6H37V70z M46,74h-3.4c-0.9,0-1.6-0.7-1.6-1.6V44v-2.4c0-0.9,0.7-1.6,1.6-1.6H46V74z M100,35v42.6
      					c0,1.3-1.1,2.4-2.4,2.4H52.4c-1.3,0-2.4-1.1-2.4-2.4V35v-2.6c0-1.3,1.1-2.4,2.4-2.4h45.1c1.3,0,2.4,1.1,2.4,2.4V35z M109,44
      					v28.4c0,0.9-0.7,1.6-1.6,1.6H104V40h3.4c0.9,0,1.6,0.7,1.6,1.6V44z M117,54v14.4c0,0.9-0.7,1.6-1.6,1.6H113V50h2.4
      					c0.9,0,1.6,0.7,1.6,1.6V54z"/>
          <path className="st0" d="M82,66.2c-0.4,0-0.8-0.1-1.2-0.4l-5.9-4.3l-5.9,4.2c-0.7,0.5-1.7,0.5-2.4,0c-0.7-0.5-1-1.4-0.7-2.2l2.2-6.8
      					l-5.8-4.1c-0.7-0.5-1-1.4-0.7-2.2s1-1.4,1.9-1.4h7.3l2.2-6.9c0.3-0.8,1-1.4,1.9-1.4h0c0.9,0,1.6,0.6,1.9,1.4l2.2,6.9h7.3
      					c0.9,0,1.6,0.6,1.9,1.4c0.3,0.8,0,1.7-0.8,2.2l-5.8,4.1l2.2,6.8c0.3,0.8,0,1.7-0.7,2.2C82.8,66.1,82.4,66.2,82,66.2z M74.9,57.1
      					c0.4,0,0.8,0.1,1.2,0.4l2,1.5l-0.8-2.3c-0.3-0.8,0-1.7,0.7-2.3L80,53h-2.4c-0.9,0-1.6-0.6-1.9-1.4l-0.8-2.4l-0.8,2.4
      					c-0.3,0.8-1,1.4-1.9,1.4h-2.4l1.9,1.4c0.7,0.5,1,1.4,0.7,2.3l-0.8,2.3l2-1.5C74.1,57.2,74.5,57.1,74.9,57.1z"/>
        </svg>
    );
  }
})

export default ApiKey
