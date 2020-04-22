'use strict';

import {spawn} from 'child_process';
import {LoggerInterface} from '@elementary-lab/standards/src/LoggerInterface';
import {Core} from '@Core/App';
import {NodeProcessConfig} from './interfaces';

export class Cli {

    private options: NodeProcessConfig;

    private log: LoggerInterface;

    public constructor(options: NodeProcessConfig) {
        this.options = options;
        this.log = Core.app().logger();
    }

    public getNodeRunScript(): string {
        return this.options.binDir + 'minter_' + this.options.version + '_linux_amd64';
    }

    public sendRequest<T>(command: string, isJson: boolean = false): Promise<T> {
        return new Promise((resolve, reject) => {

            const result = spawn(
                this.getNodeRunScript(),
                this.getCliCommand(command, isJson)
            );
            result.on('data', (data) => {
                let a = Buffer.from(data, 'utf-8').toString();
                resolve(JSON.parse(a));
            });
            result.stderr.on('data', (data: any) => {
                reject({reason: data});
            });

            result.on('close', (code: number) => {
                if (code !== 0) {
                    reject({reason: 'exit status code not equals 0'});
                }
            });

        });
    }

    private getCliCommand(command: string, isJson: boolean = false): string[] {
        let params = [
            '--home-dir=' + this.options.home
        ];

        if (isJson) {
            params = params.concat(['--json']);
        }
        let commandArray = command.split(' ');

        return [...params, ...commandArray];
    }

    public getNodeId(): Promise<string | null> {
        return new Promise<string | null>((resolve, reject) => {
            this.sendRequest<string>('show_node_id', false)
                .then((data: string) => {
                    resolve(data);
                })
                .catch(() => {
                    reject(null);
                });
        });
    }

    public getVersion(): Promise<string | null> {
        return new Promise<string | null>((resolve, reject) => {
            this.sendRequest<string>('version', false)
                .then((data: string) => {
                    resolve(data);
                })
                .catch(() => {
                    reject(null);
                });
        });
    }

    public verifyGenesis(): Promise<string | null> {
        return new Promise<string | null>((resolve, reject) => {
            this.sendRequest<string>('verify_genesis', false)
                .then((data: string) => {
                    resolve(data);
                })
                .catch(() => {
                    reject(null);
                });
        });
    }

    public getValidatorPublicKey(): Promise<string | null> {
        return new Promise<string | null>((resolve, reject) => {
            this.sendRequest<string>('show_validator', false)
                .then((data: string) => {
                    resolve(data);
                })
                .catch(() => {
                    reject(null);
                });
        });
    }

}
