import {NodeApi} from '../NodeApi';
import {MonitoringConfigInterface} from './Interfaces/MonitoringConfigInterface';
import {BlockNotify} from './Modules/BlockNotify';
import {SplashChecker} from './Modules/SplashChecker';
import {Core} from '@Core/App';



export class Monitoring {

    private config: MonitoringConfigInterface;

    private blockNotify: BlockNotify;

    private splashChecker: SplashChecker;

    private nodeApi: NodeApi;
    /**
     *
     */
    public constructor(config: MonitoringConfigInterface) {
        this.config = config;

    }

    public init(nodeApi: NodeApi) {
        this.nodeApi = nodeApi;
        this.setListeners();
        this.blockNotify = new BlockNotify(this.config.blockNotify, nodeApi);
        this.splashChecker = new SplashChecker(this.config.splashChecker, nodeApi);

    }

    public run() {
        this.blockNotify.run();
        this.splashChecker.run();
    }

    private setListeners(): void {
        Core.app().bus().on('monitoring.splashChecker.checkpoint2', () => {
            Core.info('I can see checkpoint2. Send setCandidateOff', [], 'Monitoring');
            this.nodeApi.setCandidateOff()
                .then((data) => {
                    Core.info('Send tx setCandidateOff is success');
                })
                .catch((error) => {
                    Core.error('Send tx setCandidateOff is not success', error, 'Monitoring');
                });
        });
    }
}

