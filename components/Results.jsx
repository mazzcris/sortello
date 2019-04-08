import React from "react"
import Header from './Header.jsx';
import traverseTree from "../model/traverseTree"
import AlmostDoneAnimation from './AlmostDoneAnimation.jsx';
import Recap from './Recap.jsx';
import SuccessAnimation from './SuccessAnimation.jsx';
import Footer from "./Footer.jsx"
import queryString from "query-string";
import CheckBoardButton from './CheckBoardButton.jsx';
import PrioritizeAnotherListButton from './PrioritizeAnotherListButton.jsx';

function openOverlay() {
    document.getElementById('recap-overlay').style.height = "100%";
}

function closeOverlay() {
    document.getElementById('recap-overlay').style.height = "0%";
}


class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {uploadDone: false, duration: null};
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        this.setDuration();
    }

    setDuration() {
        let component = this;
        let start = this.props.startTimeStamp;
        let end = Date.now();
        component.setState({
            duration: end - start
        })
    }

    getReorderedNodes() {
        return traverseTree(this.props.rootNode)
    }

    updateBoard() {
        let component = this;

        function showUploadDone() {
            component.setState({
                uploadDone: true
            })
        }

        let reorderedNodes = this.getReorderedNodes().reverse();
        let putCalls = reorderedNodes.length;
        if (gaTrackingId && this.state.duration !== null) {
            this.sendInfoGa(putCalls);
        }
        let BoardApi = this.props.BoardApi
        let nextCardIndex = 0;

        function placeNextCard() {
            if (nextCardIndex >= reorderedNodes.length) {
                showUploadDone();
                return;
            }
            BoardApi.putCards(reorderedNodes[nextCardIndex].value.id, 'top', placeNextCard, restart)
            nextCardIndex++;
        }

        function restart() {
            nextCardIndex = 0;
            placeNextCard({pos: null});
        }

        placeNextCard({pos: null});
    }

    sendInfoGa(putCalls) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Time stats',
            eventAction: putCalls,
            eventLabel: this.state.duration
        });
    }

    renderCheckBoardButton() {
        let url = "https://github.com/sortello/sortello/projects/2#column-" + this.props.extId;
        if (this.props.BoardApi.getName() === "Trello") {
            url = " https://trello.com/b/" + this.props.rootNode.value.idBoard
        }
        return <CheckBoardButton url={url}
                                 BoardApi={this.props.BoardApi}/>
    }

    renderPrioritizeAnotherListButton(){
        return this.props.BoardApi.getName() === "Trello" && <PrioritizeAnotherListButton/>
    }

    renderUploadDone() {
        return <div className="send-success__container">
            <SuccessAnimation/>
            <div className="send-success__heading">Prioritization complete!</div>
            <div className="success-buttons__container">
                {this.renderCheckBoardButton()}
                {this.renderPrioritizeAnotherListButton()}
            </div>
        </div>
    }

    renderAlmostDone() {
        return <div>
            <AlmostDoneAnimation/>
            <div className="send-ordered__heading">Almost done!</div>
            <div className="send-ordered__button button__primary button__text"
                 onClick={() => this.updateBoard()}>
                <button id="update_board">
                    Send ordered data to your board
                </button>
            </div>

            <div className="overlay-trigger__button button__primary button__text" onClick={() => {
                openOverlay()
            }}>
                <a href="#" className="trigger-button__link">Take a look at your new list</a>
            </div>
            <div className="recap__overlay" id="recap-overlay" onClick={() => {
                closeOverlay()
            }}>
                <div className="recap-overlay__container">
                    <div className="recap-overlay__title">Check it out! This is your new list</div>
                    <Recap cards={this.getReorderedNodes()}/>
                    <div className="button__primary button__text recap-overlay__button"
                         onClick={(e) => this.updateBoard(e)}>
                        <button id="recap_update_board">
                            Send ordered data to your board
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }

    render() {
        return (
            <div className={"send-ordered__wrapper"}>
                <div id="last_div" className={"send-ordered__container"}>
                    <div className={""}>
                        {this.state.uploadDone ? this.renderUploadDone() : this.renderAlmostDone()}
                    </div>
                </div>
                <div className={"footer footer__fade"}>
                    <Footer/>
                    <Header/>
                </div>
            </div>
        )
    }
};

export default Results
