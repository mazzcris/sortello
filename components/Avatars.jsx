import React from 'react'

class Avatars extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div className={this.props.className ? this.props.className : ''}>
                {this.props.users? this.props.users.map((item, index) => (
                <img className={item.isAdmin ? "card__admin" : "card__voter"} key={index} src={item.avatar || item.trelloAvatar}/>
                )) : null}
            </div>
        )
    }
}

export default Avatars