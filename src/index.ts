'use strict';

import {NodeApi, NodeApiEvents} from './Modules/NodeApi';
import {Core} from '@Core/App';
import {Monitoring} from './Modules/Monitoring';
import {Pmx} from './Modules/Pmx';
import {Notify} from './Modules/Notify';
import {ConfigFactory} from '@Config/app-config';
import {SplashCheckerEvents} from './Modules/Monitoring/Modules/SplashChecker/Events';


const base = ConfigFactory.getBase();
const core = ConfigFactory.getCore();
const services = ConfigFactory.getServices();

Core.bootstrap(base, core);


const nodeApi = new NodeApi(services.nodeApi);
const monitoring = new Monitoring(services.monitoring);
const notify = new Notify(services.notify);
const pmx = new Pmx();

Core.app().setExitHandler((data: {code:string}) => {
    Core.info('Pcntl signal received. Closing connection server.', [data.code]);
    Promise.all([monitoring.stop()])
        .then(() => {
            Core.info('System gracefully stopped');
            process.exit(0);
        })
        .catch(() => {
            Core.error('Can not stop services');
            process.exit(1);
        });
    Core.info('System gracefully stopped');
    process.exit(0);
});

Core.app().subscribeOnProcessExit();

Core.info('Init services');
nodeApi.init();
monitoring.init(nodeApi);
notify.init();

Promise.all([
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
