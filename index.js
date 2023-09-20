import discord from 'discord.js';
import readline from 'readline';
import chalk from 'chalk';
import boxen from 'boxen';
import fs from 'fs';

console.log(boxen(chalk.cyan('Easily get the Discord Active Developer Badge')+'\nBy: '+chalk.bold(chalk.redBright('Rodrigo R.')), { padding: 1 }));

const readStream = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const token = await (() => {
    return new Promise((resolve) => {
        if (fs.existsSync('token.txt')) {
            console.log(chalk.green('Got token from file. If you want to overwrite it, delete token.txt'));
            return resolve(fs.readFileSync('token.txt').toString("utf-8"));
        }
        readStream.question('Enter Discord Bot Token: ', (token) => {
            resolve(token);
        });
    })
})();
fs.writeFileSync('token.txt', token);

const client = new discord.Client({
    intents: [
        discord.GatewayIntentBits.Guilds
    ]
});
await client.login(token);
console.log(chalk.green('[1/4] Logged in as '+client.user.tag+'.'));
await (() => {
    return new Promise((resolve) => {
        client.on('ready', () => {
            resolve();
        });
    })
})();
console.log(chalk.green('[2/4] Bot ready to use.'));
const command = new discord.SlashCommandBuilder().setName('getactivedeveloper').setDescription('Get the Discord Active Developer Badge!');
console.log(chalk.green('[2/4] Registering commands.'));
await client.application.commands.set([command]);
console.log(chalk.green('[3/4] Commands registered.'));
console.log('[====================================================]');
console.log("\n");
console.log(
    boxen(
        chalk.green(
            "Bot Status: 🟢 Online"
        )+"\n"+chalk.red(
            "Use the command /getactivedeveloper to get the Discord Active Developer Badge!"
        ),
        { padding: 1 }
    )
);
console.log("\n");
console.log('[====================================================]');

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "getactivedeveloper" && interaction.applicationId === client.user.id) {
        console.log('[====================================================]');
        console.log("\n");
        console.log(
            boxen(
                chalk.green(
                    "Detected the command /getactivedeveloper!"
                )+"\n"+chalk.red(
                    "The badge can now be claimed with the account "+interaction.user.tag+" in the server "+interaction.guild.name
                )+"\n"+chalk.red(
                    "To claim, visit: https://discord.com/developers/active-developer"
                ),
                { padding: 1 }
            )
        );
        console.log("\n");
        console.log('[====================================================]');
        const embed = new discord.EmbedBuilder();
        embed.setTitle('Discord Active Developer Badge');
        embed.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() });
        embed.setDescription(`
        
            ${"`"}[View the console!]${"`"}\n
            
            **You can now claim the Discord Active Developer Badge!**
            \n
            If you're not, perhaps you may need to wait 24 hours so Discord checks the account.

            - I waited 24 hours and I'm still not able to claim

            > If you're still not able to claim, visit: https://support-dev.discord.com/hc/en-us/articles/10113997751447-Active-Developer-Badge.

            - I'm still not able to claim

            > Contact Discord: https://support.discord.com/hc/en-us

        `);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
})