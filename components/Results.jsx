import React from "react"
import Header from './Header.jsx';
import traverseTree from "../model/traverseTree"
import AlmostDoneAnimation from './AlmostDoneAnimation.jsx';
import Recap from './Recap.jsx';
import SuccessAnimation from './SuccessAnimation.jsx';
import Footer from "./Footer.jsx"



const Results = React.createClass({
  getInitialState: function () {
    return {uploadDone: false, duration: null};
  },
  componentDidUpdate () {
    this.props.centerContent();
  },
  componentDidMount () {
    this.props.centerContent();
    this.setDuration();
  },
  setDuration: function () {
    var component = this;
    let start = this.props.startTimeStamp
    let end = Date.now()
    component.setState({
      duration: end - start
    })
  },
  getReorderedNodes: function(){
    return traverseTree(this.props.rootNode)
  },
  updateBoard: function () {
    var component = this;

    function showUploadDone () {
      component.setState({
        uploadDone: true
      })
    }

    var reorderedNodes = this.getReorderedNodes();
    var putCalls = reorderedNodes.length;
    if (gaTrackingId && this.state.duration !== null) {
      console.log('Finished in ' + this.state.duration + ' ms with ' + putCalls + ' cards');
      ga('send', {
        hitType: 'event',
        eventCategory: 'Time stats',
        eventAction: putCalls,
        eventLabel: this.state.duration
      });
    }
    var Trello = this.props.Trello;

    let j=0;

    function placeNextCard(previousPlacedData){
      // console.log(previousPlacedData.pos);
      const nextCardIndex = ++j;
      if(nextCardIndex >= reorderedNodes.length){
        showUploadDone();
        return;
      }
      Trello.put('/cards/' + reorderedNodes[j].value.id, {pos: 'bottom'}, placeNextCard, restart);
    }

    function restart(){
      j=0;
      placeNextCard({pos: null});
    }

    placeNextCard({pos: null});
  },
  render: function () {
    return (
        <div className={"send-ordered__wrapper"}>
          <div id="last_div" className={"send-ordered__container"}>
            <div className={""}>
              {this.state.uploadDone ?
                    <div className="send-success__container">
                      <SuccessAnimation/>
                      <div className="send-success__heading">Prioritization complete!</div>
                      <div className="success-buttons__container">
                          <a href={"https://trello.com/b/" + this.props.rootNode.value.idBoard} target="_blank"
                             className={"button__primary button__text check-trello__button"}>
                            <i className="fa fa-trello"></i>&nbsp;
                            Check your Trello board
                          </a>
                          <a href="/" className={"button__primary button__text prioritize-again__button"}>
                            <i className="fa fa-repeat"></i>&nbsp;
                            Prioritize another list
                          </a>
                      </div>
                    </div>
                    : 
                    <div>
                      <AlmostDoneAnimation />
                      <div className="send-ordered__heading">Almost done!</div>
                      <div className="send-ordered__button button__primary button__text">
                        <button id="update_board" onClick={this.updateBoard}>
                          Send ordered data to your board
                        </button>
                      </div>
                      <Recap cards={this.getReorderedNodes()}></Recap>
                    </div>
              }
            </div>
          </div>
        <div className={"footer results__footer"}>
            <Footer/>
        </div>
        </div>
    )
  }
})

export default Results
