import { TelegrafException } from 'nestjs-telegraf';

export function WithRotation(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
) {
    const method = descriptor.value;
    if (method) {
        descriptor.value = async function wrapped(
            chatId,
            rotationName,
            ...otherArgs
        ) {
            const rotation = await this.rotationService.get(
                chatId,
                rotationName,
            );
            if (!rotation) {
                throw new TelegrafException(
                    `Rotation ${rotationName} does not exist`,
                );
            } else {
                return method.apply(this, [rotation, ...otherArgs]);
            }
        };
    }
}
