import camelcase from 'camelcase';
import {
    Command,
    Message,
    Update,
    Ctx,
    TelegrafException,
} from 'nestjs-telegraf';

import { CommandsService } from 'src/commands/services/commands.service';
import { RotationService } from '../services/rotation.service';
import { Context } from '../../common/interfaces';
import { AllowedUserGuard } from 'src/common/guards/allowed-user.guard';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { WithRotation } from '../decorators/withRotation.decorator';
import { Rotation } from '../models/rotation.model';
import { rotationDescriptionTemplate } from '../templates/rotationDescription.template';
import { rotationCommand } from './rotation.commands';
import { rotationListTemplate } from '../templates/rotationList.template';

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
        if (args.length < 1) {
            throw new TelegrafException('Invalid parameters');
        }

        const [verbName, ...parameters] = args;
        const verb = rotationCommand.verbs.find(
            (candidate) => candidate.name === verbName,
        );

        if (!verb) {
            throw new TelegrafException(`Unknown verb ${verbName}`);
        }

        const verbArguments = verb.args.map((arg, index) => {
            if (arg.isRest) {
                return parameters.slice(index, parameters.length);
            } else {
                return parameters[index];
            }
        });

        await ctx.reply(
            await this[camelcase(`on_${verb.name}`)](
                `${ctx.chat.id}`,
                ...verbArguments,
            ),
        );
    }

    async onCreate(chatId, rotationName, optionNames) {
        if (!rotationName) {
            throw new TelegrafException(`Invalid rotation name`);
        }
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

    async onList(chatId) {
        const rotations = await this.rotationService.list(chatId);
        return rotationListTemplate(rotations);
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
