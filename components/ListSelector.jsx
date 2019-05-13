import React from 'react'
import Select from './Select.jsx'


class ListSelector extends React.Component {

    constructor (props) {
        super(props)
    }

    render () {
        return (
        <div className="selection-form">
        <div className="board-selection__microcopy">Select the correct column</div>
          <Select
              onChange={this.props.onChange}
              placeHolder={"Select a List"}
              options={
                  this.props.lists.map(function (list) {
                      return <option key={list.id} value={list.id}>{list.name}</option>
                  }.bind(this))
              }
          />
        </div>
      );

    }
}

export default ListSelector
