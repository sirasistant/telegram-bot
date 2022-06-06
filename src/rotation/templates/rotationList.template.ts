import { template } from 'dot';

export const rotationListTemplate = template(
    `\
Active rotations:
{{~rotations:rotation}}\
 - {{=rotation.name}}:  {{=rotation.nextOptionName}}
{{~}}
`,
    { strip: false, argName: 'rotations' },
);
