import {SplashCheckerConfigInterface} from '../Modules/SplashChecker';
import {BlockNotifyConfigInterface} from '../Modules/BlockNotify';

export interface MonitoringConfigInterface {
    splashChecker: SplashCheckerConfigInterface;
    blockNotify: BlockNotifyConfigInterface;
}

export interface BaseMonitoringModuleConfigInterface {
    enabled: boolean;
}
