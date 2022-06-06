import { template } from 'dot';

export const rotationDescriptionTemplate = template(
    `\
Rotation name: {{=rotation.name}}
Next option: {{=rotation.nextOptionName}}

Options:
{{~rotation.options:option}}\
 - {{=option.name}} {{? option.done }}✅{{?? true }}❌{{?}}
{{~}}
`,
    { strip: false, argName: 'rotation' },
);
