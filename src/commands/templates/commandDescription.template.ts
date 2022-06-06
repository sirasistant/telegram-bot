import { template } from 'dot';

export const commandDescriptionTemplate = template(
    `\
Command: /{{=command.name}}{{~command.args:argument}} {{{=argument.name}}}{{~}}
{{=command.description}}

Arguments:
{{~command.args:argument}}\
 - {{=argument.name}}:{{=argument.description}}
{{~}}
`,
    { strip: false, argName: 'command' },
);
