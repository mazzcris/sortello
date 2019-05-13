import React from 'react';
import SeeCardButton from './SeeCardButton.jsx'
import SendToBottomButton from './SendToBottomButton.jsx'

class CardButtons extends React.Component {
    render () {

        let continueButton = null;
        if (this.props.everybodyVoted) {
            continueButton = <div className="card-button__continue button-text__continue"
                                  onClick={() => this.props.handleGoToNextVoting(this.props.side)}>Continue</div>
        }
        return (
            <div className="wrapper__card-buttons">
                {continueButton}
                <SeeCardButton shortUrl={this.props.data.shortUrl}/>
                <SendToBottomButton cardId={this.props.data.id} forget={this.props.forget}/>
            </div>
        )
    }
}

export default CardButtons
