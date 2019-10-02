'use strict';

import {NodeApi} from './Modules/NodeApi';
import {Daemon} from './Modules/NodeRunner/deamon';
import {Core} from '@Core/App';
import {base, services} from '@Config/app-config';
import {ApiServer} from './Modules/Api';
import {Monitoring} from './Modules/Monitoring';
import {Pmx} from './Modules/Pmx';
import {Notify} from './Modules/Notify';

Core.bootstrap(base);

Core.debug('Hello ' + base.id, {version: base.version, env: base.environment});

Core.app().setExitHandler((data: {code:string}) => {
    Core.info('Pcntl signal received. Closing connection server.', [data.code]);
    Promise.all([daemon.stop(), apiServer.close()])
        .then(() => {
            Core.info('System gracefully stopped');
            process.exit(0);
        })
        .catch(() => {
            Core.error('Can not stop services');
            process.exit(1);
        });
});

Core.app().subscribeOnProcessExit();

const daemon = new Daemon(services.nodeRunner);
const nodeApi = new NodeApi(services.nodeApi);
const apiServer = new ApiServer(services.apiServer);
const monitoring = new Monitoring(services.monitoring);
const notify = new Notify(services.notify);
const pmx = new Pmx();

Core.info('Init services');
nodeApi.init();
monitoring.init(nodeApi);
notify.init();

Promise.all([
    apiServer.init(daemon).listen(),
    daemon.start(),
    pmx.register(),
    notify.run()
])
    .then(() => {
        Core.info('Base system started');
        monitoring.run();
    })
    .catch(() => {
        Core.error('Can not init App');
        process.exit(1);
    });
