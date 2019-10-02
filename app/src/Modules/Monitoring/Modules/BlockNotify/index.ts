import {BaseMonitoringModuleConfigInterface} from '../../Interfaces/MonitoringConfigInterface';
import {NodeApi} from '../../../NodeApi';
import {Core} from '@Core/App';
import {StatusInterface} from '../../../NodeApi/Interfaces/InfoInterface';
import {EventBusInterface} from '@elementary-lab/standards/src/EventBusInterface';
import {SimpleEventBus} from '@elementary-lab/events/src/SimpleEventBus';

export class BlockNotify {

    private config: BlockNotifyConfigInterface;

    private nodeApi: NodeApi;

    private bus: EventBusInterface<SimpleEventBus>;

    private lastBlockHeight: number = 0;

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
        setInterval(() => {
            this.nodeApi.getStatus().then((status: StatusInterface) => {
                if ((status.latest_block_height - this.lastBlockHeight) > 1 && this.lastBlockHeight !== 0) {
                    for (let i = this.lastBlockHeight;  i < status.latest_block_height; i++) {
                        this.bus.emit('node.newBlock', i);
                    }
                } else {
                    this.bus.emit('node.newBlock', this.lastBlockHeight);
                }
                this.lastBlockHeight = status.latest_block_height;
            }).catch((err) => {
                Core.error('Can not get status from node', err, 'SplashChecker');
                throw new Error('Can not get status from node');
            });
        }, this.config.requestInterval);
    }


}

export interface BlockNotifyConfigInterface extends BaseMonitoringModuleConfigInterface {
    requestInterval: number;
}
