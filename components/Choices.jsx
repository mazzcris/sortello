import React from "react";
import Card from './Card.jsx';
import {clone} from "lodash"
import Engine from "../model/Engine.js"
import io from 'socket.io-client';
import {find} from "lodash"
import {findIndex} from "lodash"
import {remove} from "lodash"
import Room from "../model/Room.js"
import ChoicesView from './view/ChoicesView.jsx'
import RoomLink from './RoomLink.jsx'

function openOverlay() {
    document.getElementById('overlay__share-room').style.height = "100%";
    document.getElementById('overlay__share-room').style.opacity = "1";
}

const getRandomKey = () => {
    let randomKey = '';
    let chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    for (let i = 32; i > 0; --i) randomKey += chars[Math.floor(Math.random() * chars.length)];
    return randomKey
}

class Choices extends React.Component {

    constructor (props) {
        super(props);
        this.engine = new Engine(clone(this.props.nodes), clone(this.props.rootNode))
        this.bindMethods();
        this.room = false;
        this.socket = false;
        this.state = {
            leftCard: null,
            rightCard: null,
            selectedSide: null
        }}

    bindMethods(){
        this.handleCardClicked = this.handleCardClicked.bind(this)
        this.cardClicked = this.cardClicked.bind(this)
        this.handleAddToBlacklist = this.handleAddToBlacklist.bind(this)
        this.handleUndoClicked = this.handleUndoClicked.bind(this)
        this.startChoices = this.startChoices.bind(this)
        this.createRoom = this.createRoom.bind(this)
        this.handleGoToNextVoting = this.handleGoToNextVoting.bind(this)
        this.getTrelloUserData = this.getTrelloUserData.bind(this)
        this.checkEnded = this.checkEnded.bind(this)
    }

    componentDidMount () {
        if (typeof socketAddress !== 'undefined') {
            if (socketAddress !== null) {
                this.socket = io(socketAddress);
            }
        }
    }

    getTrelloUserData (component) {
        this.props.BoardApi.getMembers('me', {}, function (data) {
            component.trelloId = data.id
            component.trelloAvatar = '//trello-avatars.s3.amazonaws.com/' + data.avatarHash + '/50.png'
            if (data.avatarHash === null) {
                component.trelloAvatar = '//www.gravatar.com/avatar/' + data.gravatarHash + '?s=64&d=identicon'
            }
        }, function (e) {
            console.log(e);
        });
    }

    createRoom () {
        if(this.room){
            return;
        }
        let randomKey = getRandomKey()
        this.room = new Room(this.socket, randomKey)
        this.room.open(randomKey)
        this.room.listenSocket()
    }

    startChoices () {
        this.props.setStartTimeStamp(Date.now())
        this.engine.nextStepOrEnd();
        this.getNextChoice()
    }

    getNextChoice () {
        let component = this
        if(component.room) {
            component.room.setEverybodyVoted(false);
        }
        this.setState({
            hasVoted: false,
        }, function () {
            if (component.room) {
                component.room.castVotesInfo([], [])
            }
        })
        component.checkEnded();
    }

    checkEnded(){
        if (this.engine.getEnded()) {
            if (this.room) {
                this.room.castPrioritizationEnded()
            }
            this.props.setSortedRootNode(this.engine.getRootNode());
        } else {
            this.setState({
                leftCard: this.engine.getNode(),
                rightCard: this.engine.getCompareNode(),
                selectedSide: null
            }, function () {
                if (this.engine.autoChoice()) {
                    this.getNextChoice()
                }
                if (this.room) {
                    this.room.castNextChoice(this.state.leftCard, this.state.rightCard)
                }
            });
        }
    }
    handleUndoClicked () {
        this.engine.undo();
        this.getNextChoice()
    }

    handleAddToBlacklist (nodeId) {
        this.engine.addToBlackList(nodeId);
        this.getNextChoice();
    }

    cardClicked (side) {
        this.engine.choiceMade(side, "human");
        this.getNextChoice()
    }

    handleGoToNextVoting (side) {
        this.cardClicked(side)
    }

    handleCardClicked (side) {
        if(this.room) {
            if (this.room.roomVoters.length === 0) {
                this.cardClicked(side)
            }
        }else{
            this.cardClicked(side)
        }

        if (this.state.hasVoted) {
            return
        }
        let component = this

        let voter = {
            voterId: component.trelloId,
            trelloId: component.trelloId,
            trelloAvatar: component.trelloAvatar
        }

        component.setState({
            hasVoted: true,
            selectedSide: component.room ? side : null
        })
        if(this.room) {
            this.room.addVoteToVoters(side, voter)
        }
    }

    getProgress () {
        return Math.round(((100 * (this.props.nodes.length - this.engine.getListNodes().length - 1)) / (this.props.nodes.length)))
    }

    renderCard (id, side, value) {
        return (
            <Card id={id} side={side} handleClick={this.handleCardClicked}
                  forget={this.handleAddToBlacklist} data={value}/>
        )
    }

    renderRoomLink () {
        return <RoomLink roomId={this.room? this.room.getRoomId : null}/>
    }


    renderNewRoomButton () {
        if (this.socket) {
            return (
                <div>
                    <div onClick={() => { openOverlay() }}>
                        <a href="#" id="new-room-button" onClick={this.createRoom}>
                            <div className="share-room__button">
                                {this.room ? 'Share room' : 'Open new room' }</div>
                        </a>
                    </div>
                </div>
            )
        }
        return ''
    }

    renderLoading () {
        return (<div><span>Loading...</span></div>)
    }

    render () {

        if (this.state.leftCard == null || this.state.rightCard == null) {
            this.renderLoading()
        }

        return (
            <ChoicesView
                newRoomButton={this.renderNewRoomButton()}
                roomLink={this.renderRoomLink()}
                roomVoters={this.room? this.room.getAllRoomVoters() : null}
                leftCard={this.state.leftCard}
                rightCard={this.state.rightCard}
                everybodyVoted={this.room? this.room.getEverybodyVoted() : null}
                voters={this.room? this.room.getVoters() : null}
                handleAddToBlacklist={this.handleAddToBlacklist}
                handleCardClicked={this.handleCardClicked}
                handleUndoClicked={this.handleUndoClicked}
                handleGoToNextVoting={this.handleGoToNextVoting}
                progress={this.getProgress()}
                selectedSide={this.state.selectedSide}
            />
        )
    }
}

export default Choices
