import {env, envBoolean, envNumber} from '../Helpers/functions';
import {NodeApiConfigInterface} from '../Modules/NodeApi/Interfaces/NodeConfigInterface';
import {MonitoringConfigInterface} from '../Modules/Monitoring/Interfaces/MonitoringConfigInterface';
import {NotifyConfigInterface} from '../Modules/Notify';
import {ConsoleTarget} from '@elementary-lab/logger/src/Targets/ConsoleTarget';
import {SentryTarget} from '@elementary-lab/logger/src/Targets/SentryTarget';
import {LogLevel} from '@elementary-lab/logger/src/Types';
import {AppInfo, CoreConfigInterface} from '@Core/App';

export class ConfigFactory {

    public static getBase(): AppInfo {
        return {
            id: env('HOSTNAME', 'app'),
            validatorName: env('APP_VALIDATOR_NAME', 'undefined'),
            version: env('APP_VERSION'),
            environment: env('APP_ENV'),
        };
    }


    public static getCore(): CoreConfigInterface {
        return {
            log: {
                flushInterval: 1,
                traceLevel: 3,
                targets: [
                    new ConsoleTarget({
                        enabled: true,
                        levels: [ LogLevel.INFO, LogLevel.ERROR, LogLevel.NOTICE, LogLevel.DEBUG, LogLevel.WARNING, LogLevel.EMERGENCY]
                    }),
                    new SentryTarget({
                        enabled: envBoolean('APP_SENTRY_ENABLED', false),
                        dsn: env('APP_SENTRY_DSN', 'https://fake@fake.local/123'),
                        release: ConfigFactory.getBase().version,
                        environment: ConfigFactory.getBase().environment,
                        levels: [LogLevel.ERROR, LogLevel.WARNING]
                    })
                ]
            },
        };
    }


    public static getServices(): ServicesConfigInterface {
        return {
            nodeApi: {
                network: env('APP_NODE_NETWORK', 'mainNet') === 'mainNet' ? 'mainNet' : 'testNet',
                apiType: env('APP_NODE_API_TYPE', 'node') === 'node' ? 'node' : 'gate',
                baseURL: env('APP_NODE_BASE_URL', 'http://localhost:8841'),
                privateKey: env('APP_NODE_PRIVATE_KEY', ''),
                publicKeyValidator: env('APP_NODE_PUBLIC_KEY_VALIDATOR', ''),
                stopText:  env('APP_NODE_STOP_TEXT', 'Auto off'),
            },
            monitoring: {
                splashChecker: {
                    enabled: envBoolean('APP_MONITORING_SPLASH_CHECKER_ENABLED', true),
                    publicKeyValidator: env('APP_MONITORING_SPLASH_CHECKER_KEY_VALIDATOR', ''),
                    skippedBlockLimit: envNumber('APP_MONITORING_SPLASH_CHECKER_SKIPPED_BLOCK_LIMIT', 10, 10),
                },
                blockNotify: {
                    enabled: envBoolean('APP_MONITORING_BLOCK_NOTIFY_ENABLED', true),
                    requestInterval: envNumber('APP_MONITORING_BLOCK_NOTIFY_REQUEST_INTERVAL', 1000, 10)
                }

            },
            notify: {
                enabled: envBoolean('APP_NOTIFY_ENABLED', false),
                telegram: {
                    enabled: envBoolean('APP_NOTIFY_TELEGRAM_ENABLED', false),
                    chatId: env('APP_NOTIFY_TELEGRAM_CHAT_ID', ''),
                    token: env('APP_NOTIFY_TELEGRAM_TOKEN', ''),
                }
            }
        };
    }
}

interface ServicesConfigInterface {
    nodeApi: NodeApiConfigInterface;
    monitoring: MonitoringConfigInterface;
    notify: NotifyConfigInterface;
}
