import React from "react";
import {clone} from "lodash"
import Engine from "../model/Engine.js"
import io from 'socket.io-client';
import {find} from "lodash"
import {findIndex} from "lodash"
import Room from "../model/Room.js"
import ChoicesView from './view/ChoicesView.jsx'
import RoomLink from './RoomLink.jsx'
import Loader from "./Loader.jsx";

function openOverlay() {
    document.getElementById('overlay__share-room').style.height = "100%";
    document.getElementById('overlay__share-room').style.opacity = "1";
}

let socket = false;
if (typeof socketAddress !== 'undefined') {
    if (socketAddress !== null) {
        socket = io(socketAddress);
    }
}

const getRandomKey = () => {
    let randomKey = '';
    let chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    for (let i = 32; i > 0; --i) randomKey += chars[Math.floor(Math.random() * chars.length)];
    return randomKey
};

class Choices extends React.Component {

    constructor (props) {
        super(props);
        this.engine = new Engine(clone(this.props.nodes), clone(this.props.rootNode));
        this.room = false;
        this.state = {
            leftCard: null,
            rightCard: null,
            roomId: null,
            voters: {left: [], right: []},
            roomVoters: [],
            everybodyVoted: false,
            selectedSide: null
        }
    }

    componentDidMount(){
        this.bindMethod();
    }

    bindMethod(){
        this.handleCardClicked = this.handleCardClicked.bind(this);
        this.cardClicked = this.cardClicked.bind(this);
        this.handleAddToBlacklist = this.handleAddToBlacklist.bind(this);
        this.handleUndoClicked = this.handleUndoClicked.bind(this);
        this.startChoices = this.startChoices.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.listenSocket = this.listenSocket.bind(this);
        this.removeVoter = this.removeVoter.bind(this);
        this.addVoter = this.addVoter.bind(this);
        this.handleGoToNextVoting = this.handleGoToNextVoting.bind(this);
        this.registerVote = this.registerVote.bind(this);
        this.addVoteToVoters = this.addVoteToVoters.bind(this);
        this.getTrelloUserData(this);
        this.getAllRoomVoters = this.getAllRoomVoters.bind(this);
        this.castRoomVoters = this.castRoomVoters.bind(this);
        this.checkEnded = this.checkEnded.bind(this)
    }

    getTrelloUserData (component) {
        component.props.BoardApi.getMembers('me', {}, function (data) {
            var normalizedData = component.props.BoardApi.normalizeData(data);
            component.sortelloId = normalizedData.id;
            component.sortelloAvatar = normalizedData.avatar;
            if (normalizedData.avatar.includes("null")) {
                component.sortelloAvatar = '//www.gravatar.com/avatar/' + normalizedData.gravatar + '?s=64&d=identicon'
            }
        }, function (e) {
            console.log(e);
        });
    }

    createRoom () {
        if(this.room){
            return;
        }
        let randomKey = getRandomKey();
        this.room = new Room(socket, randomKey);
        this.room.open(randomKey);
        this.listenSocket()
    }

    listenSocket(){
        let component = this;
        socket.on('newRoomOpened', roomId => {
            component.setState({
                roomId: roomId
            })
        });

        socket.on('voterJoined', function (voterId, sortelloAvatar) {
            component.addVoter(voterId, sortelloAvatar);
        });

        socket.on('voterLeft', function (voterId) {
            component.removeVoter(voterId)
        });

        socket.on('checkParamsFromMaster',function(){
            let fw = component.props.BoardApi.getShortenedExtension();
            component.room.castParams(component.props.extId,fw);
        });

        socket.on('getCurrentChoice', function () {
            component.room.castNextChoice(component.state.leftCard, component.state.rightCard, component.getProgress())
        });

        socket.on('cardClicked', function (side, sortelloId, sortelloAvatar) {
            component.registerVote(side, sortelloId, sortelloAvatar)
        });

        socket.on('getBoardIdFromMaster', function () {
            if(component.props.BoardApi.getName() === "Trello"){
                component.room.castBoardId(component.props.boardId)
            }else{
                component.room.castBoardId(component.props.urlProject);
            }
        })
    }

    addVoteToVoters (side, voter) {
        let component = this
        if ('node' === side) {
            let lv = component.state.voters.left.concat(voter);
            component.setState({
                voters: {
                    left: lv,
                    right: component.state.voters.right,
                }
            }, function () {
                component.checkTotalVotes()
            })
        }
        if ('compareNode' === side) {
            let rv = component.state.voters.right.concat(voter);
            component.setState({
                voters: {
                    left: component.state.voters.left,
                    right: rv,
                }
            }, function () {
                component.checkTotalVotes()
            })
        }
    }

    registerVote (side, sortelloId, sortelloAvatar) {
        let voter = {
            voterId: sortelloId,
            sortelloId: sortelloId,
            sortelloAvatar: sortelloAvatar
        };

        this.addVoteToVoters(side, voter)

    }

    checkTotalVotes () {
        let component = this;
        if (this.state.roomVoters.length === 0) {
            return
        }

        if ((this.state.voters.left.length + this.state.voters.right.length) >= 1 + this.state.roomVoters.length) {
            this.setState({
                everybodyVoted: true
            }, function () {
                if (component.room) {
                    component.room.castVotesInfo(component.state.voters.left, component.state.voters.right)
                }
            })
        }
    }

    castRoomVoters () {
        this.room.castRoomVoters(this.getAllRoomVoters())
    }

    removeVoter (voterId) {
        let component = this;
        if (find(component.state.roomVoters, {'id': voterId}) === undefined) {
            return
        }
        let newVoters = component.state.roomVoters.slice(); //copy array
        let index = findIndex(newVoters, function (item) {
            return item.id === voterId
        });
        newVoters.splice(index, 1); //remove element
        component.setState({
            roomVoters: newVoters
        }, () => {
            component.castRoomVoters()
        })
    }

    addVoter (voterId, sortelloAvatar) {
        let component = this;
        if (find(component.state.roomVoters, {'id': voterId}) !== undefined) {
            return
        }
        let voters = component.state.roomVoters.concat({id: voterId, avatar: sortelloAvatar});
        component.setState({
            roomVoters: voters
        }, () => {
            component.castRoomVoters()
        })
    }

    startChoices () {
        this.props.setStartTimeStamp(Date.now());
        this.engine.nextStepOrEnd();
        this.getNextChoice()
    }

    getNextChoice () {
        let component = this;
        this.setState({
            hasVoted: false,
            everybodyVoted: false
        }, function () {
            if (component.room) {
                component.room.castVotesInfo([], [])
            }
        });
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
                voters: {left: [], right: []},
                selectedSide: null
            }, function () {
                if (this.engine.autoChoice()) {
                    this.getNextChoice()
                }
                if (this.room) {
                    this.room.castNextChoice(this.state.leftCard, this.state.rightCard,this.getProgress())
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
        if (this.state.roomVoters.length === 0) {
            this.cardClicked(side)
        }

        if (this.state.hasVoted) {
            return
        }
        let component = this;

        let voter = {
            voterId: component.sortelloId,
            sortelloId: component.sortelloId,
            sortelloAvatar: component.sortelloAvatar
        };

        component.setState({
            hasVoted: true,
            selectedSide: component.room ? side : null
        });

        this.addVoteToVoters(side, voter)
    }

    getProgress () {
        return Math.round(((100 * (this.props.nodes.length - this.engine.getListNodes().length - 1)) / (this.props.nodes.length)))
    }

    renderRoomLink () {
        return <RoomLink roomId={this.state.roomId} extId={this.props.extId} BoardApi ={this.props.BoardApi}/>
    }


    renderNewRoomButton () {
        if (socket) {
            return (
                <div>
                    <div onClick={() => { openOverlay() }}>
                        <a href="#" id="new-room-button" onClick={this.createRoom}>
                            <div className="share-room__button">
                                {this.room? 'Share room' : 'Open new room' }</div>
                        </a>
                    </div>
                </div>
            )
        }
        return ''
    }

    renderLoading () {
        return <Loader/>;
    }

    getAllRoomVoters () {
        let joinedVoters = this.state.roomVoters;
        if (this.room) {
            joinedVoters = joinedVoters.concat({
                id: this.sortelloId,
                avatar: this.sortelloAvatar,
                isAdmin: true
            })
        }

        return joinedVoters
    }

    render () {

        if (this.state.leftCard == null || this.state.rightCard == null) {
            this.renderLoading()
        }

        return (
            <ChoicesView
                newRoomButton={this.renderNewRoomButton()}
                roomLink={this.renderRoomLink()}
                roomVoters={this.getAllRoomVoters()}
                leftCard={this.state.leftCard}
                rightCard={this.state.rightCard}
                everybodyVoted={this.state.everybodyVoted}
                voters={this.state.voters}
                handleAddToBlacklist={this.handleAddToBlacklist}
                handleCardClicked={this.handleCardClicked}
                handleUndoClicked={this.handleUndoClicked}
                handleGoToNextVoting={this.handleGoToNextVoting}
                progress={this.getProgress()}
                selectedSide={this.state.selectedSide}
                BoardApi = {this.props.BoardApi}
            />
        )
    }
}

export default Choices
