import { Module } from '@nestjs/common';
import { CommandsService } from './services/commands.service';
import { CommandsUpdate } from './updates/commands.update';

@Module({
    exports: [CommandsService],
    providers: [CommandsService, CommandsUpdate],
})
export class CommandsModule {}
