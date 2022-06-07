import { UseFilters, UseGuards } from '@nestjs/common';
import {
    Update,
    Message,
    Command,
    Ctx,
    TelegrafException,
} from 'nestjs-telegraf';
import { AllowedUserGuard } from 'src/common/guards/allowed-user.guard';
import { CommandsService } from '../../commands/services/commands.service';
import { SpotifyService } from '../services/spotify.service';
import { listSummaryTemplate } from '../templates/listSummary.template';
import { Context } from '../../common/interfaces';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { spotifyCommand } from './spotify.commands';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class SpotifyUpdate {
    constructor(
        private readonly commandsService: CommandsService,
        private readonly spotifyService: SpotifyService,
    ) {
        commandsService.registerCommand(spotifyCommand);
    }

    @Command(spotifyCommand.name)
    @UseGuards(AllowedUserGuard)
    async onSpotify(@Message('text') messageText: string, @Ctx() ctx: Context) {
        const { args } = this.commandsService.parseCommand(messageText);
        if (!args[0]) {
            throw new TelegrafException('Invalid parameters');
        }

        const listId = args[0];
        try {
            await ctx.reply(await this.renderListSummary(listId));
        } catch (ignored) {
            throw new TelegrafException(
                `Error fetching list with id ${listId}`,
            );
        }
    }

    async renderListSummary(listId) {
        const listDescription = await this.spotifyService.describePlaylist(
            listId,
        );
        const songs = (
            await this.spotifyService.getAllSongs(listDescription)
        ).filter((song) => song.track.type === 'track');

        const songsByAdder = {};
        const songsProcessed = {};

        for (const song of songs) {
            const adder = song.added_by.id;
            if (!songsByAdder[adder]) {
                songsByAdder[adder] = {
                    count: 0,
                    duration: 0,
                    tracks: [],
                    duplicates: [],
                    user: await this.spotifyService.describeUser(adder),
                };
            }
            if (songsProcessed[song.track.id]) {
                songsByAdder[adder].duplicates.push(song.track);
            }
            songsByAdder[adder].count++;
            songsByAdder[adder].duration += song.track.duration_ms;
            songsByAdder[adder].tracks.push(song.track);
            songsProcessed[song.track.id] = true;
        }
        return listSummaryTemplate({
            songsByAdder: Object.values(songsByAdder),
            description: listDescription,
        });
    }
}
