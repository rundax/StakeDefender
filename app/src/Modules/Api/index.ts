import * as Koa from 'koa';
import * as Router from 'koa-router';
import {Context} from 'koa';
import * as bodyParser from 'koa-bodyparser';
import {Core} from '@Core/App';
import ConfigController from './Controllers/ConfigController';
import {Daemon} from '../NodeRunner/Deamon';

export class ApiServer {

    private config: ApiServerConfigInterface;

    private koa: Koa;

    private controllers: object[] = [];

    private daemon: Daemon;

    public constructor(config: ApiServerConfigInterface) {
        this.config = config;
    }

    public init(daemon: Daemon): ApiServer {

        this.daemon = daemon;

        this.koa = new Koa();
        const router = new Router();
        const requestId = require('koa-requestid');
        this.koa.use(bodyParser());
        this.koa.use(requestId());
        this.configureRoutes(router);
        this.koa.use(router.routes());
        this.koa.use(router.allowedMethods);

        return this;
    }

    protected configureRoutes(router: Router): ApiServer {
        const controller = new ConfigController(this.daemon);
        controller.configure(router);
        this.controllers.push(controller);
        // router.post('/stats', async (ctx: Context) => {
        //     let result = {
        //         foo: 'bar'
        //     };
        //
        //     ctx.body = result;
        //
        // });
        return this;
    }

    public listen(): Promise<ApiServer> {

        return new Promise<ApiServer | any>((resolve, reject) => {
            if (!this.config.enabled) {
                Core.info('Module ApiServer is not enabled');
                resolve(this);
            }
            this.koa.use(async (ctx, next) => {
                try {
                    await next();
                } catch (err) {
                    reject(err);
                }
            });
            this.koa.listen(this.config.port, () => {
                Core.info('Listening on:', [this.config.host, this.config.port], 'ApiServer');
                resolve(this);
            });
        });
    }

    public close(): Promise<void> {
        let gracefulShutdown = require('http-graceful-shutdown');
        return new Promise((resolve, reject) => {
            gracefulShutdown(this.koa, {
                signals: 'SIGINT SIGTERM',
                timeout: 30000,
                development: false,
                // onShutdown: this.cleanup,
                finally: function() {
                    resolve();
                    Core.info('Server gracefulls shutted down.....');
                }
            });
            setTimeout(() => {
                reject();
            }, 3000);
        });
    }

}


export interface ApiServerConfigInterface {
    enabled: boolean;
    host: string;
    port: number;
    timeout: number;
}
