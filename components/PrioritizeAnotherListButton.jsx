import React from 'react';

class PrioritizeAnotherListButton extends React.Component {
    render () {
        return (
           <a href="/app.html" className={"button__primary button__text prioritize-again__button"}>
               <i className="fa fa-repeat"/>&nbsp;
                    Prioritize another list
            </a>
        )
    }
}

export default PrioritizeAnotherListButton
