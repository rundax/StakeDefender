import {env, envBoolean, envNumber} from '../Helpers/functions';
import {ClientOpts} from 'redis';
import {NodeApiConfigInterface} from '../Modules/NodeApi/Interfaces/NodeConfigInterface';
import {NodeProcessConfig} from '../Modules/NodeRunner/interfaces';
import * as path from 'path';
import {ApiServerConfigInterface} from '../Modules/Api';
import {MonitoringConfigInterface} from '../Modules/Monitoring/Interfaces/MonitoringConfigInterface';
import {NotifyConfigInterface} from '../Modules/Notify';
import {LoggerConfigInterface} from '@elementary-lab/logger/src/Interface/LoggerConfigInterface';
import {ConsoleTarget} from '@elementary-lab/logger/src/Targets/ConsoleTarget';
import {SentryTarget} from '@elementary-lab/logger/src/Targets/SentryTarget';
import {LogLevel} from '@elementary-lab/logger/src/Types';
import {AppInfo} from '@Core/App';

const base: AppInfo = {
    id: env('APP_NAME', 'app'),
    version: env('APP_VERSION'),
    environment: env('APP_ENV'),
};


const core: {
    log: LoggerConfigInterface
    redis: ClientOpts
} = {
    log: {
        flushInterval: 1,
        traceLevel: 3,
        targets: [
            new ConsoleTarget({
                enabled: true,
                levels: [ LogLevel.INFO, LogLevel.ERROR, LogLevel.NOTICE, LogLevel.DEBUG, LogLevel.WARNING, LogLevel.EMERGENCY]
            }),
            new SentryTarget({
                enabled: false,
                dsn: env('APP_SENTRY_DSN'),
                release: base.version,
                environment: base.environment,
                levels: [LogLevel.ERROR, LogLevel.NOTICE]
            })
        ]
    },
    redis: {
        host: env('REDIS_HOST', 'redis'),
        port: parseInt(env('REDIS_PORT', '6379')),
        db: env('REDIS_DB', '2'),
        prefix: env('REDIS_PREFIX', 'cache_')
    }
};

const services: {
    nodeApi: NodeApiConfigInterface
    nodeRunner: NodeProcessConfig,
    apiServer: ApiServerConfigInterface
    monitoring: MonitoringConfigInterface,
    notify: NotifyConfigInterface
} = {
    nodeApi: {
        network: env('APP_NODE_NETWORK', 'mainNet') === 'mainNet' ? 'mainNet' : 'testNet',
        apiType: env('APP_NODE_API_TYPE', 'node') === 'node' ? 'node' : 'gate',
        baseURL: env('APP_NODE_BASE_URL', 'http://localhost:8841'),
        privateKey: env('APP_NODE_PRIVATE_KEY', ''),
        publicKeyValidator: env('APP_NODE_PUBLIC_KEY_VALIDATOR', ''),
        debugProxy: {
            active: envBoolean('APP_NODE_API_DEBUG_PROXY', false),
            host: env('APP_NODE_API_DEBUG_PROXY_HOST', '127.0.0.1'),
            port: envNumber('APP_NODE_API_DEBUG_PROXY_PORT', 9000, 10)
        }
    },
    nodeRunner: {
        runNode: envBoolean('APP_BLOCKCHAIN_RUN_NODE', true),
        version: env('APP_BLOCKCHAIN_VERSION', 'current'),
        home: env('APP_BLOCKCHAIN_HOME', path.resolve(process.cwd(), './blockchain') + '/'),
        binDir: env('APP_BLOCKCHAIN_BIN_DIR', path.resolve(process.cwd(), './bin') + '/'),
        configFolder: env('APP_BLOCKCHAIN_CONFIG_DIR', path.resolve(process.cwd(), './config') + '/'),
        logsToStdout: envBoolean('APP_BLOCKCHAIN_LOGS_TO_STDOUT', true),
        blockNotify: envBoolean('APP_BLOCKCHAIN_NOTIFY_NEW_BLOCK', true),
    },
    apiServer: {
        host: env('APP_API_SERVER_HOST', '*'),
        port: parseInt(env('APP_API_SERVER_PORT', 3000), 10),
        timeout: parseInt(env('APP_API_SERVER_REQUEST_TIMEOUT'), 10)
    },
    monitoring: {
        role: env('APP_MONITORING_ROLE', 'validator') === 'validator' ? 'validator' : 'sentry',
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
const params: {

} = {

};

export {base, core, services, params};
