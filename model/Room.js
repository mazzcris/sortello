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

    join (sortelloId, sortelloAvatar) {
        this.socket.emit('room', this.roomKey, sortelloId, sortelloAvatar);
    }

    leave (sortelloId) {
        this.socket.emit('leaveRoom', this.roomKey, sortelloId)
    }

    getBoardId () {
        this.socket.emit('getBoardId', this.roomKey)
    }


    getRoomVoters(){
        return this.roomVoters;
    }

    castCardClicked (side, sortelloId, sortelloAvatar) {
        this.socket.emit('cardClicked', side, this.roomKey, sortelloId, sortelloAvatar)
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

    addVoter (voterId, sortelloAvatar) {
        let component = this
        if (find(component.roomVoters, {'id': voterId}) !== undefined) {
            return
        }
        let voters = component.roomVoters.concat({id: voterId, avatar: sortelloAvatar});
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

    registerVote (side, sortelloId, sortelloAvatar) {
        let voter = {
            voterId: sortelloId,
            sortelloId: sortelloId,
            sortelloAvatar: sortelloAvatar
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
            id: this.sortelloId,
            avatar: this.sortelloAvatar,
            isAdmin: true
        })
        return joinedVoters
    }

}

export default Room;