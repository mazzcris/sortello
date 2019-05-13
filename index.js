import {render} from 'react-dom'
import React from 'react'
import App from './App.jsx'
import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css'
require("./css/style.css");
require("./css/animate-sortello.css");
require("./css/buttons.css");
require("./css/api-key.css");
require("./css/board-column__selection.css");
require("./css/choices.css");
require("./css/responsive/board-column-selection__responsive.css");
require("./css/responsive/choices__responsive.css");
require("./css/logout-button.css");
require("./css/responsive/logout-button__responsive.css");
require("./css/footer.css");
require("./css/responsive/footer__responsive.css");
require("./css/responsive/api-key__responsive.css");
require("./css/responsive/disclaimer__responsive.css");
require("./css/disclaimer.css");
require("./css/send-ordered.css");
require("./css/send-success.css");
require("./css/responsive/send-success__responsive.css");
require("./css/responsive/send-ordered__responsive.css");
require("./css/recap.css");
require("./css/responsive/recap__responsive.css");
require("./css/prioritization-end.css");
require("./css/responsive/prioritization-end__responsive.css");
require("./css/no-access-message.css");
require("./css/loader.css");

const containerEl = document.getElementById("container")
render(<App/>, containerEl)
