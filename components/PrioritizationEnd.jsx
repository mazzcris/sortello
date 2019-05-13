import React from "react"
import SuccessAnimation from './SuccessAnimation.jsx';
import CheckBoardButton from './CheckBoardButton.jsx';
import PrioritizeAnotherListButton from './PrioritizeAnotherListButton.jsx';

class PrioritizationEnd extends React.Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
        <div className="prioritization-end__container">
            <SuccessAnimation />
            <div className="prioritization-end__heading">Prioritization it's over!</div>
            <div className="prioritization-end__paragraph">Go to your board to see your tasks ordered,
                or open a new room and restart prioritizing. </div>
            <div className="prioritization-end__buttons">
                <CheckBoardButton url={this.props.url}
                                  BoardApi={this.props.BoardApi}/>
                {this.props.BoardApi.getName() === "Trello"? <PrioritizeAnotherListButton/> : null}
            </div>
        </div>
    )}
}

export default PrioritizationEnd