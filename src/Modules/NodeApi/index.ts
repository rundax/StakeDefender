import {Core} from '@Core/App';
import {
    BlockInfoInterface,
    CandidateInterface,
    NetInfoInterface,
    StatusInterface,
    ValidatorItemInterface
} from './Interfaces/InfoInterface';
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {Minter, TX_TYPE} from 'minter-js-sdk';
import {
    BLOCKCHAIN_CONFIG_MAINNET,
    BLOCKCHAIN_CONFIG_TESTNET,
    NetworkTypeInterface,
    NodeApiConfigInterface
} from './Interfaces/NodeConfigInterface';

export class NodeApi {

    private config: NodeApiConfigInterface = null;

    private axiosClient: AxiosInstance;

    private minterSDK: Minter;

    private blockchainConfig: NetworkTypeInterface;

    public constructor(config: NodeApiConfigInterface) {
        this.config = config;
    }


    public init(): void {
        this.minterSDK = new Minter({
            apiType: this.config.apiType,
            baseURL: this.config.baseURL
        });

        let axiosConfig:AxiosRequestConfig = {};
        axiosConfig.baseURL = this.config.baseURL;
        axiosConfig.timeout = 10000;
        axiosConfig.responseType = 'json';
        axiosConfig.validateStatus = (status: number) => status >= 200 && status < 300;
        this.axiosClient = axios.create(axiosConfig);

        if (this.config.network === 'mainNet') {
            this.blockchainConfig = BLOCKCHAIN_CONFIG_MAINNET;
        } else {
            this.blockchainConfig = BLOCKCHAIN_CONFIG_TESTNET;
        }
    }

    public setCandidateOff(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.getMinGasPrice().then((gasPrice: number) => {
                let txParams = {
                    type: TX_TYPE.SET_CANDIDATE_OFF,
                    gasCoin: 0, // BIP id
                    gasPrice: gasPrice,
                    data: {
                        publicKey: this.config.publicKeyValidator,
                    },
                };
                let txHash:Promise<string> = this.minterSDK.postTx(txParams, {gasRetryLimit: 20, privateKey: this.config.privateKey});
                txHash.then((txString: string) => {
                    Core.info('Send setCandidateOff. Transaction:', {tx: txString}, 'NodeApi');
                    Core.app().bus().emit(NodeApiEvents.setCandidateOffSuccess, {tx: txString});
                    resolve(true);
                })
                    .catch((error) => {
                        Core.error('Error to send tx', error.message, 'NodeApi');
                        Core.app().bus().emit(NodeApiEvents.setCandidateOffError, {error: error.response});
                        reject(false);
                    });
            });
        });

    }

    public async getStatus(): Promise<StatusInterface> {
        return new Promise<StatusInterface>((resolve, reject) => {
            this.request('/status').then((response) => {
                if (response === false) {
                    reject('Response is false');
                }
                resolve(response.data);
            }).catch((err) => {
                Core.error('Can not get status from node', err);
                reject(err);
            });
        });

    }

    public async getNetInfo(): Promise<NetInfoInterface> {
        return new Promise<NetInfoInterface>((resolve, reject) => {
            this.request('/net_info').then((response) => {
                if (response === false) {
                    reject('Response is false');
                }
                resolve(response.data);
            }).catch((err) => {
                Core.error('Can not get network info from node', err, 'NodeApi');
                reject(err);
            });
        });
    }

    public async getMinGasPrice(): Promise<number> {
        return new Promise<any>((resolve, reject) => {
            this.request('/min_gas_price').then((response) => {
                if (response === false) {
                    reject('Response is false');
                }
                resolve(parseInt(response.data.min_gas_price));
            }).catch((err) => {
                Core.error('Can not get status from node', err);
                reject(err);
            });
        });

    }

    public async getCandidate(validatorPublicKey: string): Promise<CandidateInterface | boolean> {
        return new Promise<CandidateInterface | boolean>((resolve, reject) => {
            this.request('/candidate?pub_key=' + validatorPublicKey).then((response) => {
                if (response === false) {
                    reject('Response is false');
                }
                resolve(response.data);
            }).catch((err) => {
                if (err.response.data.error.code === 404) {
                    Core.error('Can not get candidate from node', [err.errno ], 'NodeApi');
                    resolve(false);
                } else {
                    reject(err);
                }
            });
        });
    }

    public async getValidators(height?:number): Promise<ValidatorItemInterface[]> {
        return new Promise<ValidatorItemInterface[]>((resolve, reject) => {
            let url = '/validators?perPage=256';
            if (height !== null) {
                url = url + '&height=' + height;
            }
            this.request(url)
                .then((response) => {
                    if (response === false) {
                        reject('Response is false');
                    }
                    resolve(response.data.validators);
                })
                .catch((err) => {
                    Core.error('Can not get validators list from node', err.message, 'NodeApi');
                    reject(err);
                });
        });
    }

    public async getBlock(height: number): Promise<BlockInfoInterface> {
        return new Promise<BlockInfoInterface>((resolve, reject) => {
            this.request('/block/' + height)
                .then((response) => {
                if (response === false) {
                    reject('Response is false');
                }
                resolve(response.data);
            })
                .catch((err) => {
                Core.error('Can not get candidate from node', [err.errno], 'NodeApi');
                reject(err);
            });
        });
    }

    public async request(url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            Core.debug('Axios request:', [url], 'NodeApi');
            this.axiosClient.get<boolean | object>(url)
                .then((response: AxiosResponse) => {
                    if (response.status === 200) {
                        resolve(response);
                    } else {
                        reject(false);
                    }
                }).catch((error) => {
                    Core.info('Error to get response: ', [url, error.name, error.message], 'NodeApi');
                    reject(error);
            });
        });
    }

    /**
     *
     * @param error
     */
    private catchError = (error: Error): Promise<Error> => {
        Core.error(error.message);
        return Promise.reject(error);
    }
}
export class NodeApiEvents {
    public static readonly setCandidateOffSuccess:string = 'nodeApi.setCandidateOff.success';
    public static readonly setCandidateOffError:string = 'nodeApi.setCandidateOff.error';
}
