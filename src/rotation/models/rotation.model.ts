import {
    Table,
    Column,
    Model,
    AllowNull,
    DataType,
} from 'sequelize-typescript';

export class Option {
    constructor(public name: string, public timesDone: number) {}
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

    private findOption(name: string) {
        return this.options.find((option) => option.name === name);
    }

    rotate() {
        const popOption = this.findOption(this.nextOptionName);

        popOption.timesDone++;
        this.changed('options', true);
        this.nextOptionName = this.getNextOption(popOption).name;

        return popOption;
    }

    private getNextOption(lastOption: Option, afterSkip = false) {
        const sortedOptions = this.options.slice().sort((a, b) => {
            const timesDoneDiff = a.timesDone - b.timesDone;
            if (timesDoneDiff == 0) {
                return this.options.indexOf(a) - this.options.indexOf(b);
            }
            return timesDoneDiff;
        });
        if (afterSkip) {
            const index = sortedOptions.indexOf(lastOption);
            const newIndex = (index + 1) % sortedOptions.length;
            return sortedOptions[newIndex];
        } else {
            return sortedOptions[0];
        }
    }

    skip() {
        const skippedOption = this.findOption(this.nextOptionName);

        this.nextOptionName = this.getNextOption(skippedOption, true).name;

        return skippedOption;
    }
}
