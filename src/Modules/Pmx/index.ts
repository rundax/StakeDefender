import PMX, {IOConfig} from '@pm2/io/build/main/pmx';
import {Core} from '@Core/App';
import {NodeApiEvents} from '../NodeApi';
import {NodeEvents} from '../NodeProcess/Events';
import {EventBusInterface} from '@elementary-lab/standards/src/EventBusInterface';
import {SimpleEventBus} from '@elementary-lab/events/src/SimpleEventBus';
import {BlockSkippedData, SplashCheckerEvents} from '../Monitoring/Modules/SplashChecker/Events';

export class Pmx {

    private pxmInstance: PMX;

    private bus: EventBusInterface<SimpleEventBus>;

    public constructor(config?: IOConfig) {
        this.pxmInstance = new PMX();
        this.pxmInstance.init(config);
        this.bus = Core.app().bus();
    }

    public register() {
        Core.debug('Register PMX events', [], 'PMX');
        this.registerMonitoringEvents();

        Core.debug('Register PMX metrics', [], 'PMX');
        this.registerMetric();

    }

    private registerMonitoringEvents() {
        this.pxmInstance.action('monitoring:splashChecker:checkpoint2', (reply) => {
            this.bus.emit(SplashCheckerEvents.SPLASH_CHECKPOINT_2);
            this.bus.once(NodeApiEvents.setCandidateOffSuccess, (data) => {
                return reply({success: true, data});
            });
            this.bus.once(NodeApiEvents.setCandidateOffError, (data) => {
                return reply({success: false, data});
            });
        });
        this.pxmInstance.action('monitoring:splashChecker:blockSkipped', (reply) => {
            const info: BlockSkippedData = {
                blockHeight: 123,
                blockHash: 'testHash',
            };
            this.bus.emit(SplashCheckerEvents.BLOCK_SKIPPED, info);
                return reply({success: true});
        });

    }


    private registerMetric() {
        const blockHeight = this.pxmInstance.metric({
            name: 'Block height',
        });
        blockHeight.set(0);
        this.bus.on(NodeEvents.NEW_BLOCK, (height) => {
            blockHeight.set(height);
        });
    }
}
