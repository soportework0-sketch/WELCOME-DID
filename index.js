const express = require("express");

const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

// ==================================================
// CONFIGURACIÓN
// ==================================================

const PREFIX = "=";

const CANAL_BIENVENIDA = "1536209949645078608";
const CANAL_LOGS = "1536210300770975775";
const CANAL_SUPPORT = "1533650120783040604";
const CANAL_DESPEDIDA = "1536467088133070888";

const STAFF_ROLE = "1536211170971754590";

const INVITE = "https://discord.gg/hKkDghPybK";

// ==================================================
// EXPRESS PARA RENDER
// ==================================================

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.status(200).send("🔎 DID Bot está funcionando correctamente.");
});

app.get("/status", (req, res) => {
    res.json({
        status: "online",
        bot: client.user ? client.user.tag : "connecting",
        servers: client.guilds.cache.size
    });
});

app.listen(PORT, () => {
    console.log(`🌐 Express iniciado en el puerto ${PORT}`);
});

// ==================================================
// CLIENTE DISCORD
// ==================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.User
    ]
});

// ==================================================
// BOT LISTO
// ==================================================

client.once("ready", () => {

    console.log("====================================");
    console.log("       🔎 DID BOT INICIADO");
    console.log("====================================");
    console.log(`🤖 Bot: ${client.user.tag}`);
    console.log(`📡 Servidores: ${client.guilds.cache.size}`);
    console.log(`⌨️ Prefijo: ${PREFIX}`);
    console.log("====================================");

    client.user.setPresence({
        activities: [
            {
                name: "DID • Departamento de Investigación",
                type: 3
            }
        ],
        status: "online"
    });

});

// ==================================================
// COMPROBAR STAFF
// ==================================================

function esStaff(member) {
    return member.roles.cache.has(STAFF_ROLE);
}

// ==================================================
// BIENVENIDA
// ==================================================

function crearBienvenida(usuario) {

    return new EmbedBuilder()
        .setColor(0x5865F2)
        .setAuthor({
            name: "DID • Departamento de Investigación"
        })
        .setTitle("🔎・¡BIENVENIDO/A A LA DID!")
        .setDescription(
            `### 👋 ¡Hola, ${usuario.username}!\n\n` +
            `Nos alegra tenerte en **DID • Departamento de Investigación**. 🕵️\n\n` +
            `🛡️ **Recuerda:** respeta la normativa, ` +
            `mantén una buena conducta y disfruta de nuestra comunidad.\n\n` +
            `🔗 **Invitación oficial:**\n${INVITE}\n\n` +
            `> 🔎 **Investiga. Analiza. Descubre.**\n` +
            `> ¡Esperamos verte participando! ❤️‍🩹`
        )
        .setThumbnail(
            usuario.displayAvatarURL({
                extension: "png",
                size: 256
            })
        )
        .setFooter({
            text: "DID • Bienvenido a nuestra comunidad"
        })
        .setTimestamp();
}

// ==================================================
// DESPEDIDA
// ==================================================

function crearDespedida(usuario) {

    return new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle("👋・HASTA PRONTO")
        .setDescription(
            `**${usuario.username}** ha salido de la DID.\n\n` +
            `Esperamos volver a verte pronto. 🥺\n\n` +
            `🔎 **DID • Departamento de Investigación**`
        )
        .setThumbnail(
            usuario.displayAvatarURL({
                extension: "png",
                size: 256
            })
        )
        .addFields({
            name: "🆔 ID",
            value: `\`${usuario.id}\``,
            inline: true
        })
        .setFooter({
            text: "DID • Sistema de despedidas"
        })
        .setTimestamp();
}

// ==================================================
// USUARIO ENTRA
// ==================================================

client.on("guildMemberAdd", async (member) => {

    try {

        const bienvenida =
            member.guild.channels.cache.get(CANAL_BIENVENIDA);

        if (bienvenida) {

            await bienvenida.send({
                content: `${member}`,
                embeds: [
                    crearBienvenida(member.user)
                ]
            });

        }

        const logs =
            member.guild.channels.cache.get(CANAL_LOGS);

        if (logs) {

            const embed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle("🟢・USUARIO UNIDO")
                .setDescription(
                    `${member} se ha unido al servidor.`
                )
                .addFields(
                    {
                        name: "👤 Usuario",
                        value: member.user.tag,
                        inline: true
                    },
                    {
                        name: "🆔 ID",
                        value: `\`${member.id}\``,
                        inline: true
                    },
                    {
                        name: "📅 Cuenta creada",
                        value:
                            `<t:${Math.floor(
                                member.user.createdTimestamp / 1000
                            )}:F>`
                    }
                )
                .setThumbnail(
                    member.user.displayAvatarURL({
                        extension: "png"
                    })
                )
                .setFooter({
                    text: "DID • Sistema de Logs"
                })
                .setTimestamp();

            await logs.send({
                embeds: [embed]
            });

        }

    } catch (error) {

        console.error(
            "❌ Error en guildMemberAdd:",
            error
        );

    }

});

// ==================================================
// USUARIO SALE
// ==================================================

client.on("guildMemberRemove", async (member) => {

    try {

        const despedida =
            member.guild.channels.cache.get(
                CANAL_DESPEDIDA
            );

        if (despedida) {

            await despedida.send({
                embeds: [
                    crearDespedida(member.user)
                ]
            });

        }

        const logs =
            member.guild.channels.cache.get(CANAL_LOGS);

        if (logs) {

            const embed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle("🔴・USUARIO SALIÓ")
                .setDescription(
                    `**${member.user.tag}** salió del servidor.`
                )
                .addFields({
                    name: "🆔 ID",
                    value: `\`${member.id}\``,
                    inline: true
                })
                .setThumbnail(
                    member.user.displayAvatarURL({
                        extension: "png"
                    })
                )
                .setFooter({
                    text: "DID • Sistema de Logs"
                })
                .setTimestamp();

            await logs.send({
                embeds: [embed]
            });

        }

    } catch (error) {

        console.error(
            "❌ Error en guildMemberRemove:",
            error
        );

    }

});

// ==================================================
// COMANDOS
// ==================================================

client.on("messageCreate", async (message) => {

    try {

        if (message.author.bot) return;
        if (!message.guild) return;

        if (!message.content.startsWith(PREFIX))
            return;

        const args = message.content
            .slice(PREFIX.length)
            .trim()
            .split(/\s+/);

        const command =
            args.shift()?.toLowerCase();

        // ==================================================
        // =PING
        // ==================================================

        if (command === "ping") {

            return message.reply(
                `🏓 Pong! **${client.ws.ping}ms**`
            );

        }

        // ==================================================
        // =BOT
        // ==================================================

        if (command === "bot") {

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("🤖・INFORMACIÓN DEL BOT")
                .addFields(
                    {
                        name: "🤖 Nombre",
                        value: client.user.tag
                    },
                    {
                        name: "📡 Servidores",
                        value:
                            `${client.guilds.cache.size}`
                    },
                    {
                        name: "⚙️ Discord.js",
                        value: "v14"
                    }
                )
                .setTimestamp();

            return message.reply({
                embeds: [embed]
            });

        }

        // ==================================================
        // =UPTIME
        // ==================================================

        if (command === "uptime") {

            const segundos =
                Math.floor(client.uptime / 1000);

            const dias =
                Math.floor(segundos / 86400);

            const horas =
                Math.floor(
                    (segundos % 86400) / 3600
                );

            const minutos =
                Math.floor(
                    (segundos % 3600) / 60
                );

            return message.reply(
                `⏱️ **Uptime:** ${dias}d ${horas}h ${minutos}m`
            );

        }

        // ==================================================
        // =GUIA
        // ==================================================

        if (
            command === "guia" ||
            command === "guía"
        ) {

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("📚・GUÍA DID")
                .setDescription(
                    `Bienvenido/a a la guía de **DID**.`
                )
                .addFields(
                    {
                        name: "🔎 Investigación",
                        value:
                            "Utiliza los canales correspondientes."
                    },
                    {
                        name: "📜 Normativa",
                        value:
                            "Respeta las normas y al personal."
                    },
                    {
                        name: "🆘 Soporte",
                        value:
                            `<#${CANAL_SUPPORT}>`
                    }
                )
                .setTimestamp();

            return message.reply({
                embeds: [embed]
            });

        }

        // ==================================================
        // =SERVER
        // ==================================================

        if (command === "server") {

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("🕵️・SERVIDOR DID")
                .setDescription(
                    `**${message.guild.name}**\n\n` +
                    `🔎 Departamento de Investigación\n` +
                    `🛡️ Comunidad institucional`
                )
                .addFields(
                    {
                        name: "👥 Miembros",
                        value:
                            `${message.guild.memberCount}`,
                        inline: true
                    },
                    {
                        name: "🆔 ID",
                        value:
                            `\`${message.guild.id}\``,
                        inline: true
                    }
                )
                .setTimestamp();

            return message.reply({
                embeds: [embed]
            });

        }

        // ==================================================
        // =SUPPORT
        // ==================================================

        if (command === "support") {

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("🆘・SOPORTE DID")
                .setDescription(
                    `¿Necesitas ayuda?\n\n` +
                    `Dirígete a <#${CANAL_SUPPORT}>.`
                )
                .setTimestamp();

            return message.reply({
                embeds: [embed]
            });

        }

        // ==================================================
        // =INVITE
        // ==================================================

        if (command === "invite") {

            return message.reply(
                `🔗 **Invitación DID:**\n${INVITE}`
            );

        }

        // ==================================================
        // =AVATAR
        // ==================================================

        if (command === "avatar") {

            const usuario =
                message.mentions.users.first() ||
                message.author;

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle(`🖼️・AVATAR DE ${usuario.username}`)
                .setImage(
                    usuario.displayAvatarURL({
                        extension: "png",
                        size: 1024
                    })
                );

            return message.reply({
                embeds: [embed]
            });

        }

        // ==================================================
        // =INFO
        // ==================================================

        if (command === "info") {

            const usuario =
                message.mentions.members.first();

            if (!usuario) {

                return message.reply(
                    "❌ Menciona a un usuario. Ejemplo: `=info @usuario`"
                );

            }

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("👤・INFORMACIÓN DEL USUARIO")
                .setThumbnail(
                    usuario.user.displayAvatarURL({
                        extension: "png"
                    })
                )
                .addFields(
                    {
                        name: "👤 Usuario",
                        value: `${usuario.user.tag}`
                    },
                    {
                        name: "🆔 ID",
                        value: `\`${usuario.id}\``
                    },
                    {
                        name: "📥 Entrada",
                        value:
                            usuario.joinedTimestamp
                                ? `<t:${Math.floor(
                                    usuario.joinedTimestamp / 1000
                                )}:F>`
                                : "Desconocida"
                    }
                )
                .setTimestamp();

            return message.reply({
                embeds: [embed]
            });

        }

        // ==================================================
        // =PRUEBA
        // ==================================================

        if (command === "prueba") {

            if (!esStaff(message.member)) {

                return message.reply(
                    "❌ Solo el Staff puede utilizar este comando."
                );

            }

            const canal =
                message.guild.channels.cache.get(
                    CANAL_BIENVENIDA
                );

            if (!canal) {

                return message.reply(
                    "❌ No encontré el canal de bienvenida."
                );

            }

            await canal.send({
                content: `${message.author}`,
                embeds: [
                    crearBienvenida(message.author)
                ]
            });

            return message.reply(
                "✅ Bienvenida de prueba enviada."
            );

        }

        // ==================================================
        // =CLEAR
        // ==================================================

        if (command === "clear") {

            if (!esStaff(message.member)) {

                return message.reply(
                    "❌ Solo el Staff puede utilizar este comando."
                );

            }

            const cantidad =
                parseInt(args[0]);

            if (
                !cantidad ||
                cantidad < 1 ||
                cantidad > 100
            ) {

                return message.reply(
                    "❌ Usa una cantidad entre 1 y 100."
                );

            }

            if (
                !message.channel
                    .permissionsFor(message.guild.members.me)
                    .has(
                        PermissionsBitField.Flags.ManageMessages
                    )
            ) {

                return message.reply(
                    "❌ No tengo permiso para borrar mensajes."
                );

            }

            await message.channel.bulkDelete(
                cantidad,
                true
            );

            const aviso =
                await message.channel.send(
                    `🧹 Se eliminaron **${cantidad} mensajes**.`
                );

            setTimeout(() => {
                aviso.delete().catch(() => {});
            }, 3000);

            return;

        }

        // ==================================================
        // =LOCK
        // ==================================================

        if (command === "lock") {

            if (!esStaff(message.member)) {

                return message.reply(
                    "❌ Solo el Staff puede utilizar este comando."
                );

            }

            await message.channel.permissionOverwrites.edit(
                message.guild.roles.everyone,
                {
                    SendMessages: false
                }
            );

            return message.reply(
                "🔒 Canal bloqueado correctamente."
            );

        }

        // ==================================================
        // =UNLOCK
        // ==================================================

        if (command === "unlock") {

            if (!esStaff(message.member)) {

                return message.reply(
                    "❌ Solo el Staff puede utilizar este comando."
                );

            }

            await message.channel.permissionOverwrites.edit(
                message.guild.roles.everyone,
                {
                    SendMessages: null
                }
            );

            return message.reply(
                "🔓 Canal desbloqueado correctamente."
            );

        }

        // ==================================================
        // =WARN
        // ==================================================

        if (command === "warn") {

            if (!esStaff(message.member)) {

                return message.reply(
    "❌ Solo el Staff puede utilizar este comando."
);
