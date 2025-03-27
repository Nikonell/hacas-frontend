import settingsIcon from "$lib/assets/svg/cards/settings.svg";
import balanceIcon from "$lib/assets/svg/cards/dollar-sign.svg";
import likeIcon from "$lib/assets/svg/cards/thumbs-up.svg";
import dislikeIcon from "$lib/assets/svg/cards/thumbs-down.svg";
import toolIcon from "$lib/assets/svg/cards/tool.svg";
import type {TextComponentProps} from "$lib/types/textComponentProps";

export const createCards = (textInputs: TextComponentProps[]) => [
    { class: "large-box", icon: settingsIcon, title: "настройки", content: textInputs },
    { class: "small-box top", icon: balanceIcon, title: "баланс", text: "0$", tip: "+ 0%", tipColor: "" },
    { class: "small-box middle-left", icon: likeIcon, title: "выйгрыши", text: "0" },
    { class: "small-box middle-right", icon: dislikeIcon, title: "проигрыши", text: "0" },
    { class: "small-box bottom", icon: toolIcon, title: "статус", text: "выключен", toggle: true }
];