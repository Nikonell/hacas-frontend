import type {AccountStats} from "./accountStats";

export interface GameState {
    started: boolean;
    startTime?: Date;
    inGameAccount?: number;
    stats?: Record<number, AccountStats>;
    nextAccountTime?: Date;
    nextStepTime?: Date;
    lossesRow?: number;
    timeoutEnd?: Date;
}
