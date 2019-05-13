import treeRebalancer from "../model/treeRebalancer";
import {clone} from "lodash"

class Engine {

    constructor (listNodes, rootNode) {
        this.listNodes = listNodes;
        this.rootNode = rootNode;
        this.compareNode = null
        this.node = null
        this.blackList = []
        this.replay = []
        window.actionsHistory = []
        this.ended = false
        this.initialState = {
            listNodes: clone(listNodes),
            rootNode: clone(rootNode),
            compareNode: null,
            node: null,
            blackList: [],
            replay: []
        }
    }

    resetToInitialState () {
        this.listNodes = clone(this.initialState.listNodes);
        this.rootNode = clone(this.initialState.rootNode);
        this.compareNode = clone(this.initialState.compareNode);
        this.node = clone(this.initialState.node);
        this.blackList = clone(this.initialState.blackList);
        this.replay = clone(this.initialState.replay);
    }

    getEnded () {
        return this.ended;
    }

    nextStepOrEnd () {
        if (!this.noMoreSteps()) {
            this.goToNextStep();
        } else {
            this.ended = true;
        }
    }

    choiceMade (target, source) {
        if (target === 'node') {
            this.goLeft()
        }

        else if (target === 'compareNode') {
            this.goRight()
        }

        if (this.node.isPositioned) {
            this.rebalanceTree();
            this.nextStepOrEnd();
        }

        this.addToHistory({p: target, s: source})

    }

    popWithAutochoices () {
        let previousAction = window.actionsHistory.pop();
        while (previousAction.s === "auto") {
            previousAction = window.actionsHistory.pop();
        }
    }

    getActionsHistory () {
        return window.actionsHistory
    }

    clearActionsHistory () {
        window.actionsHistory = []
    }

    addToHistory (item) {
        window.actionsHistory.push(item)
    }

    noMoreSteps () {
        return this.listNodes.length === 0;
    }

    goToNextStep () {
        if (0 < this.listNodes.length) {
            this.compareNode = this.rootNode
            this.node = this.getNextNode();
        }
    }

    goLeft () {
        this.compareNode = this.node.goLeft(this.compareNode);
    }

    goRight () {
        this.compareNode = this.node.goRight(this.compareNode);
    }

    setReplay () {
        this.replay = clone(window.actionsHistory);
    }

    getReplay () {
        return this.replay
    }

    getNextReplayAction () {
        return this.replay.shift()
    }

    autoChoice () {
        if (this.replay.length > 0) {
            const nextAction = this.getNextReplayAction()
            this.choiceMade(nextAction.p, nextAction.s)
            return true
        } else {
            if (this.nodeIsBlackListed()) {
                this.choiceMade("compareNode", "auto")
                return true
            }
            else if (this.compareNodeIsBlackListed()) {
                this.choiceMade("node", "auto");
                return true
            }
        }
        return false
    }

    undo () {
        this.resetToInitialState();
        if (this.getActionsHistory().length > 0) {
            this.popWithAutochoices()
            this.setReplay()
            this.clearPositioned()
            this.clearActionsHistory()
        }
        this.nextStepOrEnd();
    }

    addToBlackList (nodeId) {
        this.blackList.push(nodeId);
    }

    nodeIsBlackListed () {
        return this.blackList.indexOf(this.node.value.id) > -1
    }

    compareNodeIsBlackListed () {
        return this.blackList.indexOf(this.compareNode.value.id) > -1
    }

    getListNodes () {
        return this.listNodes;
    }

    getRootNode () {
        return this.rootNode;
    }

    getNode () {
        return this.node;
    }

    getNextNode () {
        return this.listNodes.shift();
    }

    getCompareNode () {
        return this.compareNode
    }

    clearPositioned () {
        for (let i = 0; i < this.listNodes.length; i++) {
            this.listNodes[i].isPositioned = false;
        }
    }

    rebalanceTree () {
        this.rootNode = treeRebalancer(this.rootNode);
    }

}

export default Engine;