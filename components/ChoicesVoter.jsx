import React from 'react';
import {clone} from 'lodash'
import io from 'socket.io-client';
import queryString from 'query-string';
import PrioritizationEnd from './PrioritizationEnd.jsx'
import Room from '../model/Room.js'
import ChoicesView from './view/ChoicesView.jsx'
import AccessdeniedAnimation from './AccessdeniedAnimation.jsx';




const params = queryString.parse(location.search);

class Choices extends React.Component {
    constructor(props) {
        super(props);
        let component = this
        this.handleCardClicked = this.handleCardClicked.bind(this)
        this.BoardApi = this.props.BoardApi
        this.renderForbidden = this.renderForbidden.bind(this)
        this.renderLoading = this.renderLoading.bind(this)
        this.room = false;
        this.socket = false;
        this.state = {
            leftCard: null,
            rightCard: null,
            ended: false,
            voters: {left: [], right: []},
            hasVoted: false,
            hasBoardPermissions: false,
            selectedSide: null,
            roomVoters: []
        }
        if (params.roomKey !== undefined) {
            this.setUpRoom(component);
        }
        if (this.socket) {
            this.setUpSocket(component);
        }
    }

    componentDidMount () {
        if (typeof socketAddress !== 'undefined') {
            if (socketAddress !== null) {
                this.socket = io(socketAddress);
            }
        }
    }

    setUpSocket(component) {
        this.socket.on('votesInfo', function (leftVoters, rightVoters) {
            component.setState({
                voters: {
                    left: leftVoters,
                    right: rightVoters,
                }
            })
        })

        this.socket.on('castBoardIdToVoters', function (boardId) {
            component.BoardApi.getBoard(boardId, function () {
                component.setState({
                    hasBoardPermissions: true
                })
            }, function () {
                component.setState({
                    hasBoardPermissions: false
                }, function () {
                    component.room.leave(component.trelloId)
                })
            })
        })

        this.socket.on('nextChoice', function (leftCard, rightCard) {
            component.setState({
                leftCard: leftCard,
                rightCard: rightCard,
                hasVoted: false,
                selectedSide: null
            })
        })

        this.socket.on('roomVotersUpdated', function (roomVoters) {
            component.setState({
                roomVoters: roomVoters
            })
        })

        this.socket.on('prioritizationEnded', function () {
            component.setState({
                ended: true
            })
        })
    }

    setUpRoom(component) {
        component.state.roomId = params.roomKey
        if (this.socket) {
            component.room = new Room(this.socket, params.roomKey);
            this.socket.on('connect', function () {
                component.BoardApi.getMembers('me', {}, function (data) {
                    component.trelloId = data.id
                    component.trelloAvatar = '//trello-avatars.s3.amazonaws.com/' + data.avatarHash + '/50.png'
                    if (data.avatarHash === null) {
                        component.trelloAvatar = '//www.gravatar.com/avatar/' + data.gravatarHash + '?s=64&d=identicon'
                    }
                    component.room.join(component.trelloId, component.trelloAvatar)
                    component.room.getBoardId()
                    component.room.getCurrentChoice()
                }, function (e) {
                    console.log(e);
                });
            });

            window.addEventListener("beforeunload", (ev) => {
                ev.preventDefault()
                component.room.leave(component.trelloId)
            });
        }
    }

    handleCardClicked(side) {
        if (!this.state.hasVoted && this.room) {
            this.room.castCardClicked(side, this.trelloId, this.trelloAvatar)
        }
        this.setState({
            hasVoted: true,
            selectedSide: side
        })
    }

    renderForbidden () {
        return  <div>
                    <div className="no-access-message__container">
                        <AccessdeniedAnimation />
                        <div id="forbidden-div" className="no-access-message__heading">Ooops!</div>
                <div className="no-access-message__paragraph">You have no access to this board, please contact board's administrator to gain access.</div>
                    </div>
                </div>
    }

    renderLoading() {
        return (<span>Loading...</span>);
    }

    render() {
        if (!this.state.hasBoardPermissions) {
            return this.renderForbidden()
        }
        if (this.state.leftCard == null || this.state.rightCard == null) {
            return this.renderLoading()
        }
        if (this.state.ended) {
            return (<PrioritizationEnd/>)
        }
        return (
            <ChoicesView
                roomVoters={this.state.roomVoters}
                leftCard={this.state.leftCard}
                rightCard={this.state.rightCard}
                everybodyVoted={this.room.voters.left.length + this.room.voters.right.length > 0}
                voters={this.state.voters}
                handleAddToBlacklist={null}
                handleCardClicked={this.handleCardClicked}
                handleGoToNextVoting={() => {
                }}
                progress={0}
                selectedSide={this.state.selectedSide}
                role="voter"
            />
        )
    }
}

export default Choices
