import { template } from 'dot';

export const commandDescriptionTemplate = template(
    `\
Command: /{{=command.name}}{{~command.args:argument}} {{{? argument.isRest }}...{{?}}{{=argument.name}}}{{~}}
{{=command.description}}

Arguments:
{{~command.args:argument}}\
 - {{=argument.name}}: {{=argument.description}}
{{~}}
{{? command.verbs.length }}\
Verbs:
{{~command.verbs:verb}}
 - {{=verb.name}}{{~verb.args:argument}} {{{? argument.isRest }}...{{?}}{{=argument.name}}}{{~}}
{{=verb.description}}
{{~}}{{?}}
`,
    { strip: false, argName: 'command' },
);
