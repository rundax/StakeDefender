'use strict';

import {Cli} from './Cli';
import {Core} from '@Core/App';
import {LoggerInterface} from '@elementary-lab/standards/src/LoggerInterface';
import {CliNetInfo, CliStatus} from './interfaces';

export class Manager {

    private cli: Cli;

    private log: LoggerInterface;

    public constructor(cli: Cli) {
        this.cli = cli;
        this.log = Core.app().logger();
    }

    public pruneBlocks(): any {
        throw new Error('Not implemented yet');
    }

    public status(): Promise<CliStatus> {
        return this.cli.sendRequest('status', true);
    }

    public netInfo(): Promise<CliNetInfo> {
        return this.cli.sendRequest('net_info', true);
    }

    public dialPeer(): void {
        throw new Error('Not implemented yet');
    }

}
