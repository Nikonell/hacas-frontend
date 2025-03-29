import type {NumberAccessor} from "$lib/types/numberAccessor";
import type {TextComponentProps} from "$lib/types/textComponentProps";

const createInput = (accessor: NumberAccessor , text: string, style: string = '', addonText: string = ''): TextComponentProps => ({
    get inputText() {
        return accessor.get();
    },
    set inputText(value: number) {
        accessor.set(value);
    },
    text,
    style,
    addonText
});

export const createTextInputs = ({
                                     bet,
                                     minesCount,
                                     timeoutLoss,
                                     timeoutPeriod,
                                     spamInterval,
                                     spamTime,
                                     lifeTime,
                                 }: {
    bet: NumberAccessor;
    minesCount: NumberAccessor;
    timeoutLoss: NumberAccessor;
    timeoutPeriod: NumberAccessor;
    spamInterval: NumberAccessor;
    spamTime: NumberAccessor;
    lifeTime: NumberAccessor;
}): TextComponentProps[] => {
    return [
        createInput(bet, "размер ставки", `--background:url('/svg/dollar-sign.svg') no-repeat right 20px center`),
        createInput(minesCount, "сколько мин", "--background:url('/svg/cpu.svg') no-repeat right 20px center"),
        createInput(timeoutLoss, "приостановка после"),
        createInput(spamInterval, "интервал спама"),
        createInput(timeoutPeriod, "время приостановки", '', 'мин.'),
        createInput(spamTime, "время спама", '', 'мс.'),
        createInput(lifeTime, "время жизни", '', 'ч.')
    ];
}
