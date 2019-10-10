import * as Router from 'koa-router';
import {Context} from 'koa';
import {Daemon} from '../../NodeRunner/Deamon';

export default class ConfigController {

    private daemon: Daemon;

    public constructor(daemon: Daemon) {
        this.daemon = daemon;

    }


    public configure(router: Router) {
        router.get('/config', this.index.bind(this));
    }

    public async index(ctx: Context) {
        let a = Promise.all([this.daemon.getNodeConfig(), this.daemon.getNodeId()]).then(value => {
            console.log(value);
        });
        // let res = await this.daemon.getNodeConfig();
        ctx.body = {};
    }
}
