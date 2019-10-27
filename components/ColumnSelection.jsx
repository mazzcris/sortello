import React from "react"
import {find} from "lodash"
import Header from './Header.jsx';
import BoardSelector from './BoardSelector.jsx'
import ListSelector from './ListSelector.jsx'
import LabelSelector from './LabelSelector.jsx'
import Footer from "./Footer.jsx"
import NoAccessBoard from './NoAccessBoard.jsx';

class ColumnSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boards: [],
            lists: [],
            labels: [],
            groupedboards: [],
            organizations: [],
            noCardsError: false,
            boardId: null,
            hasBoardPermissions: null,
        };
        this.getBoardColumns = this.getBoardColumns.bind(this);
        this.retrieveCardsByListId = this.retrieveCardsByListId.bind(this);
        this.handleBoardClicked = this.handleBoardClicked.bind(this);
        this.handleListClicked = this.handleListClicked.bind(this);
        this.labelSelected = this.labelSelected.bind(this);
        this.getBoards = this.getBoards.bind(this);
        this.renderForbidden = this.renderForbidden.bind(this);
    }

    componentDidMount () {
        let component = this;
        let BoardApi = this.props.BoardApi;
        localStorage.removeItem("extId");
        localStorage.removeItem("fromExtension");
        if (component.props.fromExtension !== null) {
            if (component.props.BoardApi.getName() !== "Github") {
                BoardApi.getCardById(component.props.extId, null, function (card) {
                    component.retrieveCardsByListId(card.idList)
                }, function () {
                    component.setState({
                        hasBoardPermissions: false
                    })
                })
            } else {
                component.props.BoardApi.checkPermissions(component.props.extId).then(function(res){
                    component.retrieveCardsByListId(component.props.extId)
                }, function () {
                    component.setState({
                        hasBoardPermissions: false
                    })
                })
            }
        }

        if (this.state.organizations.length > 0) {
            return;
        }
        this.getBoards()
    }

    getBoards () {
        let component = this;
        let BoardApi = this.props.BoardApi;
        BoardApi.getMembers('me', {
            organizations: "all",
            organization_fields: "all",
            boards: "open",
            board_lists: "open"
        }, function (data) {
            let boardGroups = [];
            let boards = data.boards;
            let organizations = data.organizations;
            for (let i = 0; i < boards.length; i++) {
                let organization = find(organizations, { 'id': boards[i].idOrganization });
                let groupName = "Other";
                if (organization !== undefined) {
                    groupName = organization.displayName;
                }
                if (!boardGroups[groupName]) {
                    boardGroups[groupName] = [];
                }
                boardGroups[groupName].push(boards[i]);
            }
            component.setState({
                boards: boards,
                groupedboards: boardGroups,
                organizations: organizations
            })
        }, function (e) {
            console.log(e);
        });
    }

    labelSelected(labelId) {
        let listCards = this.state.listCards;
        if (labelId !== 0) {
            let label = find(this.state.labels, { 'id': labelId });
            listCards = _.filter(this.state.listCards, function (card) {
                return find(card.labels, { 'id': label.id }) !== undefined;
            });
        }
        if (listCards.length === 0) {
            this.setState({
                labels: [],
                noCardsError: true
            })
        } else {
            this.props.handleCards(listCards, this.state.boardId);
        }
    }

    retrieveCardsByListId(listId) {
        let that = this;
        let labels = [];
        this.props.BoardApi.getCardsByListId(listId, {cards: "open"}, function (data,html_url) {
            let listCards = data;
            that.setState({
                listCards: listCards
            });
            // Display an error message if current list contains no cards
            if (listCards.length === 0) {
                that.setState({
                    labels: [],
                    noCardsError: true
                })
            } else {
                listCards.forEach(function (card) {
                    card.labels.forEach(function (label) {
                        if (find(labels, { 'id': label.id }) === undefined) {
                            labels.push(label);
                        }
                    });
                });
                that.setState({
                    labels: labels,
                    boardId: data[0].idBoard
                }, function () {
                    this.props.setUrl(html_url);
                    if (that.state.labels.length === 0) {
                        that.labelSelected(0)
                    }
                });
            }
        }, function (e) {
            console.log(e);
        });
    }

    getBoardColumns(board) {
        this.setState({
            lists: board.lists
        });
    }

    handleBoardClicked(boardId) {
        const currentBoardId = this.state.boardId;

        if (boardId !== currentBoardId) {
            this.setState({
                boardId,
                labels: [],
                noCardsError: false,
            });
            let board = find(this.state.boards, { 'id': boardId });
            this.getBoardColumns(board)
        }
    }

    handleListClicked(listId) {
        this.setState({
            noCardsError: false,
        });

        // If list does not exist, reset all labels (it means we have clicked the 'Select List' entry)
        let list = find(this.state.lists, { 'id': listId });
        if (list) {
            this.retrieveCardsByListId(list.id);
        } else {
            this.setState({
                labels: [],
            })
        }
    }

    renderForbidden(){
        return (
            <div>
                <NoAccessBoard/>
            </div>
        )
    }

    renderBoardSelector () {
        if (this.props.fromExtension !== null) {
            return ""
        }
        return <BoardSelector groupedboards={this.state.groupedboards}
            onChange={this.handleBoardClicked} />
    }

    renderListSelector () {
        if (this.state.lists.length === 0 || this.props.fromExtension !== null) {
            return ""
        }
        return <p><ListSelector lists={this.state.lists}
            onChange={this.handleListClicked} /></p>
    }

    renderLabelSelector() {
        if (this.state.labels.length === 0) {
            return ""
        }
        return <LabelSelector labels={this.state.labels} onClick={this.labelSelected} />
    }

    render() {
        if (this.state.hasBoardPermissions === false) {
            return this.renderForbidden();
        }
        return (
            <div id="card_url_div">
                <div className="selection__wrapper">
                    <div className="selection__container selection__container--animation">
                        <div className="select-list--text-container selection__heading">
                            {
                                (this.props.fromExtension !== null) ?
                                    "Filter by label, or select All" :
                                    "First of all, select the board you want to prioritize"
                            }
                        </div>
                        {this.renderBoardSelector()}
                        {this.renderListSelector()}
                        {this.renderLabelSelector()}

                        {
                            (this.state.noCardsError === true) ?
                                "There are no cards for the selected list! Try choosing another one" :
                                ""
                        }
                    </div>
                    <div className={"footer footer--animated"}>
                        <Footer />
                        <Header />
                    </div>
                </div>
            </div>
        )
    }
}

export default ColumnSelection
