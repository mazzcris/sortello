import React from "react"

class SuccessAnimation extends React.Component {
    render () {
        return (
            <div>
                <svg id="Livello_1" x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100"
                     className="send-success__svg">
                    <circle className="success-animation__stroke-secondary" cx="50" cy="50" r="47.5"/>
                    <polyline className="success-animation__stroke-main" points="26,49.5 42,65.5 74,33.5 "/>
                </svg>
            </div>
        );
    }
}

export default SuccessAnimation