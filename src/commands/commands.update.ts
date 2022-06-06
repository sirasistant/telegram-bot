import { UseFilters } from '@nestjs/common';
import { Update, Message, Help } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { Command } from './command.model';
import { CommandsService } from './commands.service';
import { commandDescriptionTemplate } from './templates/commandDescription.template';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class CommandsUpdate {
    constructor(private commandsService: CommandsService) {}

    @Help()
    async help(@Message('text') messageText: string) {
        const { args } = this.commandsService.parseCommand(messageText);
        console.log(args);
        return this.renderCommands(this.commandsService.getCommands());
    }

    private renderCommands(commands: Command[]) {
        return commands.length
            ? commands
                  .map((command) => {
                      return commandDescriptionTemplate(command);
                  })
                  .join('\n')
            : 'No commands installed';
    }
}
