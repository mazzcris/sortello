import React from 'react';

class CardLabels extends React.Component {
    render () {
        return (
            <div className={'container__label'}>
                {this.props.labels.map(label => (
                    <div
                        style={{backgroundColor: '#' + label.color}}
                        className={`card__label card__label--${label.color}`}
                        key={label.id}
                    >
                        {label.name}
                    </div>
                ))}
            </div>
        )
    }
}

export default CardLabels
