export enum AccountStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export interface Account {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    token: string;
    bet: number;
    minesCount: number;
    timeoutLoss: number;
    timeoutPeriod: number;
    spamInterval: number;
    spamTime: number;
    status: AccountStatus;
}