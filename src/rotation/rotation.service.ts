import { Injectable } from '@nestjs/common';
import { Rotation } from './rotation.model';
import { SequelizeService } from './sequelize.service';

@Injectable()
export class RotationService {
    constructor(private sequelizeService: SequelizeService) {
        this.sequelizeService.sequelize.addModels([Rotation]);
        Rotation.sync();
    }

    async get(chatId, rotationName) {
        return Rotation.findOne({
            where: {
                chatId,
                name: rotationName,
            },
        });
    }

    async create(chatId, rotationName, optionNames) {
        return Rotation.create({
            chatId,
            name: rotationName,
            options: optionNames.map((optionName) => ({
                name: optionName,
                done: false,
            })),
            nextOptionName: optionNames[0],
        });
    }
}
