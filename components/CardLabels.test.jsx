import React from "react";
import {shallow} from 'enzyme';
import CardLabels from "./CardLabels.jsx";

describe("CardLabels", () => {
    const cardlabels = (props) => {
        return shallow(
            <CardLabels {...props} />
        );
    }

    it("create CardLabels with correct values",() => {
        let props = {
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
        }
        let wrapper = cardlabels(props)
        expect(wrapper.find("div.card__label").at(0).props().style.backgroundColor).toEqual("#"+props.labels[0].color)
        expect(wrapper.find("div.card__label").at(0).node.key).toEqual((props.labels[0].id).toString());
        expect(wrapper.find("div.card__label").at(0).props().className).toEqual("card__label card__label--"+props.labels[0].color);
        expect(wrapper.find("div.card__label").at(1).props().style.backgroundColor).toEqual("#"+props.labels[1].color)
        expect(wrapper.find("div.card__label").at(1).node.key).toEqual((props.labels[1].id).toString());
        expect(wrapper.find("div.card__label").at(1).props().className).toEqual("card__label card__label--"+props.labels[1].color);

    })


})
