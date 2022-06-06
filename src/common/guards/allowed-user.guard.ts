import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { Context } from '../interfaces';

@Injectable()
export class AllowedUserGuard implements CanActivate {
    private readonly allowedUsers: number[];
    private readonly allowedChats: number[];

    constructor() {
        this.allowedUsers = (process.env.ALLOWED_IDS || '')
            .split(',')
            .map((n) => parseInt(n));
        this.allowedChats = (process.env.ALLOWED_CHATS || '')
            .split(',')
            .map((n) => parseInt(n));
    }

    canActivate(context: ExecutionContext): boolean {
        const ctx = TelegrafExecutionContext.create(context);
        const { from, chat } = ctx.getContext<Context>();

        const allowed =
            this.allowedUsers.includes(from.id) ||
            this.allowedChats.includes(chat.id);
        if (!allowed) {
            throw new TelegrafException('Not an allowed user');
        }

        return true;
    }
}
