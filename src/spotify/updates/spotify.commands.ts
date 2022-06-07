import {
    Argument as ArgumentModel,
    Command as CommandModel,
} from 'src/commands/models/command.model';

export const spotifyCommand = new CommandModel(
    'spotify',
    'Fetch statistics from a spotify playlist',
    [new ArgumentModel('listId', 'The id for the spotify playlist')],
);
