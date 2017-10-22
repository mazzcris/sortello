import React from "react";
import Header from './Header.jsx';
import TreeDraw from './TreeDraw.jsx';
import Card from './Card.jsx';
import treeRebalancer from "../model/treeRebalancer";
import Footer from "./Footer.jsx"
import {clone} from "lodash"

class Choices extends React.Component{
  constructor(props) {
    super(props);
    this.state = this.getInitialState()
    this.componentDidMount = this.componentDidMount.bind(this)
    this.autoChoice = this.autoChoice.bind(this)
    this.handleCardClicked = this.handleCardClicked.bind(this)
    this.cardClicked = this.cardClicked.bind(this)
    this.addToBlacklist = this.addToBlacklist.bind(this)
    this.popWithAutochoices = this.popWithAutochoices.bind(this)
    this.endChoices = this.endChoices.bind(this)
    this.executeReplay = this.executeReplay.bind(this)
    this.toTheNextStep = this.toTheNextStep.bind(this)
    this.clearPositioned = this.clearPositioned.bind(this)
    this.setReplay = this.setReplay.bind(this)
    this.undo = this.undo.bind(this)
    this.clearPositioned = this.clearPositioned.bind(this)
    this.nextStepOrEnd = this.nextStepOrEnd.bind(this)
    this.startChoices = this.startChoices.bind(this)
  }
  getInitialState () {
    return {
      Trello: clone(this.props.Trello),
      leftCard: null,
      rightCard: null,
      progress: 0,
      listNodes: clone(this.props.nodes),
      rootNode: clone(this.props.rootNode),
      blacklist: [], // the nodes to position in the tree
      node: null,
      compareNode: null,
      replay: []
    }
  }
  componentDidMount () {
    window.actionsHistory = [];
  }
  endChoices () {
    this.props.setSortedRootNode(this.state.rootNode);
  }
  executeReplay () {
    const nextAction = this.state.replay.shift();
    this.setState({
      replay: this.state.replay
    }, function () {
      nextAction.f(nextAction.p);
    })
  }
  autoChoice () { // Auto-click forgotten card
    if (this.state.replay.length > 0) {
      this.executeReplay();
    } else {
      if (this.state.blacklist.indexOf(this.state.leftCard.value.id) > -1) {
        this.cardClicked("right", "auto");
      }
      else if (this.state.blacklist.indexOf(this.state.rightCard.value.id) > -1) {
        this.cardClicked("left", "auto");
      }
    }
  }
  addToBlacklist (nodeId) {
    let bl = this.state.blacklist;
    bl.push(nodeId);
    this.setState({
      blacklist: bl
    }, function () {
      // window.actionsHistory.push({f: this.addToBlacklist, p: nodeId})
      this.autoChoice();
    });
  }
  handleCardClicked (side) {
    if (this.state.replay.length === 0) {
      this.cardClicked(side, "human");
    }
  }
  cardClicked (side, source) {
    let compareNode;
    if ("left" == side) {
      compareNode = this.state.node.goLeft(this.state.compareNode);
    }
    else if ("right" == side) {
      compareNode = this.state.node.goRight(this.state.compareNode);
    }
    this.setState({
      compareNode: compareNode,
      node: this.state.node
    }, function () {
      window.actionsHistory.push({f: this.cardClicked, p: side, s: source})
      this.handleCardPositioned();
    });
  }
  toTheNextStep () {
    this.setState({
      rootNode: treeRebalancer(this.state.rootNode),
      progress: Math.round(((100 * (this.props.nodes.length - this.state.listNodes.length)) / (this.props.nodes.length)))
    }, function () {
      this.nextStepOrEnd();
    });
  }
  handleCardPositioned () {
    if (this.state.node.isPositioned) {
      this.toTheNextStep();
    } else {
      this.getNextChoice();
    }
  }
  nextStepOrEnd () {
    if (0 < this.state.listNodes.length) {
      this.setState({
        node: this.state.listNodes.shift(),
        compareNode: this.state.rootNode,
        listNodes: this.state.listNodes
      }, function () {
        this.getNextChoice();
      });
    } else {
      this.endChoices();
    }
  }
  getNextChoice () {
    this.setState({
      leftCard: this.state.node,
      rightCard: this.state.compareNode
    }, function () {
      this.autoChoice();
    });
  }
  startChoices () {
    this.props.setStartTimeStamp(Date.now())
    this.nextStepOrEnd();
  }
  clearPositioned (cb) {
    let nodes = this.state.listNodes;
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].isPositioned = false;
    }
    this.setState({
      listNodes: nodes
    }, cb());
  }
  popWithAutochoices () {
    let previousAction = window.actionsHistory.pop();
    while (previousAction.s === "auto") {
      previousAction = window.actionsHistory.pop();
    }
  }
  setReplay () {
    this.popWithAutochoices();
    // window.actionsHistory.pop();
    let comp = this;
    this.setState({
      replay: clone(window.actionsHistory)
    }, function () {
      comp.clearPositioned(function () {
        window.actionsHistory = [];
        comp.nextStepOrEnd();
      });
    })
  }
  undo () {
    if (window.actionsHistory.length > 0) {

      let bl = this.state.blacklist;
      this.setState(this.getInitialState(), function () {
        this.setState({
          blacklist: bl
        }, function () {
          this.setReplay()
        });
      });
    }
  }
  render () {
    if (this.state.leftCard == null || this.state.rightCard == null) {
      return (<span>Loading...</span>);
    }
    return (
      <div id="second_div">
        <div className="container__prioritization-status">
          <div className="text__prioritization-status">Prioritization progress</div>
          <div className={"progressive-bar__status-structure"}>
            <div className={"progressive-bar__status"} role="progressbar" aria-valuenow={this.state.progress}
                 aria-valuemin="0"
                 aria-valuemax="100" style={{width: this.state.progress + '%'}}>
            </div>
          </div>
        </div>
        <div className="container__choose-card">
          <div className="choose-card__heading">Select the highest priority card</div>
          <Card id="left_button" side="left" handleClick={this.handleCardClicked}
                forget={this.addToBlacklist} data={this.state.leftCard.value}/>
          <Card id="right_button" side="right" handleClick={this.handleCardClicked}
                forget={this.addToBlacklist} data={this.state.rightCard.value}/>
          {/*<TreeDraw tree={this.state.rootNode}></TreeDraw>*/}

          <button onClick={() => this.undo()} id="undo_button" className="normalize__undo-button">
            <div className="undo__button">
              <div className="undo__icon">
                <img src="assets/icons/undo-icon.svg" alt=""/>
                Undo choice
              </div>
            </div>

          </button>

        </div>
        <div className={"logout__button"}>
          <Header/>
        </div>
        <div className={"footer"}>
          <Footer/>
        </div>

      </div>
    )
  }
}

export default Choices
