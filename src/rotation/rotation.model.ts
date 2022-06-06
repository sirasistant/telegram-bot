import {
    Table,
    Column,
    Model,
    AllowNull,
    DataType,
} from 'sequelize-typescript';

export class Option {
    constructor(public name: string, public done: boolean) {}
}

@Table({ modelName: 'Rotation' })
export class Rotation extends Model {
    @AllowNull(false)
    @Column
    public name: string;

    @AllowNull(false)
    @Column
    public chatId: string;

    @AllowNull(false)
    @Column
    public nextOptionName: string;

    @Column(DataType.JSONB)
    public options: Option[];

    rotate() {
        const popOptionName = this.nextOptionName;
        const popOption = this.options.find(
            (option) => option.name === popOptionName,
        );

        this.setAsDone(popOption);
        this.fillNextOption(popOption, false);

        return popOption;
    }

    private setAsDone(optionDone) {
        optionDone.done = true;

        const isRotationCompleted = this.options
            .map((option) => option.done)
            .reduce((acc, curr) => acc && curr, true);
        if (isRotationCompleted) {
            this.options.forEach((option) => {
                option.done = false;
            });
        }
        this.changed('options', true);
    }

    private fillNextOption(lastOption, isSkip) {
        if (!isSkip) {
            const isNewRotation = this.options
                .map((option) => !option.done)
                .reduce((acc, curr) => acc && curr, true);
            if (isNewRotation) {
                this.nextOptionName = this.options[0].name;
                return;
            }
        }

        for (let i = 1; i <= this.options.length; i++) {
            const index =
                (this.options.indexOf(lastOption) + i) % this.options.length;
            const option = this.options[index];
            if (!option.done) {
                this.nextOptionName = option.name;
                return;
            }
        }
    }

    skip() {
        const skippedOptionName = this.nextOptionName;
        const skippedOption = this.options.find(
            (option) => option.name === skippedOptionName,
        );

        this.fillNextOption(skippedOption, true);

        return skippedOption;
    }
}
