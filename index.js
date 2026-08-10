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

// Canales
const CANAL_BIENVENIDA = "1536209949645078608";
const CANAL_LOGS = "1536210300770975775";
const CANAL_SUPPORT = "1533650120783040604";

// Rol Staff
const STAFF_ROLE = "1536211170971754590";

// ==================================================
// CLIENTE
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

        .setTitle("🔎・¡BIENVENIDO/A A LA DID!")

        .setDescription(
            `> **Departamento de Investigación**\n\n` +

            `👋 Bienvenido/a, ${usuario}.\n` +

            `Nos alegra tenerte dentro de la **DID**.\n\n` +

            `🛡️ Respeta la normativa, mantén la ` +
            `confidencialidad y actúa siempre con ` +
            `profesionalismo.\n\n` +

            `> **🔎 Investiga. Analiza. Descubre.**\n\n` +

            `**¡Tu misión comienza ahora!** 🕵️‍♂️`
        )

        .setThumbnail(
            usuario.displayAvatarURL({
                extension: "png",
                size: 256
            })
        )

        .setFooter({
            text:
                "DID • Departamento de Investigación"
        })

        .setTimestamp();
}

// ==================================================
// NUEVO USUARIO
// ==================================================

client.on("guildMemberAdd", async (member) => {

    try {

        // ==========================================
        // CANAL DE BIENVENIDA
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
        // CANAL DE LOGS
        // ==========================================

        const canalLogs =
            member.guild.channels.cache.get(
                CANAL_LOGS
            );

        if (canalLogs) {

            const log = new EmbedBuilder()

                .setTitle("🟢・USUARIO UNIDO")

                .setDescription(
                    "Un nuevo usuario se ha unido al servidor."
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
                            )}:F>`,
                        inline: false
                    },

                    {
                        name: "📥 Ingreso",
                        value:
                            `<t:${Math.floor(
                                Date.now() / 1000
                            )}:F>`,
                        inline: false
                    }

                )

                .setThumbnail(
                    member.user.displayAvatarURL({
                        extension: "png",
                        size: 256
                    })
                )

                .setFooter({
                    text:
                        "DID • Sistema de Logs"
                })

                .setTimestamp();

            await canalLogs.send({

                embeds: [log]

            });

        }

    } catch (error) {

        console.error(
            "❌ Error al procesar nuevo usuario:",
            error
        );

    }

});

// ==================================================
// COMANDOS
// ==================================================

client.on("messageCreate", async (message) => {

    try {

        // Ignorar bots
        if (message.author.bot) return;

        // Solo comandos con =
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

                .setTitle("📚・GUÍA DID")

                .setDescription(
                    "Bienvenido/a a la guía de la " +
                    "**DID — Departamento de Investigación**."
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
                            "Mantén una actitud respetuosa " +
                            "y profesional."
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

                .setTitle("🕵️・SERVIDOR DID")

                .setDescription(

                    `**${message.guild.name}**\n\n` +

                    "🔎 Departamento de Investigación\n" +

                    "🛡️ Comunidad institucional\n" +

                    "📋 Sistema de investigación y organización"

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

                .setTitle("🆘・SOPORTE DID")

                .setDescription(

                    `¿Necesitas ayuda?\n\n` +

                    `Dirígete al canal ` +
                    `<#${CANAL_SUPPORT}> ` +
                    `para recibir asistencia.`

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

            // Comprobar Staff
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
// ERRORES DEL CLIENTE
// ==================================================

client.on("error", (error) => {

    console.error(
        "❌ Error del cliente:",
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
// LOGIN
// ==================================================

if (!process.env.TOKEN) {

    console.error(
        "❌ ERROR: No se encontró la variable TOKEN."
    );

    console.error(
        "Configura TOKEN en las variables de entorno."
    );

    process.exit(1);

}

client.login(process.env.TOKEN);
