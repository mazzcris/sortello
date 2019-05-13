import React from "react";
import {shallow} from 'enzyme';
import Card from "./Card.jsx";

describe("Card", () => {
    const card = (props) => {
        return shallow(
            <Card {...props} />
        );
    };

    beforeEach(() => {
        jest.mock(
            '../trello',
            () => {
                return {
                    members: {
                        get: jest.fn(() => 42)
                    }
                };
            },
            {virtual: true},
        );
    });

    it("hide votes and continue buttons before everybody in the room voted", () => {
        let props = {
            voters:
                [{
                    voterId: 'voter1',
                    sortelloId: 'voter1',
                    sortelloAvatar: ''
                }, {
                    voterId: 'voter2',
                    sortelloId: 'voter2',
                    sortelloAvatar: ''
                }]
            ,
            data: {
                id: 2,
                shortUrl: "#",
                name: "Right card with some text",
                labels: [
                    {
                        color: "green",
                        name: "Label",
                        id: 3
                    },
                    {
                        color: "yellow",
                        name: "Label",
                        id: 4
                    }
                ]
            },
            everybodyVoted: false,
            handleClick: () => {
            },
        };
        let wrapper = card(props);

        expect(wrapper.find('CardVoters').exists()).toEqual(false);
        expect(wrapper.find('.card-button__continue').exists()).toEqual(false)

    });

    it("shows votes and continue buttons after everybody in the room voted", () => {
        let props = {
            voters:
                [{
                    voterId: 'voter1',
                    sortelloId: 'voter1',
                    sortelloAvatar: ''
                }, {
                    voterId: 'voter2',
                    sortelloId: 'voter2',
                    sortelloAvatar: ''
                }]
            ,
            data: {
                id: 2,
                shortUrl: "#",
                name: "Right card with some text",
                labels: [
                    {
                        color: "green",
                        name: "Label",
                        id: 3
                    },
                    {
                        color: "yellow",
                        name: "Label",
                        id: 4
                    }
                ]
            },
            everybodyVoted: true,
            handleClick: () => {
            },
        };
        let wrapper = card(props);

        expect(wrapper.find('CardVoters').exists()).toEqual(true);
        expect(wrapper.find('CardVoters').props().voters).toEqual(props.voters);
        expect(wrapper.find('CardButtons').props().continueButton).not.toBe(null)
    });

    it("show CardButtons when needed", () => {
        let props = {
            voters:
                [{
                    voterId: 'voter1',
                    sortelloId: 'voter1',
                    sortelloAvatar: ''
                }, {
                    voterId: 'voter2',
                    sortelloId: 'voter2',
                    sortelloAvatar: ''
                }]
            ,
            data: {
                id: 2,
                shortUrl: "#",
                name: "Right card with some text",
                labels: [
                    {
                        color: "green",
                        name: "Label",
                        id: 3
                    },
                    {
                        color: "yellow",
                        name: "Label",
                        id: 4
                    }
                ]
            },
            everybodyVoted: true,
            forget: "forget",
            handleClick: () => {
            },
        };

        let wrapper = card(props);
        expect(wrapper.find('CardButtons')).toBeTruthy();
    });

    it("upgrade className of a div when is selected", () => {
        let props = {
            voters:
                [{
                    voterId: 'voter1',
                    sortelloId: 'voter1',
                    sortelloAvatar: ''
                }, {
                    voterId: 'voter2',
                    sortelloId: 'voter2',
                    sortelloAvatar: ''
                }]
            ,
            data: {
                id: 2,
                shortUrl: "#",
                name: "Right card with some text",
                labels: [
                    {
                        color: "green",
                        name: "Label",
                        id: 3
                    },
                    {
                        color: "yellow",
                        name: "Label",
                        id: 4
                    }
                ]
            },
            everybodyVoted: true,
            selected : true,
            handleClick: () => {
            },
        };

        let wrapper = card(props);
        expect(wrapper.find("div").at(1).props().className).toEqual("container__card container__card-selected")
    });

    it("don't upgrade className of a div when isn't selected", () => {
        let props = {
            voters:
                [{
                    voterId: 'voter1',
                    sortelloId: 'voter1',
                    sortelloAvatar: ''
                }, {
                    voterId: 'voter2',
                    sortelloId: 'voter2',
                    sortelloAvatar: ''
                }]
            ,
            data: {
                id: 2,
                shortUrl: "#",
                name: "Right card with some text",
                labels: [
                    {
                        color: "green",
                        name: "Label",
                        id: 3
                    },
                    {
                        color: "yellow",
                        name: "Label",
                        id: 4
                    }
                ]
            },
            everybodyVoted: true,
            selected : false,
            handleClick: () => {
            },
        };

        let wrapper = card(props);
        expect(wrapper.find("div").at(1).props().className).toEqual("container__card ")
    });

    it("check if other components are created with correct values", () => {
        let props = {
            voters:
                [{
                    voterId: 'voter1',
                    sortelloId: 'voter1',
                    sortelloAvatar: ''
                }, {
                    voterId: 'voter2',
                    sortelloId: 'voter2',
                    sortelloAvatar: ''
                }]
            ,
            data: {
                id: 2,
                shortUrl: "#",
                name: "Right card with some text",
                labels: [
                    {
                        color: "green",
                        name: "Label",
                        id: 3
                    },
                    {
                        color: "yellow",
                        name: "Label",
                        id: 4
                    }
                ]
            },
            everybodyVoted: true,
            forget : true,
            side : "side",
            handleClick: () => {
            },
        };

        let wrapper = card(props);
        expect(wrapper.find("CardLabels").props().labels).toHaveLength(2);
        expect(wrapper.find("CardLabels").props().labels).toEqual(props.data.labels);
        expect(wrapper.find("CardVoters").props().voters).toHaveLength(2);
        expect(wrapper.find("CardVoters").props().voters).toEqual(props.voters);
        expect(wrapper.find("CardButtons").props().everybodyVoted).toEqual(props.everybodyVoted);
        expect(wrapper.find("CardButtons").props().side).toEqual(props.side);
        expect(wrapper.find("CardButtons").props().data).toEqual(props.data);
        expect(wrapper.find("CardButtons").props().forget).toEqual(props.forget);
    })

});