import React from "react"
import Select from './Select.jsx'


export default ({labels, onChange}) => {
    return (
        <div className="selection-form">
            <div className="board-selection__microcopy">Select a label</div>

            <Select
                onChange={onChange}
                placeHolder={"Select labels"}
                options={
                    [
                        <option key={0} value={0}>Select All</option>
                    ].concat(
                        labels.map(function (item) {
                            return <option key={item.id} value={item.id}>{item.name}</option>
                        }.bind(this))
                    )
                }
            />
        </div>
    );
};
