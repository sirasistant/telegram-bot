import {
    Argument as ArgumentModel,
    Command as CommandModel,
} from 'src/commands/models/command.model';

export const rotationNameArgument = new ArgumentModel(
    'rotationName',
    'The name for the rotation to operate on',
);

const create = new CommandModel('create', 'Creates a new rotation', [
    rotationNameArgument,
    new ArgumentModel('optionNames', 'The options for the rotation', true),
]);

const list = new CommandModel('list', 'Lists all rotations in the chat');

const describe = new CommandModel('describe', 'Describes a rotation', [
    rotationNameArgument,
]);

const deleteVerb = new CommandModel('delete', 'Deletes a rotation', [
    rotationNameArgument,
]);

const peek = new CommandModel('peek', 'Look at the next item of a rotation', [
    rotationNameArgument,
]);

const pop = new CommandModel('pop', 'Rotate to the next item of a rotation', [
    rotationNameArgument,
]);

const skip = new CommandModel('skip', 'Jump over the next item of a rotation', [
    rotationNameArgument,
]);

export const rotationCommand = new CommandModel(
    'rotation',
    'Track rotations',
    [
        new ArgumentModel('verb', 'The verb to apply'),
        new ArgumentModel(
            'verbParameters',
            'Parameters of the verb, if any',
            true,
        ),
    ],
    [create, list, describe, deleteVerb, peek, pop, skip],
);
