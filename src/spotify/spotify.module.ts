import { Module } from '@nestjs/common';
import { SpotifyUpdate } from './updates/spotify.update';
import { CommandsModule } from '../commands/commands.module';
import { SpotifyService } from './services/spotify.service';

@Module({
    providers: [SpotifyService, SpotifyUpdate],
    imports: [CommandsModule],
})
export class SpotifyModule {}
