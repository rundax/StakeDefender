import {BaseMonitoringModuleConfigInterface} from '../../Interfaces/MonitoringConfigInterface';
import {NodeApi} from '../../../NodeApi';
import {Core} from '@Core/App';
import {StatusInterface} from '../../../NodeApi/Interfaces/InfoInterface';
import {EventBusInterface} from '@elementary-lab/standards/src/EventBusInterface';
import {SimpleEventBus} from '@elementary-lab/events/src/SimpleEventBus';
import {NodeEvents} from "../../../NodeProcess/Events";

export class BlockNotify {

    private config: BlockNotifyConfigInterface;

    private nodeApi: NodeApi;

    private bus: EventBusInterface<SimpleEventBus>;

    private lastBlockHeight: number = -1;

    private timer: NodeJS.Timer;

    public constructor(config: BlockNotifyConfigInterface, nodeApi: NodeApi) {
        this.config = config;
        this.nodeApi = nodeApi;
        this.bus = Core.app().bus();
    }


    public run() {
        if (!this.config.enabled) {
            Core.warn('Module is not enabled', [], 'Monitoring.BlockNotify');
            return;
        }
        this.timer = setInterval(() => {
            this.nodeApi.getStatus().then((status: StatusInterface) => {
                // initial height
                if (this.lastBlockHeight === -1) {
                    this.lastBlockHeight = status.latest_block_height;
                }

                if (this.lastBlockHeight > status.latest_block_height) {
                    return;
                }

                if ((status.latest_block_height - this.lastBlockHeight) > 1) {
                    for (let i = this.lastBlockHeight;  i < status.latest_block_height; i++) {
                        this.bus.emit(NodeEvents.NEW_BLOCK, i);
                    }
                } else if ((status.latest_block_height - this.lastBlockHeight) > 0 ) {
                    this.bus.emit(NodeEvents.NEW_BLOCK, this.lastBlockHeight);
                }
                this.lastBlockHeight = status.latest_block_height;
            }).catch((err) => {
                Core.error('Can not get status from node', err, 'SplashChecker');
                throw new Error('Can not get status from node');
            });
        }, this.config.requestInterval);
    }

    public async stop() {
        clearInterval(this.timer);
        return Promise.resolve();
    }


}

export interface BlockNotifyConfigInterface extends BaseMonitoringModuleConfigInterface {
    requestInterval: number;
}
