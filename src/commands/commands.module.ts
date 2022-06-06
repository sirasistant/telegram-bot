import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CommandsUpdate } from './commands.update';

@Module({
    exports: [CommandsService],
    providers: [CommandsService, CommandsUpdate],
})
export class CommandsModule {}
