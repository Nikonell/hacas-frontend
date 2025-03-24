import settingsIcon from "../cards/settings.svg";
import balanceIcon from "../cards/dollar-sign.svg";
import likeIcon from "../cards/thumbs-up.svg";
import dislikeIcon from "../cards/thumbs-down.svg";
import toolIcon from "../cards/tool.svg";

export const createCards = (textInputs: any) => [
    { class: "large-box", icon: settingsIcon, title: "настройки", content: textInputs },
    { class: "small-box top", icon: balanceIcon, title: "баланс", text: "0$", tip: "+ 0%", tipColor: "" },
    { class: "small-box middle-left", icon: likeIcon, title: "выйгрыши", text: "0" },
    { class: "small-box middle-right", icon: dislikeIcon, title: "проигрыши", text: "0" },
    { class: "small-box bottom", icon: toolIcon, title: "статус", text: "выключен", toggle: true }
];