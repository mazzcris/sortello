import {find, findIndex} from "lodash";

class Room {

    constructor (socket, roomKey) {
        this.socket = socket
        this.roomKey = roomKey
        this.roomId = null;
        this.roomVoters = [];
        this.voters = {left:[], right:[]};
        this.everybodyVoted = false;
    }

    open (newRoomKey) {
        this.socket.emit('openNewRoom', newRoomKey)
    }

    join (trelloId, trelloAvatar) {
        this.socket.emit('room', this.roomKey, trelloId, trelloAvatar);
    }

    leave (trelloId) {
        this.socket.emit('leaveRoom', this.roomKey, trelloId)
    }

    getBoardId () {
        this.socket.emit('getBoardId', this.roomKey)
    }

    getCurrentChoice () {
        this.socket.emit('getCurrentChoice', this.roomKey);
    }

    getRoomId(){
        return this.roomId;
    }

    getRoomVoters(){
        return this.roomVoters;
    }

    getVoters(){
        return this.voters;
    }

    getEverybodyVoted(){
        return this.everybodyVoted;
    }

    setEverybodyVoted(value){
        this.everybodyVoted=value;
    }

    castCardClicked (side, trelloId, trelloAvatar) {
        this.socket.emit('cardClicked', side, this.roomKey, trelloId, trelloAvatar)
    }


    // master methods
    castNextChoice (leftCard, rightCard) {
        this.socket.emit('nextChoice', leftCard, rightCard, this.roomKey)
    }

    castBoardId (boardId) {
        this.socket.emit('castBoardId', this.roomKey, boardId)
    }

    castRoomVoters (roomVoters) {
        this.socket.emit('roomVotersUpdated', this.roomKey, roomVoters)
    }

    castPrioritizationEnded () {
        this.socket.emit('prioritizationEnded', this.roomKey)
    }

    castVotesInfo (leftVoters, rightVoters) {
        this.socket.emit('votesInfo', leftVoters, rightVoters, this.roomKey)
    }

    listenSocket(){
        let component = this;
        this.socket.on('newRoomOpened', roomId => {
            console.log("new room opened")
            this.roomId=roomId;
        })

        this.socket.on('voterJoined', function (voterId, trelloAvatar) {
            component.addVoter(voterId, trelloAvatar);
        })

        this.socket.on('voterLeft', function (voterId) {
            component.removeVoter(voterId)
        })

        this.socket.on('getCurrentChoice', function () {
            component.castNextChoice(component.state.leftCard, component.state.rightCard)
        })

        this.socket.on('cardClicked', function (side, trelloId, trelloAvatar) {
            component.registerVote(side, trelloId, trelloAvatar)
        })

        this.socket.on('getBoardIdFromMaster', function () {
            component.castBoardId(component.props.boardId)
        })
    }

    addVoter (voterId, trelloAvatar) {
        let component = this
        if (find(component.roomVoters, {'id': voterId}) !== undefined) {
            return
        }
        let voters = component.roomVoters.concat({id: voterId, avatar: trelloAvatar});
        this.roomVoters= voters
        component.castRoomVoters(this.getAllRoomVoters())
    }

    removeVoter (voterId) {
        let component = this
        if (find(component.roomVoters, {'id': voterId}) === undefined) {
            return
        }
        let newVoters = component.roomVoters.slice(); //copy array
        let index = findIndex(newVoters, function (item) {
            return item.id === voterId
        })
        newVoters.splice(index, 1); //remove element
        this.roomVoters = newVoters
        component.castRoomVoters(this.getAllRoomVoters())
    }

    registerVote (side, trelloId, trelloAvatar) {
        let voter = {
            voterId: trelloId,
            trelloId: trelloId,
            trelloAvatar: trelloAvatar
        }
        this.addVoteToVoters(side, voter)

    }

    addVoteToVoters (side, voter) {
        let component = this
        if ('node' === side) {
            component.voters.left.push(voter);
            component.checkTotalVotes()
        }
        if ('compareNode' === side) {
            component.voters.right.push(voter);
            component.checkTotalVotes()
        }
    }

    checkTotalVotes () {
        let component = this;
        if (component.voters.length === 0) {
            return
        }
        if ((component.voters.left.length + component.voters.right.length) >= 1 + component.roomVoters.length) {
            component.everybodyVoted=true;
            component.castVotesInfo(component.voters.left, component.voters.right)
        }
    }

    getAllRoomVoters () {
        let joinedVoters = this.getRoomVoters();
        joinedVoters = joinedVoters.concat({
            id: this.trelloId,
            avatar: this.trelloAvatar,
            isAdmin: true
        })
        return joinedVoters
    }

}

export default Room;