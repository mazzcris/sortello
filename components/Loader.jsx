import React from "react";

class Loader extends React.Component {
    render(){
        return(<div>
                <div className={"loader-rotate"}>
                    <img src="../assets/loader/loader-sortello.svg" alt="sortello loader"/>
                </div>
            </div>);
    }
}

export default Loader