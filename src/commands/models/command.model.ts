export class Argument {
    constructor(
        public name: string,
        public description: string = '',
        public isRest: boolean = false,
    ) {}
}

export class Command {
    constructor(
        public name: string,
        public description: string = '',
        public args: Argument[] = [],
        public verbs: Command[] = [],
    ) {}
}
