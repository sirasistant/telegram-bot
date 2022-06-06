import { template } from 'dot';

export const listSummaryTemplate = template(
    `\
List name: {{=list.description.name}}

Song count 🎼:
{{~list.songsByAdder:group}}\
{{=group.user.display_name}}: {{=group.count}} songs, length: {{=(group.duration/60000).toFixed(2)}} min,\
 averaging {{=(group.duration /(60000 * group.count)).toFixed(2)}} min/song
{{~group.duplicates:duplicated}}\
⚠️Song duplicated: {{=duplicated.name}}
{{~}}{{~}}
`,
    { strip: false, argName: 'list' },
);
