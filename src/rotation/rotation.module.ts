import { Module } from '@nestjs/common';
import { CommandsModule } from '../commands/commands.module';
import { RotationService } from './services/rotation.service';
import { RotationUpdate } from './updates/rotation.update';
import { SequelizeService } from './services/sequelize.service';

@Module({
    providers: [SequelizeService, RotationService, RotationUpdate],
    imports: [CommandsModule],
})
export class RotationModule {}
