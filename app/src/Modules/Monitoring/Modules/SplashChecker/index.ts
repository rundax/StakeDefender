import {NodeApi} from '../../../NodeApi';
import {Core} from '@Core/App';
import {BaseMonitoringModuleConfigInterface} from '../../Interfaces/MonitoringConfigInterface';
import {BlockInfoInterface, ValidatorItemInterface} from '../../../NodeApi/Interfaces/InfoInterface';
import {EventBusInterface} from '@elementary-lab/standards/src/EventBusInterface';
import {SimpleEventBus} from '@elementary-lab/events/src/SimpleEventBus';
import {BlockSkippedData, SplashCheckerEvents, SplashCheckpoint} from './Events';

/**
 *
 */
export class SplashChecker {
    private nodeApi: NodeApi;

    private bus: EventBusInterface<SimpleEventBus>;

    private config: SplashCheckerConfigInterface;


    private sendCheckpoint1: boolean = false;
    private sendCheckpoint2: boolean = false;

    public constructor(config: SplashCheckerConfigInterface, nodeApi: NodeApi) {
        this.config = config;
        this.nodeApi = nodeApi;
        this.bus = Core.app().bus();
    }

    public run(): void {
        if (!this.config.enabled) {
            Core.warn('Module is not enabled in config file', [], 'SplashChecker');
            return;
        }
        this.bus.on('node.newBlock', (height: number) => {
            setTimeout(() => {
                Promise.all([this.nodeApi.getValidators(height), this.nodeApi.getBlock(height)])
                    .then((data) => {
                        let validators: ValidatorItemInterface[];
                        let block: BlockInfoInterface;
                        [validators, block] = data;
                        let isValidator = validators.find( (item) => {
                            return item.pub_key === this.config.publicKeyValidator;
                        });
                        if (isValidator !== undefined) {
                            let isSign = block.validators.find((item) => {
                                return item.pub_key === this.config.publicKeyValidator && item.signed === true;
                            });
                            if (isSign === undefined) {
                                BlockStorage.addBlock(parseInt(block.height), block.hash, true);

                                const info: BlockSkippedData = {blockHash: block.hash, blockHeight: parseInt(block.height)};
                                this.bus.emit(SplashCheckerEvents.BLOCK_SKIPPED, info);
                            } else {
                                BlockStorage.addBlock(parseInt(block.height), block.hash, false);
                            }
                            let missingBlock = BlockStorage.getMissed();
                            if (missingBlock > this.config.skippedBlockLimit && !this.sendCheckpoint2) {
                                this.sendCheckpoint2 = true;
                                Core.warn('Activate checkpoint 2', [], 'SplashChecker');

                                const data: SplashCheckpoint  = {blockHash: block.hash, blockHeight: parseInt(block.height)};
                                this.bus.emit(SplashCheckerEvents.SPLASH_CHECKPOINT_2, data);
                            } else {
                                Core.info('Limit is normal', [missingBlock], 'SplashChecker');
                            }
                        } else {
                            // Reset flags
                            this.sendCheckpoint1 = false;
                            this.sendCheckpoint2 = false;
                            Core.info('Skip check block. Not in validator mode', [height], 'SplashChecker');
                            BlockStorage.addBlock(parseInt(block.height), block.hash, false);
                        }
                    })

                    .catch((result) => {
                        Core.error('Promise.all catch', [result.message], 'SplashChecker');
                    });
            }, 1000);

        });
    }
}

export interface SplashCheckerConfigInterface extends BaseMonitoringModuleConfigInterface {
    publicKeyValidator: string;
    skippedBlockLimit: number;
}


class BlockStorage {
    private static storage: {height: number, hash:string, isSkipped}[] = [];

    /**
     *
     * @param height
     * @param hash
     * @param isSkipped
     */
    public static addBlock(height: number, hash:string, isSkipped) {
        let alreadyExist = this.storage.find( (item) => {return item.height === height; });
        if (alreadyExist) {
            return;
        }
        if (isSkipped === true) {
            Core.debug('Add missed block', [height, hash], 'SplashChecker.BlockStorage');
        } else {
            Core.debug('Add normal block', [height, hash], 'SplashChecker.BlockStorage');
        }
        this.storage.unshift({
            height,
            hash,
            isSkipped,
        });
        if (this.getCount() > 24) {
            this.storage.pop();
        }
    }

    private static getCount(): number {
        let cnt = 0;
        this.storage.forEach((val) => {
            if (val !== undefined) {
                ++cnt;
            }
        });
        return cnt;
    }

    public static getMissed(): number {
        let cnt = 0;
        this.storage.forEach((val) => {
            if (val !== undefined && val.isSkipped === true) {
                cnt++;
            }
        });
        return cnt;
    }
}
