import { template } from 'dot';

export const rotationDescriptionTemplate = template(
    `\
Rotation name: {{=rotation.name}}
Next option: {{=rotation.nextOptionName}}

Options:
{{~rotation.options:option}}\
 - {{=option.name}}: done {{=option.timesDone}} times
{{~}}
`,
    { strip: false, argName: 'rotation' },
);
