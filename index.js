const express = require("express");

const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder
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
// EXPRESS - RENDER
// ==================================================

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.status(200).send(
        "🔎 DID Bot está funcionando correctamente."
    );
});

app.get("/status", (req, res) => {
    res.status(200).json({
        status: "online",
        bot: client.user ? client.user.tag : "connecting",
        server: client.guilds.cache.size
    });
});

app.listen(PORT, () => {
    console.log("======================================");
    console.log("🌐 EXPRESS INICIADO");
    console.log(`🚀 Puerto: ${PORT}`);
    console.log("======================================");
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

    console.log("======================================");
    console.log("       🔎 DID BOT INICIADO");
    console.log("======================================");

    console.log(`🤖 Bot: ${client.user.tag}`);
    console.log(`📡 Servidores: ${client.guilds.cache.size}`);
    console.log(`⌨️ Prefijo: ${PREFIX}`);

    console.log("======================================");

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
// FUNCIÓN DE BIENVENIDA
// ==================================================

function crearBienvenida(usuario) {

    return new EmbedBuilder()

        .setColor(0x2B2D31)

        .setAuthor({
            name: "DID • Departamento de Investigación"
        })

        .setTitle("🔎・¡BIENVENIDO/A A LA DID!")

        .setDescription(
            `### 👋 ¡Hola, ${usuario.username}!\n\n` +

            `Nos alegra mucho tenerte con nosotros en ` +
            `**DID • Departamento de Investigación**. 🕵️\n\n` +

            `🛡️ **Recuerda:** respeta a los demás, ` +
            `cumple la normativa y disfruta de tu estancia ` +
            `en nuestra comunidad.\n\n` +

            `🔗 **Únete y conoce más:**\n` +
            `${INVITE}\n\n` +

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
// FUNCIÓN DE DESPEDIDA
// ==================================================

function crearDespedida(usuario) {

    return new EmbedBuilder()

        .setColor(0x2B2D31)

        .setTitle("👋・USUARIO SALIÓ")

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
// USUARIO SE UNE
// ==================================================

client.on("guildMemberAdd", async (member) => {

    try {

        // ==========================================
        // BIENVENIDA
        // ==========================================

        const canalBienvenida =
            member.guild.channels.cache.get(
                CANAL_BIENVENIDA
            );

        if (canalBienvenida) {

            const bienvenida =
                crearBienvenida(member.user);

            await canalBienvenida.send({

                content: `${member}`,

                embeds: [bienvenida]

            });

        }

        // ==========================================
        // LOG DE USUARIO
        // ==========================================

        const canalLogs =
            member.guild.channels.cache.get(
                CANAL_LOGS
            );

        if (canalLogs) {

            const log = new EmbedBuilder()

                .setColor(0x57F287)

                .setTitle("🟢・USUARIO UNIDO")

                .setDescription(
                    `Un nuevo usuario se ha unido al servidor.`
                )

                .addFields(

                    {
                        name: "👤 Usuario",
                        value: `${member}`,
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
                    },

                    {
                        name: "📥 Ingreso",
                        value:
                            `<t:${Math.floor(
                                Date.now() / 1000
                            )}:F>`
                    }

                )

                .setThumbnail(
                    member.user.displayAvatarURL({
                        extension: "png",
                        size: 256
                    })
                )

                .setFooter({
                    text: "DID • Sistema de Logs"
                })

                .setTimestamp();

            await canalLogs.send({
                embeds: [log]
            });

        }

    } catch (error) {

        console.error(
            "❌ Error al procesar usuario unido:",
            error
        );

    }

});

// ==================================================
// USUARIO SE VA
// ==================================================

client.on("guildMemberRemove", async (member) => {

    try {

        const canalDespedida =
            member.guild.channels.cache.get(
                CANAL_DESPEDIDA
            );

        if (!canalDespedida) {

            console.log(
                "⚠️ Canal de despedida no encontrado."
            );

            return;

        }

        const despedida =
            crearDespedida(member.user);

        await canalDespedida.send({

            embeds: [despedida]

        });

        // ==========================================
        // TAMBIÉN REGISTRAR EN LOGS
        // ==========================================

        const canalLogs =
            member.guild.channels.cache.get(
                CANAL_LOGS
            );

        if (canalLogs) {

            const log = new EmbedBuilder()

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
                        extension: "png",
                        size: 256
                    })
                )

                .setFooter({
                    text: "DID • Sistema de Logs"
                })

                .setTimestamp();

            await canalLogs.send({
                embeds: [log]
            });

        }

    } catch (error) {

        console.error(
            "❌ Error al procesar despedida:",
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

        // ==========================================
        // =GUÍA
        // ==========================================

        if (
            command === "guia" ||
            command === "guía"
        ) {

            const guia = new EmbedBuilder()

                .setColor(0x2B2D31)

                .setTitle("📚・GUÍA DID")

                .setDescription(
                    `Bienvenido/a a la guía oficial de ` +
                    `**DID • Departamento de Investigación**.`
                )

                .addFields(

                    {
                        name: "🔎 Investigación",
                        value:
                            "Utiliza los canales correspondientes " +
                            "para cada investigación."
                    },

                    {
                        name: "📜 Normativa",
                        value:
                            "Respeta siempre las normas y las " +
                            "indicaciones del personal autorizado."
                    },

                    {
                        name: "🛡️ Conducta",
                        value:
                            "Mantén una actitud respetuosa, " +
                            "profesional y responsable."
                    },

                    {
                        name: "🆘 Soporte",
                        value:
                            `<#${CANAL_SUPPORT}>`
                    }

                )

                .setFooter({
                    text:
                        "DID • Departamento de Investigación"
                })

                .setTimestamp();

            return message.reply({
                embeds: [guia]
            });

        }

        // ==========================================
        // =SERVER
        // ==========================================

        if (command === "server") {

            const server = new EmbedBuilder()

                .setColor(0x2B2D31)

                .setTitle("🕵️・SERVIDOR DID")

                .setDescription(

                    `**${message.guild.name}**\n\n` +

                    `🔎 Departamento de Investigación\n` +

                    `🛡️ Comunidad institucional\n` +

                    `📋 Sistema de investigación\n` +

                    `👥 Comunidad DID`

                )

                .addFields({

                    name: "👥 Miembros",

                    value:
                        `${message.guild.memberCount}`,

                    inline: true

                })

                .setFooter({
                    text:
                        "DID • Información del servidor"
                })

                .setTimestamp();

            return message.reply({
                embeds: [server]
            });

        }

        // ==========================================
        // =SUPPORT
        // ==========================================

        if (command === "support") {

            const support = new EmbedBuilder()

                .setColor(0x2B2D31)

                .setTitle("🆘・SOPORTE DID")

                .setDescription(

                    `¿Necesitas ayuda?\n\n` +

                    `Dirígete al canal ` +
                    `<#${CANAL_SUPPORT}> ` +
                    `para recibir asistencia.\n\n` +

                    `Nuestro equipo estará disponible ` +
                    `para ayudarte.`

                )

                .setFooter({
                    text:
                        "DID • Sistema de Soporte"
                })

                .setTimestamp();

            return message.reply({
                embeds: [support]
            });

        }

        // ==========================================
        // =PRUEBA
        // ==========================================

        if (command === "prueba") {

            if (
                !message.member.roles.cache.has(
                    STAFF_ROLE
                )
            ) {

                return message.reply({
                    content:
                        "❌ No tienes permisos para utilizar este comando."
                });

            }

            const canalBienvenida =
                message.guild.channels.cache.get(
                    CANAL_BIENVENIDA
                );

            if (!canalBienvenida) {

                return message.reply({
                    content:
                        "❌ No se encontró el canal de bienvenida."
                });

            }

            const bienvenida =
                crearBienvenida(message.author);

            await canalBienvenida.send({

                content:
                    `${message.author}`,

                embeds: [bienvenida]

            });

            return message.reply({
                content:
                    "✅ La bienvenida de prueba fue enviada correctamente."
            });

        }

    } catch (error) {

        console.error(
            "❌ Error al ejecutar comando:",
            error
        );

    }

});

// ==================================================
// ERRORES DISCORD
// ==================================================

client.on("error", (error) => {

    console.error(
        "❌ Error del cliente Discord:",
        error
    );

});

// ==================================================
// ERRORES NO CONTROLADOS
// ==================================================

process.on(
    "unhandledRejection",
    (error) => {

        console.error(
            "❌ Unhandled Rejection:",
            error
        );

    }
);

process.on(
    "uncaughtException",
    (error) => {

        console.error(
            "❌ Uncaught Exception:",
            error
        );

    }
);

// ==================================================
// TOKEN
// ==================================================

if (!process.env.TOKEN) {

    console.error(
        "❌ ERROR: No se encontró TOKEN."
    );

    console.error(
        "Agrega TOKEN en las Environment Variables de Render."
    );

    process.exit(1);

}

client.login(process.env.TOKEN);
