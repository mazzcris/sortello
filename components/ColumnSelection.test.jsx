import React from "react";
import ColumnSelection from "./ColumnSelection.jsx";
import TrelloApi from "../api/TrelloApi";
import {shallow} from 'enzyme';

describe("ColumnSelection", () => {
    let props = {
        BoardApi: new TrelloApi(),
        fromExtension: "Trello"
    }

    it("clicks proceedButton instantly if user use Sortello from Extension and labels of the list are 0", () => {
        let wrapper = shallow(<ColumnSelection {...props}/>);
        let spy = spyOn(wrapper.instance(), 'labelSelected');
        wrapper.instance().state.labels = [];
        wrapper.instance().clickProceedButtonIfLabelsAreZero();
        expect(spy).toHaveBeenCalled();
    });

    it("not click proceedButton instantly if user use Sortello normally or labels of the list are more than 0", () => {
        let wrapper = shallow(<ColumnSelection {...props}/>);
        let spy = spyOn(wrapper.instance(), 'labelSelected');
        wrapper.instance().state.labels = [];
        wrapper.instance().clickProceedButtonIfLabelsAreZero();
        expect(spy).toHaveBeenCalled();
    });

    it("updates selectedList, lists and selectedLabel when Board is clicked", () =>{
        let wrapper = shallow(<ColumnSelection {...props}/>);
        wrapper.instance().state.selectedList = 0;
        wrapper.instance().state.selectedLabel = 0;
        wrapper.instance().state.lists = [0,1,2];
        wrapper.instance().handleBoardClicked("boardId");
        expect(wrapper.instance().state.selectedList).toBe(0);
        expect(wrapper.instance().state.selectedLabel).toBe(null);
        expect(wrapper.instance().state.lists.length).toBe(0)
    })

    it("updates selectedList and selectedLabel when List is clicked", () =>{
        let wrapper = shallow(<ColumnSelection {...props}/>);
        wrapper.instance().state.selectedList = 0;
        wrapper.instance().state.selectedLabel = 0;
        wrapper.instance().handleListClicked("listId");
        expect(wrapper.instance().state.selectedList).toBe(false);
        expect(wrapper.instance().state.selectedLabel).toBe(null);
    })

    it("checks if the list has 0 or 1 card", () =>{
        let wrapper = shallow(<ColumnSelection {...props}/>);
        wrapper.instance().state.selectedLabel = 0;
        wrapper.instance().state.listCards = [];
        wrapper.instance().handleProceedButtonClicked();
        expect(wrapper.instance().state.hasNotEnoughCard).toBe(true);
    })
});