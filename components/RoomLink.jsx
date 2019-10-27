import React from 'react'
import CopyToClipboard from "./CopyToClipboard.jsx"

class RoomLink extends React.Component {
    render () {
        let copyToClipboardBtn = <button>Copy to clipboard</button>
        let copyToClipboardSuccess = <button>Copied to clipboard</button>
        let copyToClipboardError = <button>Error</button>
        if (this.props.roomId !== null) {
            let shareLink = window.location.protocol + "//" + window.location.hostname + port + window.location.pathname +
                '?roomKey=' + this.props.roomId + "&extId="+this.props.extId+"&fw="+(this.props.BoardApi.getName() === "Trello"? "t" : "g")
            return (

                    <div className="share-link__container">
                        <input className="share-room__input" id="room-link" type="text" readOnly value={shareLink}  />
                        <div className="copy-to-clipboard__button">
                            <CopyToClipboard text={shareLink} copyChildren={copyToClipboardBtn}
                                successChildren={copyToClipboardSuccess}
                                errorChildren={copyToClipboardError} />
                        </div>
                    </div>

            )
        }
        return (<div></div>)
    }
}

export default RoomLink
