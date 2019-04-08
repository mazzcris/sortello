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

    getCardsByListId(externId, variable, success) {
        let component = this
        const uri = "https://api.github.com/projects/columns/" + externId + "/cards"
        let h = new Headers();
        h.append("Accept", "application/vnd.github.inertia-preview+json");
        h.append("Authorization", "token " + localStorage.getItem("token"));
        let url = new Request(uri, {
            method: "GET",
            headers: h
        })
        fetch(url)
            .then(function (resp) {
                    return resp.json()
                        .then(function (cards) {
                            const uri2 = "https://api.github.com/projects/columns/" + externId
                            let url2 = new Request(uri2, {
                                method: "GET",
                                headers: h
                            })
                            fetch(url2)
                                .then(function (resp) {
                                    resp.json()
                                        .then(function (projectData) {
                                            const uri3 = projectData.project_url
                                            let url3 = new Request(uri3, {
                                                method: "GET",
                                                headers: h
                                            })
                                            fetch(url3)
                                                .then(function (resp) {
                                                    resp.json()
                                                        .then(function (data3) {
                                                            let normalizedCards = component.normalizeCards(cards, data3.html_url);
                                                            component.getIssues(normalizedCards).then(function (cards) {
                                                                success(cards)
                                                            })
                                                        })
                                                })
                                        })
                                })

                        })
                }
            )
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