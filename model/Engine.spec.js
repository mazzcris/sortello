import Engine from "./Engine"
import {shuffle} from "lodash"

describe('Engine', () => {
    it("receives correct listNode and rootNode on constructor", () => {
        const engine = new Engine("listNodes", "rootNode");
        expect(engine.listNodes).toEqual("listNodes");
        expect(engine.rootNode).toEqual("rootNode");
    })

    it("resets to initial state", () => {
        const engine = new Engine("listNodes", "rootNode");
        engine.compareNode = "1"
        engine.listNodes = "1"
        engine.rootNode = "1"
        engine.node = "1"
        engine.blacklist = ["1","2","3","4"]
        engine.replay = ["1","2","3","4"]
        engine.resetToInitialState();
        expect(engine.compareNode).toEqual(null);
        expect(engine.listNodes).toEqual("listNodes");
        expect(engine.rootNode).toEqual("rootNode");
        expect(engine.blackList).toHaveLength(0);
        expect(engine.replay).toHaveLength(0);
    })

    it("ends if there are no more steps to do", () => {
        const engine = new Engine([], "rootNode");
        engine.nextStepOrEnd();
        expect(engine.ended).toBeTruthy();
        const engine2 = new Engine ("listNodes","rootNode");
        let spy = spyOn(engine2,'goToNextStep').and.returnValue(42);
        engine2.nextStepOrEnd();
        expect(spy).toHaveBeenCalled();

    })

    it("takes the next node if the listNode isn't empty ", () => {
        const engine = new Engine("listNodes", "rootNode");
        spyOn(engine,'getNextNode')
        engine.goToNextStep();
        expect(engine.compareNode).toBe("rootNode");
    })

    it("adds to blackList", () => {
        const engine = new Engine("listNodes", "rootNode");
        engine.addToBlackList("1");
        engine.addToBlackList("2");
        expect(engine.blackList).toHaveLength(2);
    })

    it("chooses if go left or right to the binary tree ", () => {
        const engine = new Engine("listNodes", "rootNode");
        engine.node = ["1"];
        let spy = spyOn(engine,'goLeft').and.returnValue(42);
        let spy2 = spyOn(engine,'addToHistory').and.returnValue(42);
        engine.choiceMade("node","source")
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        let spy3 = spyOn(engine,'goRight').and.returnValue(42);
        engine.choiceMade("compareNode","source")
        expect(spy3).toHaveBeenCalled();
    })

})