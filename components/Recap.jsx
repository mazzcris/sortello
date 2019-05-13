import React from "react"

class Recap extends React.Component {

    render () {
        return (
            <div className="order-recap recap__container">
                {this.props.cards.map((item, index) => (
                    <div className="recap__item" key={index}>{item.value.name}</div>
                ))}
            </div>
        );
    }
}

export default Recap