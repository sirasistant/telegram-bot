import camelcase from 'camelcase';
import {
    Command,
    Message,
    Update,
    Ctx,
    TelegrafException,
} from 'nestjs-telegraf';
import { Argument, Command as CommandModel } from 'src/commands/command.model';
import { CommandsService } from 'src/commands/commands.service';
import { RotationService } from './rotation.service';
import { Context } from '../common/interfaces';
import { AllowedUserGuard } from 'src/common/guards/allowed-user.guard';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { WithRotation } from './decorators/withRotation.decorator';
import { Rotation } from './rotation.model';
import { rotationDescriptionTemplate } from './templates/rotationDescription.template';

const rotationCommand = new CommandModel(
    'rotation',
    'Track rotations',
    [
        new Argument('rotationName', 'The name for the rotation to operate on'),
        new Argument('subCommand', 'The subcommand to apply'),
        new Argument('parameters', 'Parameters of the subcommand, if any'),
    ],
    [
        new CommandModel(
            'create',
            'Creates a new rotation',
            [new Argument('optionNames', 'The options for the rotation')],
            [],
        ),
        new CommandModel('describe', 'Describes a rotation', [], []),
        new CommandModel('delete', 'Deletes a rotation', [], []),
        new CommandModel('peek', 'Look at the next item of a rotation', [], []),
        new CommandModel(
            'pop',
            'Rotate to the next item of a rotation',
            [],
            [],
        ),
        new CommandModel(
            'skip',
            'Jump over the next item of a rotation',
            [],
            [],
        ),
    ],
);

@Update()
@UseFilters(TelegrafExceptionFilter)
export class RotationUpdate {
    constructor(
        private readonly commandsService: CommandsService,
        private readonly rotationService: RotationService,
    ) {
        commandsService.registerCommand(rotationCommand);
    }

    @Command(rotationCommand.name)
    @UseGuards(AllowedUserGuard)
    async onRotation(
        @Message('text') messageText: string,
        @Ctx() ctx: Context,
    ) {
        const { args } = this.commandsService.parseCommand(messageText);
        if (args.length < 2) {
            throw new TelegrafException('Invalid parameters');
        }

        const [rotationName, subCommand, ...parameters] = args;
        const { subCommands } = rotationCommand;
        if (
            !subCommands
                .map((availableSubCommand) => availableSubCommand.name)
                .includes(subCommand)
        ) {
            throw new TelegrafException(`Unknown subcommand ${subCommand}`);
        }
        await ctx.reply(
            await this[camelcase(`on_${subCommand}`)](
                `${ctx.chat.id}`,
                rotationName,
                parameters,
            ),
        );
    }

    async onCreate(chatId, rotationName, optionNames) {
        if (optionNames.length < 2) {
            throw new TelegrafException(`Invalid option names: ${optionNames}`);
        }
        if (await this.rotationService.get(chatId, rotationName)) {
            throw new TelegrafException(
                `Rotation ${rotationName} already exists`,
            );
        }

        try {
            await this.rotationService.create(
                chatId,
                rotationName,
                optionNames,
            );
            return `Created rotation ${rotationName}`;
        } catch (err) {
            console.error('Error creating rotation', err);
            throw new TelegrafException('Error creating rotation');
        }
    }

    @WithRotation
    async onDescribe(rotation: Rotation) {
        return rotationDescriptionTemplate(rotation);
    }

    @WithRotation
    async onDelete(rotation: Rotation) {
        await rotation.destroy();
        return `Rotation ${rotation.name} deleted`;
    }

    @WithRotation
    async onPeek(rotation: Rotation) {
        return `Next turn of rotation ${rotation.name} is ${rotation.nextOptionName}`;
    }

    @WithRotation
    async onPop(rotation: Rotation) {
        const popOption = rotation.rotate();
        await rotation.save();

        return (
            `This turn of rotation ${rotation.name} is ${popOption.name}, saved,` +
            ` next turn is ${rotation.nextOptionName}`
        );
    }

    @WithRotation
    async onSkip(rotation: Rotation) {
        const skippedOption = rotation.skip();
        await rotation.save();

        return `Skipping ${skippedOption.name}, next turn of rotation ${rotation.name} is ${rotation.nextOptionName}`;
    }
}
