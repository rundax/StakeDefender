export interface NodeApiConfigInterface {
    network: 'testNet' | 'mainNet';
    apiType: 'node' | 'gate';
    baseURL: string;
    privateKey: string;
    publicKeyValidator: string;
    debugProxy: {
        active: boolean;
        host: string;
        port: number;
    };
}

export interface NetworkTypeInterface {
    feeCoinSymbol: 'BIP' | 'MNT';
    chainId: 1 | 2;
}

export const BLOCKCHAIN_CONFIG_MAINNET:NetworkTypeInterface  = {
    feeCoinSymbol: 'BIP',
    chainId:1
};

export const BLOCKCHAIN_CONFIG_TESTNET:NetworkTypeInterface  = {
    feeCoinSymbol: 'MNT',
    chainId:2
};

