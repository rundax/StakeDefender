
import * as bodyParser from 'koa-bodyparser';
import {Core} from '@Core/App';
import ConfigController from './Controllers/ConfigController';
import {Daemon} from '../NodeRunner/Deamon';
import {CliController} from './Controllers/CliController';
import {createKoaServer} from 'routing-controllers';
import 'reflect-metadata';

export class ApiServer {

    private config: ApiServerConfigInterface;

    private daemon: Daemon;

    private app: any;

    public constructor(config: ApiServerConfigInterface) {
        this.config = config;
    }

    public init(daemon: Daemon): ApiServer {
        this.daemon = daemon;

        this.app = createKoaServer({
            controllers: [CliController] // we specify controllers we want to use
        });
        return this;
    }

    public listen(): Promise<ApiServer> {
        return new Promise<ApiServer | any>((resolve, reject) => {
            this.app.listen(this.config.port);
            // this.koa.use(async (ctx, next) => {
            //     try {
            //         await next();
            //     } catch (err) {
            //         reject(err);
            //     }
            // });
            // this.koa.listen(this.config.port, () => {
            //     Core.info('Listening on:', [this.config.host, this.config.port], 'ApiServer');
            //     resolve(this);
            // });
        });
    }

    public close(): Promise<void> {
        let gracefulShutdown = require('http-graceful-shutdown');
        return new Promise((resolve, reject) => {
            // gracefulShutdown(this.koa, {
            //     signals: 'SIGINT SIGTERM',
            //     timeout: 30000,
            //     development: false,
            //     // onShutdown: this.cleanup,
            //     finally: function() {
            //         resolve();
            //         Core.info('Server gracefulls shutted down.....');
            //     }
            // });
            setTimeout(() => {
                reject();
            }, 3000);
        });
    }

}


export interface ApiServerConfigInterface {
    host: string;
    port: number;
    timeout: number;
}
