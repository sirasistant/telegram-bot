import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { CommandsModule } from './commands/commands.module';
import { RotationModule } from './rotation/rotation.module';
import { SpotifyModule } from './spotify/spotify.module';

const TelegrafModuleInstance = TelegrafModule.forRootAsync({
    useFactory: () => ({
        token: process.env.TOKEN,
        launchOptions:
            process.env.NODE_ENV === 'production'
                ? {
                      webhook: {
                          domain: process.env.HEROKU_URL,
                          hookPath: `/${process.env.TOKEN}`,
                      },
                  }
                : undefined,
    }),
});

@Module({
    imports: [
        TelegrafModuleInstance,
        SpotifyModule,
        RotationModule,
        CommandsModule,
    ],
})
export class AppModule {}
