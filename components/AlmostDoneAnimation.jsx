import React from "react"

class AlmostDoneAnimation extends React.Component {

    render() {
        return (
            <div>
                <svg id="Livello_1" x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100"
                     className="almost-done__svg">
                    <line className="almost-done__fill" x1="49.5" y1="70" x2="49.5" y2="88"/>
                    <path className="almost-done__fill" d="M70.5,58.9c0,1.4-1.2,2.6-2.6,2.6H31.1c-1.4,0-2.6-1.2-2.6-2.6V22.1c0-1.4,1.2-2.6,2.6-2.6h36.9
					c1.4,0,2.6,1.2,2.6,2.6V58.9z"/>
                    <path className="almost-done__fill"
                          d="M70.5,23v36.3c0,1.4-0.8,3.2-2.2,3.2H31.7c-1.4,0-3.2-1.8-3.2-3.2V23"/>
                    <polyline className="almost-done__fill" points="42.6,75.5 49.3,68.5 56.2,75.5 "/>
                    <polygon className="almost-done__fill"
                             points="50,29.6 52.6,37.5 60.9,37.5 54.2,41.9 56.8,49.5 50,44.5 43.2,49.3 45.8,41.9 39.1,37.5 47.4,37.5 "/>
                    <path className="almost-done__fill" d="M41.6,96.7c-25.8-4.7-43-29.3-38.3-55.2c4.6-25.8,29.3-43,55.2-38.3c25.8,4.6,43,29.3,38.3,55.2
					c-3.7,20.4-19.9,35.4-39.2,38.5"/>
                </svg>
            </div>
        );
    }
}

export default AlmostDoneAnimation