import React from "react";
import {shallow} from 'enzyme';
import TrelloApi from "../Api/TrelloApi"
import Choices from "./Choices";
import Room from "../model/Room";
import Engine from "../model/Engine"

describe("Choices", () => {
    let props = {
        BoardApi: null,
        setSortedRootNode: jest.fn(),
        setStartTimeStamp: null,
        nodes: [],
        rootNode: null
    }

    it("updates votes if a room is opened when card is clicked ", () => {
        props.BoardApi = new TrelloApi();
        let wrapper = shallow(<Choices {...props}/>)
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        wrapper.instance().room = new Room(socket,roomKey);
        let spy = spyOn(wrapper.instance().room, 'addVoteToVoters');
        wrapper.instance().cardClicked = jest.fn();
        wrapper.instance().handleCardClicked("side");
        expect(spy).toHaveBeenCalled();

    });

    it("handles click of cards if room is opened and voters are zero or if the room isn't opened", () => {
        props.BoardApi = new TrelloApi();
        let wrapper = shallow(<Choices {...props}/>)
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        wrapper.instance().room = new Room(socket, roomKey);
        let spy = spyOn(wrapper.instance(), 'cardClicked');
        wrapper.instance().handleCardClicked("side");
        expect(spy).toHaveBeenCalled();
        spy.calls.reset();
        wrapper.instance().room = null;
        wrapper.instance().handleCardClicked();
        expect(spy).toHaveBeenCalled();
    });

    it("getProgress return the correct value", () => {
        props.nodes = ["1", "2", "3", "4"];
        let wrapper = shallow(<Choices {...props}/>)
        spyOn(wrapper.instance().engine,'getListNodes').and.returnValue(["3","4"]);
        expect(wrapper.instance().getProgress()).toEqual(25);
    });

    it("show the open/share room if socket is declared", () => {
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        let wrapper = shallow(<Choices {...props}/>);
        wrapper.instance().room = new Room(socket,roomKey)
        wrapper.instance().socket = true;
        let output = wrapper.instance().renderNewRoomButton();
        expect(output).not.toEqual("");
    });

    it("show 'Share room' if socket and room are initialized", () => {
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        let wrapper = shallow(<Choices {...props}/>);
        wrapper.instance().room = new Room(socket,roomKey);
        wrapper.instance().socket = true;
        let output = wrapper.instance().renderNewRoomButton();
        wrapper = shallow(output);
        expect(wrapper.find("div").at(2).props().children).toEqual("Share room");
    });

    it("show 'Open room' if socket is initialized but not the room", () => {
        let wrapper = shallow(<Choices {...props}/>);
        wrapper.instance().room = null;
        wrapper.instance().socket = true;
        let output = wrapper.instance().renderNewRoomButton();
        wrapper = shallow(output);
        expect(wrapper.find("div").at(2).props().children).toEqual("Open new room");
    });

    it("return nothing if room is already created when user wants to create a room",() => {
        let wrapper = shallow(<Choices {...props}/>)
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        wrapper.instance().room = new Room(socket,roomKey);
        let spy = spyOn(wrapper.instance().room, 'open');
        let spy2 = spyOn(wrapper.instance().room, 'listenSocket');
        wrapper.instance().createRoom();
        expect(spy).not.toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
    })

    it("create room when user wants to create it", () => {
        let wrapper = shallow(<Choices {...props}/>)
        wrapper.instance().room = null;
        wrapper.instance().socket = {
            emit: jest.fn(),
            on: jest.fn()}
        wrapper.instance().createRoom();
        expect(wrapper.instance().room).toBeTruthy();
    })

    it("check if prioritization is ended each time we selected a card", () => {
        let wrapper = shallow(<Choices {...props}/>)
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        wrapper.instance().room = new Room(socket,roomKey)
        let spy = spyOn(wrapper.instance().room, 'setEverybodyVoted');
        let spy2 = spyOn(wrapper.instance().room, 'castVotesInfo');
        let spy3 = spyOn(wrapper.instance(), 'checkEnded');
        wrapper.instance().room = null;
        wrapper.instance().getNextChoice();
        expect(spy).not.toHaveBeenCalled();
        expect(wrapper.instance().state.hasVoted).toEqual(false);
        expect(spy2).not.toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    })

    it("communicate with server if room is not null", () => {
        let wrapper = shallow(<Choices {...props}/>)
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        wrapper.instance().room = new Room(socket,roomKey)
        let spy = spyOn(wrapper.instance().room, 'setEverybodyVoted');
        let spy2 = spyOn(wrapper.instance().room, 'castVotesInfo');
        let spy3 = spyOn(wrapper.instance(), 'checkEnded');
        wrapper.instance().getNextChoice();
        expect(spy).toHaveBeenCalled();
        expect(wrapper.instance().state.hasVoted).toEqual(false);
        expect(wrapper.instance().room.everybodyVoted).toEqual(false);
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    })

    it("set the correct values of leftCard and rightCard when prioritization is not ended", () => {
        let wrapper = shallow(<Choices {...props}/>)
        const node = "[1]"
        const compareNode = "[2]"
        wrapper.instance().engine = new Engine("[[1],[2]]","[1]");
        let spy = spyOn(wrapper.instance().engine, 'autoChoice').and.returnValue(false);
        wrapper.instance().engine.ended = false;
        wrapper.instance().engine.node = node;
        wrapper.instance().engine.compareNode = compareNode;
        wrapper.instance().checkEnded();
        expect(wrapper.instance().state.leftCard).toEqual(node)
        expect(wrapper.instance().state.rightCard).toEqual(compareNode)
        expect(spy).toHaveBeenCalled();
    })

    it("check if the sort is finished in local and server", () => {
        let spy = spyOn (props,"setSortedRootNode");
        let wrapper = shallow(<Choices {...props}/>)
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        wrapper.instance().room = new Room(socket,roomKey);
        wrapper.instance().engine.ended = true;
        let spy2 = spyOn(wrapper.instance().room, 'castPrioritizationEnded');
        wrapper.instance().checkEnded();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        spy.calls.reset();
        spy2.calls.reset();
        wrapper.instance().room = null;
        wrapper.instance().checkEnded();
        expect(spy).toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();

    })

    it("start nextChoice if prioritization isn't ended and we got other card to prioritize, in local", () => {
        let wrapper = shallow(<Choices {...props}/>)
        wrapper.instance().engine = new Engine("[[1],[2]]","[1]");
        const node = "[1]"
        const compareNode = "[2]"
        wrapper.instance().engine.ended = false;
        wrapper.instance().engine.node = node;
        wrapper.instance().engine.compareNode = compareNode;
        let spy = spyOn(wrapper.instance().engine, 'autoChoice').and.returnValue(true);
        let spy2 = spyOn(wrapper.instance(), 'getNextChoice')
        wrapper.instance().checkEnded();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(wrapper.instance().state.leftCard).toEqual(node)
        expect(wrapper.instance().state.rightCard).toEqual(compareNode)
    })

    it("check if prioritization is not ended and cast to all users nextChoices", () => {
        let wrapper = shallow(<Choices {...props}/>)
        wrapper.instance().engine = new Engine("[[1],[2]]","[1]");
        const node = "[1]"
        const compareNode = "[2]"
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        wrapper.instance().room = new Room(socket,roomKey);
        wrapper.instance().engine.ended = false;
        wrapper.instance().engine.node = node;
        wrapper.instance().engine.compareNode = compareNode;
        let spy = spyOn(wrapper.instance().engine, 'autoChoice').and.returnValue(false);
        let spy2 = spyOn(wrapper.instance().room, 'castNextChoice')
        wrapper.instance().checkEnded();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(wrapper.instance().state.leftCard).toEqual(node)
        expect(wrapper.instance().state.rightCard).toEqual(compareNode)
    })

    it("check if prioritization is not ended, cast to all users nextChoices and get next Choice", () => {
        let wrapper = shallow(<Choices {...props}/>)
        wrapper.instance().engine = new Engine("[[1],[2]]","[1]");
        const node = "[1]"
        const compareNode = "[2]"
        const socket = {emit: jest.fn()}
        const roomKey = "123"
        wrapper.instance().room = new Room(socket,roomKey);
        wrapper.instance().engine.ended = false;
        wrapper.instance().engine.node = node;
        wrapper.instance().engine.compareNode = compareNode;
        let spy = spyOn(wrapper.instance().engine, 'autoChoice').and.returnValue(true);
        let spy2 = spyOn(wrapper.instance().room, 'castNextChoice')
        let spy3 = spyOn(wrapper.instance(), 'getNextChoice')
        wrapper.instance().checkEnded();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
        expect(wrapper.instance().state.leftCard).toEqual(node)
        expect(wrapper.instance().state.rightCard).toEqual(compareNode)
    })



});