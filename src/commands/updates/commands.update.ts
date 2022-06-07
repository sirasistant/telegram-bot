import { UseFilters } from '@nestjs/common';
import { Update, Message, Help, TelegrafException } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { Command } from '../models/command.model';
import { CommandsService } from '../services/commands.service';
import { commandDescriptionTemplate } from '../templates/commandDescription.template';
import { commandsDescriptionTemplate } from '../templates/commandsDescription.template';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class CommandsUpdate {
    constructor(private commandsService: CommandsService) {}

    @Help()
    async help(@Message('text') messageText: string) {
        const { args } = this.commandsService.parseCommand(messageText);
        if (args.length > 1) {
            throw new TelegrafException('Unknown parameters');
        }
        const [commandName] = args;
        if (commandName) {
            const command = this.commandsService.getCommand(commandName);
            if (!command) {
                throw new TelegrafException(`Unknown command ${commandName}`);
            }
            return this.renderCommand(command);
        } else {
            return this.renderCommands(this.commandsService.getCommands());
        }
    }

    private renderCommands(commands: Command[]) {
        return commands.length
            ? commandsDescriptionTemplate(commands)
            : 'No commands installed';
    }

    private renderCommand(command: Command) {
        return commandDescriptionTemplate(command);
    }
}
