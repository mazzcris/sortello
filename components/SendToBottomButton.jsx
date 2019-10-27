import React from 'react';

class SendToBottomButton extends React.Component {
    render () {
        return (
            <div className="card-button__esclude button-blacklist button-text__esclude"
                 onClick={() => {
                     this.props.forget(this.props.cardId)
                 }} data-cardid={this.props.cardId}>
                Send to bottom
            </div>
        )
    }
}

export default SendToBottomButton
