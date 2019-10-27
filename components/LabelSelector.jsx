import React from "react"

export default ({labels, onClick}) => {
    return (
        <div>
            <div className={"label__wrapper"}>
                <div className={"microcopy__container"}>
                    <div className={"microcopy__text"}> You can choose to prioritize one label only
                    </div>
                    <div className={"microcopy__icon"}>
                        <img src="assets/icons/go-down-icon.svg" alt=""/>
                    </div>
                </div>
                <div className={"label__container"}>
                    <div
                        className={"label__item label__none"}
                        onClick={(event) => onClick(0)}>
                        Prioritize all labels
                    </div>
                    {labels.map((item, index) => (
                        <div
                            style={{ backgroundColor : '#'+item.color }}
                            className={"label__item label__" + item.color}
                            key={index} value="{item.id}"
                            onClick={(event) => onClick(item.id)}>
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
