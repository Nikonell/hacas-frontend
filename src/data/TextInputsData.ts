export const createTextInputs = ({
                                     bet,
                                     minesCount,
                                     timeoutLoss,
                                     timeoutPeriod,
                                     spamInterval,
                                     spamTime
                                 }: {
    bet: { get: () => number; set: (value: number) => void };
    minesCount: { get: () => number; set: (value: number) => void };
    timeoutLoss: { get: () => number; set: (value: number) => void };
    timeoutPeriod: { get: () => number; set: (value: number) => void };
    spamInterval: { get: () => number; set: (value: number) => void };
    spamTime: { get: () => number; set: (value: number) => void };
}) => {
    const createInput = (get: () => number, set: (value: number) => void, text: string, style: string = '', addonText: string = '') => ({
        get inputText() {
            return get();
        },
        set inputText(value: number) {
            set(value);
        },
        text,
        style,
        addonText
    });

    return [
        createInput(bet.get, bet.set, "размер ставки", "--background:url('/accounts/buttons/dollar-sign.svg') no-repeat right 20px center; --padding:20px 60px"),
        createInput(timeoutLoss.get, timeoutLoss.set, "приостановка после"),
        createInput(spamInterval.get, spamInterval.set, "интервал спама", "--margin:8px 0 0"),
        createInput(minesCount.get, minesCount.set, "сколько мин", "--background:url('/accounts/buttons/cpu.svg') no-repeat right 20px center; --padding:20px 60px"),
        createInput(timeoutPeriod.get, timeoutPeriod.set, "время приостановки", '', 'мин.'),
        createInput(spamTime.get, spamTime.set, "время спама", "--margin:8px 0 0", 'мс.')
    ];
}
