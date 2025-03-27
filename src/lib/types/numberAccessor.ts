export interface NumberAccessor {
    get: () => number;
    set: (value: number) => void;
}