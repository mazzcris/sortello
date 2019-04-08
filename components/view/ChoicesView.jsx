import React from "react";
import Header from '../Header.jsx';
import Card from '../Card.jsx';
import Footer from "../Footer.jsx"
import {clone} from "lodash"
import {find} from "lodash"
import {findIndex} from "lodash"
import {remove} from "lodash"
import Avatars from '../Avatars.jsx'

function closeOverlay() {
    document.getElementById('overlay__share-room').style.height = "0%";
    document.getElementById('overlay__share-room').style.opacity = "0";
}


class ChoicesView extends React.Component {

    constructor (props) {
        super(props);
        this.printCard = this.printCard.bind(this)
    }

    printCard (id, side, data, voters) {
        return <Card id={id} side={side} handleClick={this.props.handleCardClicked}
                     forget={this.props.handleAddToBlacklist} data={data}
                     voters={voters}
                     everybodyVoted={this.props.everybodyVoted}
                     handleGoToNextVoting={this.props.handleGoToNextVoting}
                     selected={this.props.selectedSide === side}
        />
    }

    renderVoterInfo() {
        if (this.props.role==='voter') {
            return (
                <div className="container__voter-info">
                    <div className="voter-info__dot"></div>
                    <div className="voter-info__text">You are in a shared room</div>
                </div>
            )
        } 
        return null
    }

    render () {
        let undoButton = ''
        if (this.props.handleUndoClicked) {
            undoButton =
                <button onClick={() => this.props.handleUndoClicked()} id="undo_button"
                        className="normalize__undo-button">
                    <div className="undo__button">
                        <div className="undo__icon">
                            <img src="assets/icons/undo-icon.svg" alt=""/>
                            Undo choice
                        </div>
                    </div>
                </button>
        }


        if (this.props.leftCard == null || this.props.rightCard == null) {
            return (<div><span>Loading...</span></div>);
        }
        return (
            <div id="second_div">
                <div className="container__choose-card">
                    <div className="container__top-bar">
                        <div className="choose-card__heading">Select the highest priority card</div>
                        <div className="container__prioritization-status">
                            <div className={"progressive-bar__status-structure"}>
                                <div className={"progressive-bar__status"} role="progressbar"
                                     aria-valuenow={this.props.progress}
                                     aria-valuemin="0"
                                     aria-valuemax="100" style={{width: this.props.progress + '%'}}>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.printCard('left_button', 'node', this.props.leftCard.value,
                        this.props.voters? this.props.voters.left : null)}
                    {this.printCard('right_button', 'compareNode', this.props.rightCard.value,
                        this.props.voters? this.props.voters.right : null)}
                    {/*<TreeDraw tree={this.state.rootNode}></TreeDraw>*/}
                    
                    <div className="container__actions-bar">
                        {undoButton}
                        {this.renderVoterInfo()}
                        <div className="container__avatars" >
                            <div className="guest__label">Guests</div>
                            <Avatars users={this.props.roomVoters} />
                            {this.props.newRoomButton}
                        </div>
                    </div>
                </div>
                <div className={"footer"}>
                    <Footer/>
                    <Header/>
                </div>

                <div className="overlay__share-room" id="overlay__share-room">
                    <div className="share-room__container">
                        <div className="share-room__close" >
                            <img id="share-room__close" src="assets/icons/quit.svg" alt="" onClick={() => {
                                closeOverlay()
                            }}/>
                        </div>
                        <div className="share-room__heading">Share this link to invite your team mates</div>
                        {this.props.roomLink}
                    </div>
                </div>
            </div>
        )
    }
}

export default ChoicesView
