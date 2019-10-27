import React from "react"
import Header from './Header.jsx';
import traverseTree from "../model/traverseTree"

const treeNode = {
    "position": "relative",
    "display": "inline-block",
    "margin": "0px 10px",
    "vertical-align": "top"
};

class Results extends React.Component {
    constructor(props) {
        super(props)
        this.printNode = this.printNode.bind(this)
        this.printLeft = this.printLeft.bind(this)
        this.printRight = this.printRight.bind(this)
    }

    printNode(node) {
        if (node !== undefined && typeof node === 'object' && node !== null) {
            return <div>{node.value.name}
                <br/>
                <div style={treeNode}>{this.printLeft(node.left)}</div>
                <div style={treeNode}>{this.printRight(node.right)}</div>
            </div>;
        }
    }

    printLeft(subtree) {
        return this.printNode(subtree);
    }

    printRight(subtree) {
        return this.printNode(subtree);
    }

    render() {
        return (
            <div id="tree_draw" className={"send-ordered--container"}>
                <div>{this.printNode(this.props.tree)}</div>
            </div>
        )
    }
}


export default Results
