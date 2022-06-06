import { UseFilters, UseGuards } from '@nestjs/common';
import { Update, Message, Command, Ctx } from 'nestjs-telegraf';
import { Argument, Command as CommandModel } from 'src/commands/command.model';
import { AllowedUserGuard } from 'src/common/guards/allowed-user.guard';
import { CommandsService } from '../commands/commands.service';
import { SpotifyService } from './spotify.service';
import { listSummaryTemplate } from './templates/listSummary.template';
import { Context } from '../common/interfaces';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';

const spotifyCommand = new CommandModel(
    'spotify',
    'Fetch statistics from a spotify playlist',
    [new Argument('listId', 'The id for the spotify playlist')],
    [],
);

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
        if (args[0]) {
            const listId = args[0];
            try {
                await ctx.reply(await this.renderListSummary(listId));
            } catch (ignored) {
                await ctx.reply(`Error fetching list with id ${listId}`);
            }
        } else {
            await ctx.reply('Invalid parameters');
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
