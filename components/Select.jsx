import React from 'react'

export default ({options, onChange, placeHolder}) => {
    return <div className="input-select">
            <select onChange={(event) => onChange(event.target.value)} className={"select-field__select input-select__field"}>
                <option>{placeHolder}</option>
                {options}
            </select>
            <i className="material-icons input-select__icon">arrow_right</i>
          </div>
};
