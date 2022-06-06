import {
    Argument as ArgumentModel,
    Command as CommandModel,
} from 'src/commands/command.model';

export const rotationNameArgument = new ArgumentModel(
    'rotationName',
    'The name for the rotation to operate on',
);

export const rotationCommand = new CommandModel(
    'rotation',
    'Track rotations',
    [
        new ArgumentModel('subCommand', 'The subcommand to apply'),
        new ArgumentModel('parameters', 'Parameters of the subcommand, if any'),
    ],
    [
        new CommandModel(
            'create',
            'Creates a new rotation',
            [
                rotationNameArgument,
                new ArgumentModel(
                    'optionNames',
                    'The options for the rotation',
                ),
            ],
            [],
        ),
        new CommandModel('list', 'Lists all rotations in the chat', [], []),
        new CommandModel(
            'describe',
            'Describes a rotation',
            [rotationNameArgument],
            [],
        ),
        new CommandModel(
            'delete',
            'Deletes a rotation',
            [rotationNameArgument],
            [],
        ),
        new CommandModel(
            'peek',
            'Look at the next item of a rotation',
            [rotationNameArgument],
            [],
        ),
        new CommandModel(
            'pop',
            'Rotate to the next item of a rotation',
            [rotationNameArgument],
            [],
        ),
        new CommandModel(
            'skip',
            'Jump over the next item of a rotation',
            [rotationNameArgument],
            [],
        ),
    ],
);
