import {Logger} from '@elementary-lab/logger/src';
import {LoggerInterface} from '@elementary-lab/standards/src/LoggerInterface';
import {CacheInterface} from '@elementary-lab/standards/src/CacheInterface';
import {RedisCache} from '@elementary-lab/cache/src/Drivers/RedisCache';
import {EventBusInterface} from '@elementary-lab/standards/src/EventBusInterface';
import {SimpleEventBus} from '@elementary-lab/events/src/SimpleEventBus';
import {LoggerConfigInterface} from '@elementary-lab/logger/src/Interface/LoggerConfigInterface';
import {ClientOpts} from 'redis';

export class Core {

    private static $self: Core;

    private static appInfo: AppInfo;

    public static app(): Core {
        if (Core.$self === undefined) {
            throw Error('Application not bootstrap');
        }

        return Core.$self;
    }

    private objects: {
        [key:string]: any
    } = {};

    public static bootstrap(info: AppInfo, coreConfig: CoreConfigInterface):void {
        Core.$self = new Core(coreConfig);
        Core.appInfo = info;
        Core.debug('Hello ' + info.id, {version: info.version, env: info.environment});
        Core.info('Bootstrap system');

    }

    public static getAppInfo(): AppInfo {
        return Core.appInfo;
    }
    /**
     *
     */
    private constructor(coreConfig: CoreConfigInterface) {
        this.objects.logger = new Logger(coreConfig.log);
        this.objects.bus = new SimpleEventBus(this.objects.logger);
    }

    public logger(): LoggerInterface {
        return this.objects.logger;
    }

    public bus(): EventBusInterface<SimpleEventBus> {
        return this.objects.bus;
    }


    public static info(message: string, context?: any, category: string = 'application') {
        Core.app().logger().info(message, context, category);
    }
    public static emergency(message: string, context?: any, category: string = 'application') {
        Core.app().logger().emergency(message, context, category);
    }
    public static error(message: string, context?: any, category: string = 'application') {
        Core.app().logger().error(message, context, category);
    }
    public static debug(message: string, context?: any, category: string = 'application') {
        Core.app().logger().debug(message, context, category);
    }
    public static warn(message: string, context?: any, category: string = 'application') {
        Core.app().logger().warn(message, context, category);
    }
    public static profile(message: string, context?: any, category: string = 'application') {
        Core.app().logger().profile(message, context, category);
    }

    public exitHandler: Function;

    public subscribeOnProcessExit(): void {
        /*do something when app is closing*/
        process.on('exit', this.exitHandler.bind(null, {cleanup: true, code:'exit'}));

        /*catches ctrl+c event*/
        process.on('SIGINT', this.exitHandler.bind(null, {exit: true, code:'SIGINT'}));

        /*catches "kill pid" (for example: nodemon restart)*/
        process.on('SIGUSR1', this.exitHandler.bind(null, {exit: true, code:'SIGUSR1'}));
        process.on('SIGUSR2', this.exitHandler.bind(null, {exit: true, code:'SIGUSR2'}));
        process.on('SIGTERM', this.exitHandler.bind(null, {exit: true, code:'SIGTERM'}));

        /*catches uncaught exceptions*/
        process.on('uncaughtException', this.uncaughtExceptionHandler);
        process.on('unhandledRejection', this.uncaughtRejectionHandler);
    }

    public setExitHandler(cb: Function): void {
        this.exitHandler = cb;
    }

    /**
     *
     * @param err
     */
    public uncaughtExceptionHandler(err) {
        Core.error(err.message, err.stack, err.name);
        process.exit(99);

    }

    public uncaughtRejectionHandler(err) {
        Core.error(err.message, err.stack, err.name);
        process.exit(99);

    }


}

export interface AppInfo {
    id: string;
    validatorName: string;
    version: string;
    environment: string;
}

export interface CoreConfigInterface {
    log: LoggerConfigInterface;
}
