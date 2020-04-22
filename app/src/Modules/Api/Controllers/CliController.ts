import {Cli} from '../../NodeRunner/Cli';
import {Manager} from '../../NodeRunner/Manager';
import {Controller, Req, Res, Get} from 'routing-controllers';

@Controller()
export class CliController {

    private cli: Cli;

    private manager: Manager;

    public constructor(cli: Cli) {
        this.cli = cli;
        this.manager = new Manager(this.cli);
    }

    @Get('/status')
    public status(@Req() request: any, @Res() response: any) {
       return this.manager.status();

    }
}
