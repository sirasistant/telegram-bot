import { Module } from '@nestjs/common';
import { CommandsModule } from '../commands/commands.module';
import { RotationService } from './rotation.service';
import { RotationUpdate } from './rotation.update';
import { SequelizeService } from './sequelize.service';

@Module({
    providers: [SequelizeService, RotationService, RotationUpdate],
    imports: [CommandsModule],
})
export class RotationModule {}
