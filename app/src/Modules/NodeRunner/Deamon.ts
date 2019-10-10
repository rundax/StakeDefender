'use strict';

import {ChildProcess, spawn} from 'child_process';
import * as fs from 'fs';
import {NodeAddressBookInterface, NodeConfigInterface, NodeLogFormat, NodeProcessConfig} from './interfaces';
import {Core} from '@Core/App';
import * as toml from 'toml';
import {NodeRunnerEvents} from './Events';
import {EventBusInterface} from '@elementary-lab/standards/src/EventBusInterface';
import {SimpleEventBus} from '@elementary-lab/events/src/SimpleEventBus';

export class Daemon {

    public static readonly  STOP_SIGNAL = 'SIGINT';

    private blockHeight: number;

    private daemon?: ChildProcess = null;

    private options:  NodeProcessConfig;

    private inRestartProcess: boolean = false;

    private bus: EventBusInterface<SimpleEventBus>;

    public constructor(options: NodeProcessConfig) {
        this.options = options;
        this.bus = Core.app().bus();
    }

    /**
     *
     */
    public start(): Promise<Daemon| false> {
        return new Promise<Daemon| false >((resolve, reject) => {
            if (!this.options.runNode) {
                return resolve(false);
            }
            if (this.daemon === null) {
                Core.info('Starting blockchain daemon', [this.options.version], 'Daemon');
                fs.access(this.getNodeRunScript(), fs.constants.X_OK | fs.constants.R_OK, (err: any) => {
                    if (err) {
                        Core.emergency(
                            'Error access to executable file. He is not exist or not executable',
                            [this.getNodeRunScript()],
                            'Daemon'
                        );
                        return reject();
                    }
                    this.daemon = spawn(this.getNodeRunScript(),
                        [
                            'node',
                            '--home-dir=' + this.options.home
                        ],
                    );
                    Core.info('Config: ', [this.getNodeRunScript() + ' node --home-dir=' + this.options.home], 'Daemon');
                    this.subscribeOnDaemonEvents();
                    this.configurePipes();
                    return resolve(this);
                });
            }
        });

    }

    public getNodeId(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const result  = spawn(this.getNodeRunScript(),
                [
                    'show_node_id',
                    '--home-dir=' + this.options.home
                ],
            );
            result.on('data', (data) => {
                let a = Buffer.from(data, 'utf-8').toString();
                resolve(a);
            });

        });
    }

    private getNodeRunScript(): string {
        return this.options.binDir + 'minter_' + this.options.version + '_linux_amd64';
    }


    public configurePipes(): this {
        this.daemon.stdout.on('data', (content) => {
            const data = Buffer.from(content, 'utf-8').toString().split('\n');
            data.forEach((item, index) => {
                if (item !== '') {
                    try {
                        this.parseLog(JSON.parse(item));
                    } catch (e) {
                        Core.error('Error to parse log:', [e, item]);
                        // throw e;
                    }

                }
            });

        });
        return this;
    }

    /**
     *
     * @param data
     */
    public parseLog(data: NodeLogFormat): void {

        let component = 'minter:' + data.module;
        let additional = { ... data };
        delete additional._msg;
        delete additional.level;
        delete additional.module;
        if (data.height !== undefined) {
            if (this.blockHeight !==  data.height ) {
                this.blockHeight = data.height;
                if (this.options.blockNotify) {
                    this.bus.emit(NodeRunnerEvents.NEW_BLOCK, data.height);
                }
                delete additional.height;
            }
        }
        if (this.options.logsToStdout !== true) {
            return;
        }
        switch (data.level) {
            case 'info':
                Core.info('[block:' + this.blockHeight + '] ' + data._msg, additional, component);
                break;
            case 'error':
                Core.error('[block:' + this.blockHeight + '] ' + data._msg, additional, component);
                break;
            case 'debug':
                Core.debug('[block:' + this.blockHeight + '] ' + data._msg, additional, component);
                break;

        }
    }

    /**
     * event handling through subscribe
     */
    private subscribeOnDaemonEvents(): void {
        this.daemon.stderr.on('data', (data: any) => {
            // TODO: log error
            Core.error('========Blockchain Error==========', [], 'minter:logs_parser');
            Core.error(data.toString(), [], 'minter:logs_parser');
            Core.error('==================================', [], 'minter:logs_parser');
        });

        this.daemon.on('close', (code: number) => {
            // TODO: log error
            Core.emergency('Child process exited with code: ', code);
            if (this.inRestartProcess !==  true) {
                process.exit(99);
            }
        });
    }


    public stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Core.error('Can not stop blockchain node. Timeout. Kill!!!', [], 'Daemon');
                reject();
            }, 10000);
            this.daemon.kill(Daemon.STOP_SIGNAL);
            this.daemon.on('exit', (code: number) => {
                Core.info('Node exit with code:', code,  'Daemon');
                resolve();
            });
        });
    }


    public getNodeConfig(): Promise<NodeConfigInterface> {
        return new Promise<NodeConfigInterface>((resolve, reject) => {
            fs.access(this.options.configFolder + 'config.toml', fs.constants.R_OK, (err: any) => {
                if (err) {
                    reject();
                }
                const result = toml.parse(fs.readFileSync(this.options.configFolder + 'config.toml').toString());
                resolve(result);
            });
        });
    }

    public getAddressBook(): Promise<NodeAddressBookInterface> {
        return new Promise<NodeAddressBookInterface>((resolve, reject) => {
            fs.access(this.options.configFolder + 'addrbook.json', fs.constants.R_OK, (err: any) => {
                if (err) {
                    reject();
                }
                const result = JSON.parse(fs.readFileSync(this.options.configFolder + 'addrbook.json').toString());
                resolve(result);
            });
        });
    }


}
