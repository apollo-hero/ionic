export enum DurationType {
    Minutes = 1,
    Hours,
    Days
}

export const CurrencyType = {
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',
    BRL: 'BRL',
    DKK: 'DKK',
    XCD: 'XCD',
}

export const UserType = {
    ADMIN: '1',
    VENDOR: '2',
    CLIENT: '3',
}

export const stripeKey = "pk_live_PjJyjK3ISwVeajtSCcJIuyUK";
//export const stripeKey = "pk_test_0SpB3C1exQeL6doaHyA9n9WN";

//export const server = "/server/";
//http://hotspot.epic.dm:3333/
export const server = "https://hotspot.epic.dm:3334/";
