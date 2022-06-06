import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getBotToken } from 'nestjs-telegraf';
import { config } from 'dotenv';

config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    if (process.env.NODE_ENV === 'production') {
        const token = getBotToken();
        const bot = app.get(token);
        app.use(bot.webhookCallback(`/${process.env.TOKEN}`));
    }
    await app.listen(process.env.PORT);
}
bootstrap();
