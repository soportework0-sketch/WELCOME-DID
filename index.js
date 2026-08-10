const express = require("express");
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

// ==============================
// CONFIGURACIÓN
// ==============================

const PREFIX = "=";

const CANAL_BIENVENIDA = "1536209949645078608";
const CANAL_LOGS = "1536210300770975775";
const CANAL_SUPPORT = "1533650120783040604";
const CANAL_DESPEDIDA = "1536467088133070888";
const STAFF_ROLE = "1536211170971754590";

const INVITE = "https://discord.gg/hKkDghPybK";

// ==============================
// EXPRESS PARA RENDER
// ==============================

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🔎 DID Bot está online.");
});

app.get("/status", (req, res) => {
  res.json({
    status: "online",
    bot: client.user ? client.user.tag : "conectando",
    servidores: client.guilds.cache.size
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Express activo en el puerto ${PORT}`);
});

// ==============================
// CLIENTE DISCORD
// ==============================

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

// ==============================
// FUNCIONES
// ==============================

function esStaff(member) {
  return member.roles.cache.has(STAFF_ROLE);
}

function bienvenida(user) {
  return new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle("🔎・¡BIENVENIDO/A A LA DID!")
    .setDescription(
      `### 👋 ¡Hola, ${user.username}!\n\n` +
      `Nos alegra mucho tenerte en **DID • Departamento de Investigación**. 🕵️\n\n` +
      `🛡️ Respeta la normativa, mantén una buena conducta ` +
      `y disfruta de nuestra comunidad.\n\n` +
      `🔗 **Únete a nuestra comunidad:**\n${INVITE}\n\n` +
      `> 🔎 **Investiga. Analiza. Descubre.**\n` +
      `> ¡Esperamos verte participando! ❤️‍🩹`
    )
    .setThumbnail(
      user.displayAvatarURL({
        extension: "png",
        size: 256
      })
    )
    .setFooter({
      text: "DID • Departamento de Investigación"
    })
    .setTimestamp();
}

function despedida(user) {
  return new EmbedBuilder()
    .setColor(0xED4245)
    .setTitle("👋・HASTA PRONTO")
    .setDescription(
      `**${user.tag}** ha salido de la DID.\n\n` +
      `Esperamos volver a verte pronto. 🥺\n\n` +
      `🔎 **DID • Departamento de Investigación**`
    )
    .setThumbnail(
      user.displayAvatarURL({
        extension: "png",
        size: 256
      })
    )
    .addFields({
      name: "🆔 ID",
      value: `\`${user.id}\``,
      inline: true
    })
    .setFooter({
      text: "DID • Sistema de despedidas"
    })
    .setTimestamp();
}

// ==============================
// BOT LISTO
// ==============================

client.once("ready", () => {
  console.log("================================");
  console.log("🔎 DID BOT ONLINE");
  console.log(`🤖 ${client.user.tag}`);
  console.log(`📡 Servidores: ${client.guilds.cache.size}`);
  console.log("================================");

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

// ==============================
// USUARIO ENTRA
// ==============================

client.on("guildMemberAdd", async (member) => {
  try {
    const canal = member.guild.channels.cache.get(
      CANAL_BIENVENIDA
    );

    if (canal) {
      await canal.send({
        content: `${member}`,
        embeds: [bienvenida(member.user)]
      });
    }

    const logs = member.guild.channels.cache.get(
      CANAL_LOGS
    );

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
            value: `<t:${Math.floor(
              member.user.createdTimestamp / 1000
            )}:F>`
          }
        )
        .setThumbnail(
          member.user.displayAvatarURL({
            extension: "png"
          })
        )
        .setTimestamp();

      await logs.send({
        embeds: [embed]
      });
    }
  } catch (error) {
    console.error("❌ Error al dar bienvenida:", error);
  }
});

// ==============================
// USUARIO SALE
// ==============================

client.on("guildMemberRemove", async (member) => {
  try {
    const canal = member.guild.channels.cache.get(
      CANAL_DESPEDIDA
    );

    if (canal) {
      await canal.send({
        embeds: [despedida(member.user)]
      });
    }

    const logs = member.guild.channels.cache.get(
      CANAL_LOGS
    );

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
        .setTimestamp();

      await logs.send({
        embeds: [embed]
      });
    }
  } catch (error) {
    console.error("❌ Error en despedida:", error);
  }
});

// ==============================
// COMANDOS
// ==============================

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content
      .slice(PREFIX.length)
      .trim()
      .split(/\s+/);

    const command = args.shift().toLowerCase();

    // ==========================
    // =PING
    // ==========================

    if (command === "ping") {
      return message.reply(
        `🏓 Pong! **${client.ws.ping}ms**`
      );
    }

    // ==========================
    // =BOT
    // ==========================

    if (command === "bot") {
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("🤖・DID BOT")
        .setDescription(
          "Bot oficial de bienvenida y administración de la DID."
        )
        .addFields(
          {
            name: "📡 Servidores",
            value: `${client.guilds.cache.size}`,
            inline: true
          },
          {
            name: "🏠 Prefijo",
            value: "`=`",
            inline: true
          },
          {
            name: "⚙️ Discord.js",
            value: "v14",
            inline: true
          }
        )
        .setTimestamp();

      return message.reply({
        embeds: [embed]
      });
    }

    // ==========================
    // =UPTIME
    // ==========================

    if (command === "uptime") {
      const segundos = Math.floor(client.uptime / 1000);
      const dias = Math.floor(segundos / 86400);
      const horas = Math.floor(
        (segundos % 86400) / 3600
      );
      const minutos = Math.floor(
        (segundos % 3600) / 60
      );

      return message.reply(
        `⏱️ **Uptime:** ${dias}d ${horas}h ${minutos}m`
      );
    }

    // ==========================
    // =GUÍA
    // ==========================

    if (command === "guia" || command === "guía") {
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("📚・GUÍA DID")
        .setDescription(
          "Bienvenido/a a la guía oficial de la DID."
        )
        .addFields(
          {
            name: "📜 Normativa",
            value:
              "Respeta las normas y al personal."
          },
          {
            name: "🔎 Investigación",
            value:
              "Utiliza los canales correspondientes."
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

    // ==========================
    // =SERVER
    // ==========================

    if (command === "server") {
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("🏠・SERVIDOR DID")
        .setDescription(
          `**${message.guild.name}**\n\n` +
          "🔎 Departamento de Investigación\n" +
          "🛡️ Comunidad DID"
        )
        .addFields(
          {
            name: "👥 Miembros",
            value: `${message.guild.memberCount}`,
            inline: true
          },
          {
            name: "🆔 ID",
            value: `\`${message.guild.id}\``,
            inline: true
          }
        )
        .setTimestamp();

      return message.reply({
        embeds: [embed]
      });
    }

    // ==========================
    // =SUPPORT
    // ==========================

    if (command === "support") {
      return message.reply(
        `🆘 **Soporte DID:** <#${CANAL_SUPPORT}>`
      );
    }

    // ==========================
    // =INVITE
    // ==========================

    if (command === "invite") {
      return message.reply(
        `🔗 **Invitación DID:**\n${INVITE}`
      );
    }

    // ==========================
    // =AVATAR
    // ==========================

    if (command === "avatar") {
      const user =
        message.mentions.users.first() ||
        message.author;

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(`🖼️・AVATAR DE ${user.username}`)
        .setImage(
          user.displayAvatarURL({
            extension: "png",
            size: 1024
          })
        );

      return message.reply({
        embeds: [embed]
      });
    }

    // ==========================
    // =INFO
    // ==========================

    if (command === "info") {
      const member =
        message.mentions.members.first();

      if (!member) {
        return message.reply(
          "❌ Menciona a un usuario.\nEjemplo: `=info @usuario`"
        );
      }

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("👤・INFORMACIÓN")
        .setThumbnail(
          member.user.displayAvatarURL({
            extension: "png"
          })
        )
        .addFields(
          {
            name: "👤 Usuario",
            value: member.user.tag
          },
          {
            name: "🆔 ID",
            value: `\`${member.id}\``
          },
          {
            name: "📥 Entrada",
            value: member.joinedTimestamp
              ? `<t:${Math.floor(
                  member.joinedTimestamp / 1000
                )}:F>`
              : "Desconocida"
          }
        )
        .setTimestamp();

      return message.reply({
        embeds: [embed]
      });
    }

    // ==========================
    // =STATS
    // ==========================

    if (command === "stats") {
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("📊・ESTADÍSTICAS")
        .addFields(
          {
            name: "👥 Miembros",
            value: `${message.guild.memberCount}`,
            inline: true
          },
          {
            name: "💬 Canales",
            value: `${message.guild.channels.cache.size}`,
            inline: true
          },
          {
            name: "🎭 Roles",
            value: `${message.guild.roles.cache.size}`,
            inline: true
          },
          {
            name: "🚀 Boosts",
            value: `${message.guild.premiumSubscriptionCount || 0}`,
            inline: true
          }
        )
        .setTimestamp();

      return message.reply({
        embeds: [embed]
      });
    }

    // ==========================
    // =STAFF
    // ==========================

    if (command === "staff") {
      const role =
        message.guild.roles.cache.get(STAFF_ROLE);

      if (!role) {
        return message.reply(
          "❌ No encontré el rol Staff."
        );
      }

      const miembros =
        role.members.map(
          member => `• ${member.user.tag}`
        );

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("🛡️・STAFF DID")
        .setDescription(
          miembros.length
            ? miembros.join("\n")
            : "No hay miembros del Staff."
        )
        .setFooter({
          text: `Total: ${miembros.length}`
        });

      return message.reply({
        embeds: [embed]
      });
    }

    // ==========================
    // COMANDOS SOLO STAFF
    // ==========================

    if (
      [
        "prueba",
        "clear",
        "lock",
        "unlock",
        "warn"
      ].includes(command)
    ) {
      if (!esStaff(message.member)) {
        return message.reply(
          "❌ Solo el Staff puede utilizar este comando."
        );
      }
    }

    // ==========================
    // =PRUEBA
    // ==========================

    if (command === "prueba") {
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
        embeds: [bienvenida(message.author)]
      });

      return message.reply(
        "✅ Bienvenida de prueba enviada."
      );
    }

    // ==========================
    // =CLEAR
    // ==========================

    if (command === "clear") {
      const cantidad = parseInt(args[0]);

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

      return message.channel.send(
        `🧹 Se eliminaron **${cantidad} mensajes**.`
      );
    }

    // ==========================
    // =LOCK
    // ==========================

    if (command === "lock") {
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

    // ==========================
    // =UNLOCK
    // ==========================

    if (command === "unlock") {
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

    // ==========================
    // =WARN
    // ==========================

    if (command === "warn") {
      const member =
        message.mentions.members.first();

      if (!member) {
        return message.reply(
          "❌ Menciona al usuario."
        );
      }

      const motivo =
        args.slice(1).join(" ") ||
        "Sin motivo especificado";

      const embed = new EmbedBuilder()
        .setColor(0xFEE75C)
        .setTitle("⚠️・ADVERTENCIA")
        .setDescription(
          `${member} recibió una advertencia.`
        )
        .addFields(
          {
            name: "👤 Usuario",
            value: member.user.tag
          },
          {
            name: "📝 Motivo",
            value: motivo
          },
          {
            name: "🛡️ Staff",
            value: message.author.tag
          }
        )
        .setTimestamp();

      await message.channel.send({
        embeds: [embed]
      });

      const logs =
        message.guild.channels.cache.get(
          CANAL_LOGS
        );

      if (logs) {
        await logs.send({
          embeds: [embed]
        });
      }

      return;
    }

  } catch (error) {
    console.error(
      "❌ Error ejecutando comando:",
      error
    );
  }
});

// ==============================
// ERRORES
// ==============================

client.on("error", error => {
  console.error("❌ Error Discord:", error);
});

process.on("unhandledRejection", error => {
  console.error("❌ Unhandled Rejection:", error);
});

process.on("uncaughtException", error => {
  console.error("❌ Uncaught Exception:", error);
});

// ==============================
// TOKEN
// ==============================

if (!process.env.TOKEN) {
  console.error(
    "❌ Falta la variable TOKEN en Render."
  );
  process.exit(1);
}

client.login(process.env.TOKEN);
