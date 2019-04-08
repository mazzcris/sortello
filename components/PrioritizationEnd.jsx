import React from "react"
import SuccessAnimation from './SuccessAnimation.jsx';

export default () => {
  return (
    <div className="prioritization-end__container">
      <SuccessAnimation />
      <div className="prioritization-end__heading">Prioritization it's over!</div>
      <div className="prioritization-end__paragraph">Go to your board to see your tasks ordered,
or open a new room and restart prioritizing. </div>
      <div className="prioritization-end__buttons">
        <a href="#" target="_blank"
          className={"button__primary button__text check-trello__button"}>
          <i className="fa fa-trello"></i>&nbsp;
                    Check your Trello board
                </a>
        <a href="/app.html" className={"button__primary button__text prioritize-again__button"}>
          <i className="fa fa-repeat"></i>&nbsp;
                    Prioritize another list
                </a>
        </div>
      </div>
  )
}