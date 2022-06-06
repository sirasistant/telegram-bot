import { Injectable } from '@nestjs/common';
import { Command } from './command.model';

const parseCommandRegex = /^\/(?<command>[^\s@]+)@?(\S+)?\s?(?<args>.*)$/;
const parseArgsRegex = /[^\s]+/g;

@Injectable()
export class CommandsService {
    commands: Command[] = [];

    registerCommand(command: Command) {
        this.commands.push(command);
    }

    getCommands() {
        return this.commands;
    }

    parseCommand(message) {
        const match = message.match(parseCommandRegex);
        if (match) {
            const {
                groups: { command, args: argsString },
            } = match;
            const args = argsString.match(parseArgsRegex) || [];
            return {
                command,
                args,
            };
        } else {
            return null;
        }
    }
}
