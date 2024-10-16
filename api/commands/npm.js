import { SlashCommandBuilder } from "discord.js";
import request from "snekfetch";

const command = {
  name: "npm",
  description: "Get information about a NPM package.",
  data: new SlashCommandBuilder()
    .setName('npm')
    .setDescription('Get information about a NPM package.')
    .addStringOption(option =>
      option.setName('package')
        .setDescription('The NPM package name to search for')
        .setRequired(true)), // Make package argument required

  async execute(interaction, bot, options) {
    const packageName = interaction.options.getString('package');

    if (!packageName) {
      await interaction.reply("No package name provided!");
      return;
    }

    try {
      const res = await request.get(`https://registry.npmjs.org/${packageName.toLowerCase()}`);

      if (res.statusCode !== 200) {
        await interaction.reply("That isn't a valid NPM package!");
        return;
      }

      const i = res.body;
      const ver = i.versions[i['dist-tags'].latest];

      // Create the embed
      const embed = {
        title: `${i.name} **(**\`${i['dist-tags'].latest}\`**)**`,
        description: `${i.description}\n`,
        url: `https://www.npmjs.com/package/${i.name}`,
        color: 0xc12127,
        fields: [
          { name: 'License', value: i.license || 'N/A', inline: true },
          { name: 'Created In', value: new Date(i.time.created).toLocaleDateString(), inline: true },
          { name: 'Modified In', value: new Date(i.time.modified).toLocaleDateString(), inline: true }
        ],
        thumbnail: {
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/2000px-Npm-logo.svg.png'
        }
      };

      if (i.author) {
        embed.fields.push({
          name: 'Author',
          value: `${i.author.name}${i.author.email ? ` [Mail](mailto:${i.author.email})` : ''}${i.author.url ? ` [Website](${i.author.url})` : ''}`,
          inline: true
        });
      }

      if (i.keywords) {
        embed.fields.push({
          name: 'Keywords',
          value: i.keywords.join(', '),
          inline: true
        });
      }

      if (i.bugs) {
        embed.fields.push({
          name: 'Bug Tracker',
          value: i.bugs.url,
          inline: true
        });
      }

      if (i.repository) {
        embed.fields.push({
          name: `Repository (${i.repository.type})`,
          value: i.repository.url,
          inline: true
        });
      }

      if (ver.dependencies) {
        embed.fields.push({
          name: `Dependencies`,
          value: Object.keys(ver.dependencies).map(d => `${d} \`${ver.dependencies[d]}\``).join(', '),
          inline: true
        });
      }

      if (ver.devDependencies) {
        embed.fields.push({
          name: `Development Dependencies`,
          value: Object.keys(ver.devDependencies).map(d => `${d} \`${ver.devDependencies[d]}\``).join(', '),
          inline: true
        });
      }

      if (ver.peerDependencies) {
        embed.fields.push({
          name: `Peer Dependencies`,
          value: Object.keys(ver.peerDependencies).map(d => `${d} \`${ver.peerDependencies[d]}\``).join(', '),
          inline: true
        });
      }

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await interaction.reply("An error occurred while fetching the package information. Please try again later.");
    }
  }
};

export default command;
