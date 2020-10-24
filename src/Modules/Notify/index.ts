import {NotifyToTelegram, NotifyToTelegramConfigInterface} from './Modules/Telegram';
import {BaseModule} from '@Core/BaseModule';

export class Notify extends BaseModule<Notify> {

    private config: NotifyConfigInterface;

    private telegram: NotifyToTelegram;

    public constructor(config: NotifyConfigInterface) {
        super();
        this.config = config;
        this.telegram = new NotifyToTelegram(config.telegram);
    }

    public init(): Promise<boolean | Notify> {
        return new Promise<boolean|Notify>((resolve, reject)  => {
            this.telegram.init().then(() => {
                resolve(this);
            }).catch(() => {
                reject(false);
            });
        });
    }

    public run(): Promise<boolean | Notify> {
        return new Promise<boolean|Notify>((resolve, reject)  => {
            this.telegram.run().then(() => {
                resolve(this);
            }).catch(() => {
                reject(false);
            });
        });
    }
}

export interface NotifyConfigInterface extends BaseNotifyModuleConfigInterface {
    telegram: NotifyToTelegramConfigInterface;
}

export interface BaseNotifyModuleConfigInterface {
    enabled: boolean;
}
