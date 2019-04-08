import React from "react";
import {shallow} from 'enzyme';
import ChoicesView from "./ChoicesView";

describe("ChoicesView", () => {
    let props = {
        role : null,
    }

    it("renders informations about voter", () => {
        props.role = "voter";
        let wrapper = shallow(<ChoicesView {...props}/>)
        wrapper.instance().renderVoterInfo()
        expect(wrapper.find("div.voter-info__dot")).toBeTruthy();
    });

});