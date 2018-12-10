import React from "react"
import Authentication from "./components/Authentication.jsx"
import ColumnSelection from "./components/ColumnSelection.jsx"
import Choices from "./components/Choices.jsx"
import ChoicesVoter from "./components/ChoicesVoter.jsx"
import Results from "./components/Results.jsx"
import treeNodeFactory from "./model/treeNodeFactory"
import queryString from "query-string"
import TrelloApi from "./api/TrelloApi"
import GithubApi from "./api/GithubApi"

const AUTHENTICATION_FORM = 1;
const COLUMN_SELECT = 2;
const CHOICES = 3;
const SEND_DATA_TO_SERVER = 4;
const CHOICES_VOTER = 5;

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            BoardApi: new TrelloApi(),
            nodes: Array(),
            rootNode: null,
            currentView: AUTHENTICATION_FORM,
            startTimeStamp: null,// 1-Authentication 2-ColumnSelect 3-Choices 4-SendDataToServer
            boardId: null,
            fromExtension: null,
            extId: null
        };
        this.getCurrentView = this.getCurrentView.bind(this);
        this.setStartTimeStamp = this.setStartTimeStamp.bind(this);
        this.setSortedRootNode = this.setSortedRootNode.bind(this);
        this.setSortedRootNode = this.setSortedRootNode.bind(this);
        this.handleCards = this.handleCards.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        jQuery('.choice_button .card_link').click(function (e) {
            e.stopPropagation();
        });
        const params = queryString.parse(location.search);
        if (params.extId !== undefined) {
            this.setState({
                fromExtension: params.fw === 'g' ? "Github" : "Trello",
                extId: params.extId,
                BoardApi: params.fw === 'g' ? new GithubApi() : new TrelloApi()
            }, function () {
                localStorage.removeItem("code");
                localStorage.setItem('extId', this.state.extId);
                localStorage.setItem('fromExtension', this.state.fromExtension);
                if ((localStorage.getItem("token") !== "undefined" && localStorage.getItem("token") !== null)
                    && this.state.fromExtension === "Github") {
                    this.handleAuthentication()
                }
            })
        }

        if (params.code !== undefined && !localStorage.getItem("code")) {
            console.log("Ho il code");
            let code = window.location.href.match(/\?code=(.*)/)[1];
            this.setState({
                fromExtension: localStorage.getItem("fromExtension"),
                extId: localStorage.getItem("extId"),
                BoardApi: new GithubApi()
            }, function () {
                localStorage.setItem("code", code);
                let fromWhere = this.state.fromExtension === "Github" ? "g" : "t"
                history.pushState(null, null, '/app.html?extId=' + this.state.extId + "&fw=" + fromWhere);
                this.state.BoardApi.authenticate(this.handleAuthentication)
            })
        }

        if(params.fw !== "g"){
            console.log("Entro qui perchè fw è ");
            console.log(params.fw);
            localStorage.setItem("fromExtension","Trello");
        }

        if (params.boardId !== undefined && params.listName !== undefined) {
            alert("Looks like you are using and outdated version of the Sortello Chrome Extension, please update.Thank you!");
        }
    }

    handleAuthentication() {
        const params = queryString.parse(location.search);
        if (params.roomKey !== undefined) {
            this.setState({
                rootNode: [],
                nodes: [],
                currentView: CHOICES_VOTER
            })
        } else {
            this.setState({
                currentView: COLUMN_SELECT
            });
        }
    }

    handleCards(listCards, boardId) {
        let that = this;
        let nodes = [];
        for (let i = 0; i < listCards.length; i++) {
            let node = treeNodeFactory(listCards[i]);
            nodes.push(node);
        }
        this.setState({
            boardId: boardId,
            rootNode: nodes.shift(),
            nodes: nodes,
            currentView: CHOICES
        }, function () {
            that.refs.choices.startChoices();
        })
    }

    setSortedRootNode(rootNode) {
        this.setState({
            rootNode: rootNode,
            currentView: SEND_DATA_TO_SERVER
        })
    }

    setStartTimeStamp(timeStamp) {
        this.setState({
            startTimeStamp: timeStamp
        })
    }

    renderAuthenticationForm() {
        return <Authentication BoardApi={this.state.BoardApi} onAuthentication={this.handleAuthentication}
                               fromExtension={this.state.fromExtension}/>
    }

    renderColumnSelection() {
        return <ColumnSelection BoardApi={this.state.BoardApi} handleCards={this.handleCards}
                                fromExtension={this.state.fromExtension}
                                extId={this.state.extId}/>
    }

    renderChoicesVoter() {
        return (
            <ChoicesVoter BoardApi={this.state.BoardApi}
                          ref="choicesVoter" setSortedRootNode={this.setSortedRootNode}
                          setStartTimeStamp={this.setStartTimeStamp}
                          nodes={this.state.nodes}
                          rootNode={this.state.rootNode}/>
        )
    }

    renderChoices() {
        return (
            <Choices BoardApi={this.state.BoardApi}
                     ref="choices" setSortedRootNode={this.setSortedRootNode}
                     setStartTimeStamp={this.setStartTimeStamp}
                     nodes={this.state.nodes}
                     boardId={this.state.boardId}
                     rootNode={this.state.rootNode}/>
        )
    }

    renderResults() {
        return (
            <Results rootNode={this.state.rootNode} BoardApi={this.state.BoardApi}
                     startTimeStamp={this.state.startTimeStamp}/>
        )
    }

    renderError() {
        return <h3>Error</h3>
    }

    getCurrentView() {
        switch (this.state.currentView) {
            case AUTHENTICATION_FORM:
                return this.renderAuthenticationForm()
            case COLUMN_SELECT:
                return this.renderColumnSelection()
            case CHOICES:
                return this.renderChoices()
            case SEND_DATA_TO_SERVER:
                return this.renderResults()
            case CHOICES_VOTER:
                return this.renderChoicesVoter()
            default:
                return this.renderError()
        }
    }

    render() {
        return (
            <div id="container_div">
                {this.getCurrentView()}
            </div>
        )
    }
}

export default App
