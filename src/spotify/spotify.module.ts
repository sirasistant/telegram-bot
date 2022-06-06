import { Module } from '@nestjs/common';
import { SpotifyUpdate } from './spotify.update';
import { CommandsModule } from '../commands/commands.module';
import { SpotifyService } from './spotify.service';

@Module({
    providers: [SpotifyService, SpotifyUpdate],
    imports: [CommandsModule],
})
export class SpotifyModule {}
