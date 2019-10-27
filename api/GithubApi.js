import queryString from "query-string";

class GithubApi {

    authenticate(onAuthenticationSuccess) {
        if (localStorage.getItem("code") === null) {
            window.location = "https://github.com/login/oauth/authorize?scope=public_repo&client_id=" + clientId;
        } else {
            $.getJSON('http://localhost:9999/authenticate/' + window.localStorage.getItem("code"), function (data) {
                localStorage.removeItem("code")
                localStorage.setItem("token", data.token)
                const url = "https://api.github.com/user?access_token=" + data.token;
                fetch(url)
                    .then((resp) => resp.json())
                    .then(function (data) {
                        onAuthenticationSuccess()
                    });
            });
        }
    }

    checkPermissions(externId) {
        let data = {
            projectCreator : null,
            projectName : null,
            connectedUser : null,
            userPermission : null
        }
        const uri = "https://api.github.com/projects/columns/" + externId;
        let h = new Headers();
        h.append("Accept", "application/vnd.github.inertia-preview+json");
        h.append("Accept", "application/vnd.github.hellcat-preview+json");
        h.append("Authorization", "token " + localStorage.getItem("token"));
        let url = new Request(uri, {
            method: "GET",
            headers: h
        })
        return fetch(url)
            .then((resp) => resp.json())
            .then((idColumnData) => {
                if(idColumnData.project_url === undefined){
                    return false;
                }
                const uri2 = idColumnData.project_url
                let url2 = new Request(uri2, {
                    method: "GET",
                    headers: h
                })
                return fetch(url2)
            })
            .then((resp) => resp.json())
            .then((projectData) => {
                data.projectName = projectData.name;
                data.projectCreator = projectData.creator.login;
                return this.getInfoUser(h);
            })
            .then((resp) => resp.json())
            .then((dataUserConnected) => {
                data.connectedUser = dataUserConnected.login;
                const uri4 = "https://api.github.com/repos/" + data.projectCreator + "/" + data.projectName + "/collaborators/" + data.connectedUser + "/permission"
                let url4 = new Request(uri4, {
                    method: "GET",
                    headers: h
                })
                return fetch(url4)
            })
            .then((resp) => resp.json())
            .then((dataPermissions) => {
                data.userPermission = dataPermissions.permission;
                if(data.userPermission === "write" || data.userPermission === "admin"){
                    return true;
                }else{
                    return false;
                }
            })
    }

    getInfoUser(h){
        const uri3 = "https://api.github.com/user";
        let url3 = new Request(uri3, {
            method: "GET",
            headers: h
        })
        return fetch(url3);
    }

    getCardsByListId(externId, variable, success) {
        let component = this
        let allCards = null
        const uri = "https://api.github.com/projects/columns/" + externId + "/cards"
        let h = new Headers();
        h.append("Accept", "application/vnd.github.inertia-preview+json");
        h.append("Authorization", "token " + localStorage.getItem("token"));
        let url = new Request(uri, {
            method: "GET",
            headers: h
        })
        fetch(url)
            .then((resp) => resp.json())
            .then((cards) => {
                allCards = cards
                const uri2 = "https://api.github.com/projects/columns/" + externId
                let url2 = new Request(uri2, {
                    method: "GET",
                    headers: h
                })
                return fetch(url2)
            })
            .then((resp) => resp.json())
            .then((projectData) => {
                const uri3 = projectData.project_url
                let url3 = new Request(uri3, {
                    method: "GET",
                    headers: h
                })
                return fetch(url3)
            })
            .then((resp) => resp.json())
            .then((data3) => {
                let htmlUrlProject = data3.html_url;
                let normalizedCards = component.normalizeCards(allCards, data3.html_url);
                component.getIssues(normalizedCards).then(function (cards) {
                    success(cards, htmlUrlProject)
                })
            })
    }

    normalizeCards(cards, html_url) {
        let listCards = [];
        for (let i = 0; i < cards.length; i++) {
            listCards.push({
                id: cards[i].id,
                idList: null,
                idBoard: null,
                labels: [],
                name: cards[i].note,
                pos: null,
                content_url: cards[i].content_url === undefined ? null : cards[i].content_url,
                shortUrl: cards[i].content_url !== undefined ? cards[i].content_url.replace("//api.", "//").replace("/repos/", "/") : html_url + "#card-" + cards[i].id
            })
        }
        return listCards
    }

    getIssues(normalizedCards) {
        let promises = []
        for (let i = 0; i < normalizedCards.length; i++) {
            let card = normalizedCards[i]
            if (card.content_url !== null) {
                let uri = card.content_url
                let h = new Headers();
                h.append("Accept", "application/vnd.github.inertia-preview+json");
                h.append("Authorization", "token " + localStorage.getItem("token"));
                let url = new Request(uri, {
                    method: "GET",
                    headers: h
                })
                promises.push(fetch(url)
                    .then(function (resp) {
                        return resp.json()
                            .then(function (data) {
                                card.name = data.title,
                                    card.labels = data.labels
                                return card
                            })
                    }))
            } else {
                promises.push(Promise.resolve(card))
            }
        }
        return Promise.all(promises)
    }

    getMembers(memberId, params, success, error) {
        let h = new Headers();
        h.append("Accept", "application/vnd.github.inertia-preview+json");
        h.append("Authorization", "token " + localStorage.getItem("token"));
        this.getInfoUser(h).then(function (resp) {
            return resp.json()
                .then(function (data) {
                    return success(data);
                })
        })
    }

    normalizeData(data){
        return {
            id: data.id,
            avatar: data.avatar_url,
            gravatar: data.gravatar_id,
        }
    }

    getBoard(boardId, success, error) {
        let param = queryString.parse(location.search);
        this.checkPermissions(param.extId).then(function (res) {
            if(res) {
                return success();
            }
        },function(e){
            console.log(e);
            return error();
        })
    }

    putCards(cardId, pos, success, error) {
        const uri = "https://api.github.com/projects/columns/cards/" + cardId + "/moves"
        let h = new Headers();
        let data = {
            position: pos,
        }
        h.append("Accept", "application/vnd.github.inertia-preview+json");
        h.append("Authorization", "token " + localStorage.getItem("token"));
        let url = new Request(uri, {
            method: "POST",
            headers: h,
            body: JSON.stringify(data)
        })
        fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
                success()
            })
            .catch(function (e) {
                error()
            })
    }

    getName() {
        return "Github";
    }

    getIcon() {
        return "fa fa-github"
    }
}

export default GithubApi