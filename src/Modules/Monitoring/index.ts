import {NodeApi} from '../NodeApi';
import {MonitoringConfigInterface} from './Interfaces/MonitoringConfigInterface';
import {BlockNotify} from './Modules/BlockNotify';
import {SplashChecker} from './Modules/SplashChecker';
import {Core} from '@Core/App';
import {SplashCheckerEvents, SplashCheckpoint} from './Modules/SplashChecker/Events';
import {LoggerInterface} from "@elementary-lab/standards/src/LoggerInterface";


export class Monitoring {

    private config: MonitoringConfigInterface;

    private blockNotify: BlockNotify;

    private splashChecker: SplashChecker;

    private nodeApi: NodeApi;

    private logger: LoggerInterface;

    /**
     *
     */
    public constructor(config: MonitoringConfigInterface) {
        this.logger = Core.app().logger();
        this.config = config;

    }

    public init(nodeApi: NodeApi) {
        this.nodeApi = nodeApi;
        this.setListeners();
        this.blockNotify = new BlockNotify(this.config.blockNotify, nodeApi);
        this.splashChecker = new SplashChecker(this.config.splashChecker, nodeApi);

    }

    public run() {
        this.logger.info('Start monitoring module');
        this.blockNotify.run();
        this.splashChecker.run();
    }

    public async stop(): Promise<void> {
        this.logger.info('Stop monitoring module');
        return this.blockNotify.stop();
    }

    private setListeners(): void {
        Core.app().bus().on(SplashCheckerEvents.SPLASH_CHECKPOINT_2, (data: SplashCheckpoint) => {
            Core.info('I can see checkpoint2. Send setCandidateOff', [], 'Monitoring');
            this.nodeApi.setCandidateOff()
                .then((data) => {
                    this.logger.info('Send tx setCandidateOff is success', [], 'Monitoring');
                })
                .catch((error) => {
                    this.logger.error('Send tx setCandidateOff is not success', error.toString(), 'Monitoring');
                });
        });
    }
}

