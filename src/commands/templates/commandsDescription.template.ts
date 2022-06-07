import { template } from 'dot';

export const commandsDescriptionTemplate = template(
    `\
{{~commands:command}}\
Command: /{{=command.name}}{{~command.args:argument}} {{{? argument.isRest }}...{{?}}{{=argument.name}}}{{~}}
{{=command.description}}

Arguments:
{{~command.args:argument}}\
 - {{=argument.name}}: {{=argument.description}}
{{~}}

{{~}}
`,
    { strip: false, argName: 'commands' },
);
