export class Argument {
    constructor(public name: string, public description: string) {}
}

export class Command {
    constructor(
        public name: string,
        public description: string,
        public args: Argument[],
        public subCommands: Command[],
    ) {}
}
