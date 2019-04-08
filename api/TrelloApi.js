class TrelloApi {

    putCards(cardId, pos, success, error) {
        Trello.put('/cards/' + cardId, {pos: pos}, success, error);
    }

    getMembers(memberId, params, success, error) {
        Trello.members.get(memberId, params, success, error);
    }

    getBoard(boardId, success, error) {
        Trello.boards.get(boardId, success, error);
    }

    getCardById(extId, variable, success) {
        Trello.cards.get(extId, variable, success);
    }

    getCardsByListId(listId, cards, success, error) {
        let component = this;
        Trello.lists.get(listId, cards, function (data) {
            success(component.normalizeCards(data.cards))
        }, error);
    }

    normalizeCards(cards) {
        let component = this;
        let listlabels = [];
        for (var i = 0; i < cards.length; i++) {
            let data = {
                id: cards[i].id,
                idList: cards[i].idList,
                idBoard: cards[i].idBoard,
                labels: cards[i].labels,
                name: cards[i].name,
                pos: cards[i].pos,
                shortUrl: cards[i].shortUrl
            }
            listlabels.push(data)
        }
        return listlabels
    }


    setKey(apiKey) {
        Trello.setKey(apiKey);
    }

    authorize(params, expiration, success, error) {
        Trello.authorize(params, expiration, success, error);
    }

    authenticate(onAuthenticationSuccess) {
        var component = this;
        component.setKey(trelloApiKey); // from parameters.js
        component.authorize({
            type: 'popup',
            name: 'Sortello',
            scope: {
                read: 'true',
                write: 'true'
            },
            expiration: 'never',
            success: onAuthenticationSuccess,
            error: console.log("Failed authentication")
        });
    }

    getName() {
        return "Trello";
    }

    getIcon() {
        return "fa fa-trello"
    }
}

export default TrelloApi;