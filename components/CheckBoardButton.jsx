import React from 'react';

class CheckBoardButton extends React.Component {
    render() {
        return (
            <a href={this.props.url} target="_blank"
               className={"button__primary button__text check-sortello__button"}>
                <i className={this.props.BoardApi.getIcon()}></i>&nbsp;
                {"Check your " + this.props.BoardApi.getName() + " board"}
            </a>
        )
    }
}

export default CheckBoardButton
