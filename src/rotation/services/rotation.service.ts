import { Injectable } from '@nestjs/common';
import { Rotation } from '../models/rotation.model';
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

    async list(chatId) {
        return Rotation.findAll({
            where: {
                chatId,
            },
        });
    }

    async create(chatId, rotationName, optionNames) {
        return Rotation.create({
            chatId,
            name: rotationName,
            options: optionNames.map((optionName) => ({
                name: optionName,
                timesDone: 0,
            })),
            nextOptionName: optionNames[0],
        });
    }
}
