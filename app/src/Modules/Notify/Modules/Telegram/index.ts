import {BaseNotifyModuleConfigInterface} from '../../index';
import {Core} from '@Core/App';
import {EventBusInterface} from '@elementary-lab/standards/src/EventBusInterface';
import {SimpleEventBus} from '@elementary-lab/events/src/SimpleEventBus';
import {BaseModule} from '@Core/BaseModule';
import {BlockSkippedData, SplashCheckerEvents} from '../../../Monitoring/Modules/SplashChecker/Events';
import Telegraf, {ContextMessageUpdate} from 'telegraf';
import {NodeApiEvents} from '../../../NodeApi';

export class NotifyToTelegram extends BaseModule<NotifyToTelegram> {

    private config: NotifyToTelegramConfigInterface;

    private botInstance: Telegraf<ContextMessageUpdate>;

    private bus: EventBusInterface<SimpleEventBus>;

    public constructor(config: NotifyToTelegramConfigInterface) {
        super();
        this.config = config;
        this.bus = Core.app().bus();
    }

    public init(): Promise<boolean | NotifyToTelegram> {
        const telegraf = require('telegraf');
        this.botInstance = new telegraf(this.config.token);
        return Promise.resolve(true);
    }

    public run(): Promise<boolean | NotifyToTelegram> {
        this.bus.on(SplashCheckerEvents.BLOCK_SKIPPED, (block: BlockSkippedData) => {
            this.botInstance.telegram.sendMessage(
                this.config.chatId,
                this.generateMessage(
                    'BLOCK SKIPPED',
                    'Warning',
                    'Validator skip block #' + block.blockHeight + '(' + block.blockHash + ')'
                )
            );
        });
        this.bus.on(SplashCheckerEvents.SPLASH_CHECKPOINT_2, () => {
            this.botInstance.telegram.sendMessage(
                this.config.chatId,
                this.generateMessage(
                    'Shutdown validator',
                    'Warning',
                    'To many missed block. Send setCandidateOff'
                )
            );
        });
        this.bus.on(NodeApiEvents.setCandidateOffSuccess, (data) => {
            this.botInstance.telegram.sendMessage(
                this.config.chatId,
                this.generateMessage(
                    'Shutdown validator',
                    'Info',
                    'Transaction setCandidateOff was Success send: ' + JSON.stringify(data)
                )
            );
        });
        this.bus.on(NodeApiEvents.setCandidateOffError, (data) => {
            this.botInstance.telegram.sendMessage(
                this.config.chatId,
                this.generateMessage(
                    'Shutdown validator',
                    'Error',
                    'Error send setCandidateOff: ' + JSON.stringify(data)
                )
            );
        });

        return Promise.resolve(true);
    }

    /**
     * TODO refactor to pug
     */
    private generateMessage(eventName:string, level: string, description): string {
        let text = '';
        text = text + '*' + Core.getAppInfo().validatorName + '*\n\r';
        text = text + 'Instance id: ' + Core.getAppInfo().id + '\n\r';
        text = text + 'Environment: ' + Core.getAppInfo().environment + '\n\r';
        text = text + 'App version: ' + Core.getAppInfo().version + '\n\r';
        text = text + 'Event: ' + eventName + '\n\r';
        text = text + 'Level: ' + level + '\n\r';
        text = text + 'Description: ' + description + '\n\r';
        return text;
    }
}

export interface NotifyToTelegramConfigInterface extends BaseNotifyModuleConfigInterface {
    token: string;
    chatId: string;
}
