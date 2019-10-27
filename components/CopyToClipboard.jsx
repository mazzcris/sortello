import Clipboard from "../lib/Clipboard";
import React from "react";

export class CopyToClipboard extends React.Component {

    constructor () {
        super();
        this.timeout = null;
        this.state = {
            copying: false,
            success: true
        };
        this.onCopyClick = this.onCopyClick.bind(this);
    }

    componentWillUnmount () {
        clearTimeout(this.timeout);
        this.timeout = null;
        this.setState({
            copying: false,
            success: true
        });
    }

    onCopyClick (e) {
        e.preventDefault();

        const {
            text
        } = this.props;
        const success = Clipboard.copyToClipboard(text);
        this.setState({
            copying: true,
            success: success
        });
        this.timeout = setTimeout(() => {
            this.timeout = null;
            this.setState({
                copying: false,
                success: true
            });
        }, 800);
    }

    render () {
        const {
            copyChildren,
            successChildren,
            errorChildren,
        } = this.props;

        const {
            copying,
            success
        } = this.state;

        if (copying && success) {
            return successChildren;
        }

        if (copying && !success) {
            return errorChildren;
        }

        if (!copying) {
            return React.cloneElement(
                copyChildren,
                {onClick: this.onCopyClick}
            )
        }
        return null;
    }
}

export default CopyToClipboard;