const express = require("express");

const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

// ======================================================
// CONFIGURACIÓN
// ======================================================

const PREFIX = "=";

const CANAL_BIENVENIDA = "1536209949645078608";
const CANAL_LOGS_UNION = "1536210300770975775";
const CANAL_SUPPORT = "1533650120783040604";
const CANAL_DESPEDIDA = "1536467088133070888";
const STAFF_ROLE = "1536211170971754590";

const INVITE = "https://discord.gg/hKkDghPybK";

// ======================================================
// EXPRESS PARA RENDER
// ======================================================

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send("🔎 DID BOT ONLINE");
});

app.get("/status", (req, res) => {
  res.json({
    online: true,
    bot: client.user ? client.user.tag : "conectando",
    guilds: client.guilds.cache.size,
    uptime: client.uptime
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Express funcionando en puerto ${PORT}`);
});

// ======================================================
// CLIENTE DISCORD
// ======================================================

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

// ======================================================
// FUNCIONES
// ======================================================

function esStaff(member) {
  if (!member) return false;

  return member.roles.cache.has(STAFF_ROLE);
}

// ======================================================
// EMBED DE BIENVENIDA
// ======================================================

function crearBienvenida(user) {
  return new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle("🔎・¡BIENVENIDO/A A LA DID!")
    .setDescription(
      `## 👋 ¡Hola, ${user.username}!\n\n` +
      `Nos alegra muchísimo tenerte aquí. ❤️‍🩹\n\n` +
      `🔎 **DID • Departamento de Investigación**\n\n` +
      `Disfruta de nuestra comunidad, respeta a los demás ` +
      `y no olvides revisar las indicaciones del servidor.\n\n` +
      `🔗 **Únete también desde aquí:**\n${INVITE}\n\n` +
      `> 🕵️ Investiga • Analiza • Descubre\n` +
      `> ¡Esperamos que disfrutes tu estancia!`
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

// ======================================================
// EMBED DE DESPEDIDA
// ======================================================

function crearDespedida(user) {
  return new EmbedBuilder()
    .setColor(0xED4245)
    .setTitle("👋・HASTA PRONTO")
    .setDescription(
      `**${user.tag}** ha salido de la DID.\n\n` +
      `Esperamos volver a verte pronto. ❤️‍🩹`
    )
    .addFields({
      name: "🆔 ID",
      value: `\`${user.id}\``,
      inline: true
    })
    .setThumbnail(
      user.displayAvatarURL({
        extension: "png",
        size: 256
      })
    )
    .setFooter({
      text: "DID • Sistema de despedidas"
    })
    .setTimestamp();
}

// ======================================================
// GUÍA NORMAL
// ======================================================

function crearGuiaNormal() {
  return new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle("📚・GUÍA DE COMANDOS DID")
    .setDescription(
      "Estos son los comandos que puedes utilizar."
    )
    .addFields(
      {
        name: "🔎 Información",
        value:
          "`=ping`\n" +
          "`=bot`\n" +
          "`=uptime`\n" +
          "`=server`\n" +
          "`=stats`\n" +
          "`=invite`\n" +
          "`=support`"
      },
      {
        name: "👤 Usuarios",
        value:
          "`=user`\n" +
          "`=info @usuario`\n" +
          "`=avatar @usuario`\n" +
          "`=banner @usuario`\n" +
          "`=roles @usuario`\n" +
          "`=joined @usuario`\n" +
          "`=account @usuario`"
      },
      {
        name: "🎫 Soporte",
        value:
          "`=ticket`\n" +
          "`=ticket-close`\n" +
          "`=ticket-delete`\n" +
          "`=ticket-claim`"
      },
      {
        name: "🎮 Diversión",
        value:
          "`=8ball pregunta`\n" +
          "`=dado`\n" +
          "`=moneda`\n" +
          "`=ship @usuario @usuario`\n" +
          "`=rate @usuario`\n" +
          "`=abrazo @usuario`\n" +
          "`=beso @usuario`\n" +
          "`=slap @usuario`\n" +
          "`=chiste`"
      }
    )
    .setFooter({
      text: "DID • Escribe =guia para volver a ver esta lista"
    })
    .setTimestamp();
}

// ======================================================
// GUÍA STAFF
// ======================================================

function crearGuiaStaff() {
  return new EmbedBuilder()
    .setColor(0xED4245)
    .setTitle("🛡️・GUÍA STAFF DID")
    .setDescription(
      "Comandos disponibles para el personal Staff."
    )
    .addFields(
      {
        name: "👮 Staff",
        value:
          "`=staff`\n" +
          "`=staffinfo`"
      },
      {
        name: "⚠️ Moderación",
        value:
          "`=warn @usuario motivo`\n" +
          "`=warnings @usuario`\n" +
          "`=unwarn @usuario`\n" +
          "`=kick @usuario motivo`\n" +
          "`=ban @usuario motivo`\n" +
          "`=unban ID`\n" +
          "`=timeout @usuario tiempo`\n" +
          "`=untimeout @usuario`\n" +
          "`=mute @usuario`\n" +
          "`=unmute @usuario`"
      },
      {
        name: "🧹 Canales",
        value:
          "`=clear cantidad`\n" +
          "`=lock`\n" +
          "`=unlock`\n" +
          "`=slowmode segundos`"
      },
      {
        name: "👤 Gestión",
        value:
          "`=nick @usuario nombre`\n" +
          "`=addrole @usuario @rol`\n" +
          "`=removerole @usuario @rol`"
      },
      {
        name: "👋 Bienvenida",
        value:
          "`=prueba`\n" +
          "`=welcome`\n" +
          "`=goodbye`"
      }
    )
    .setFooter({
      text: "DID • Comandos exclusivos del Staff"
    })
    .setTimestamp();
}

// ======================================================
// BOT LISTO
// ======================================================

client.once("ready", () => {
  console.log("================================");
  console.log("🔎 DID BOT ONLINE");
  console.log(`🤖 Usuario: ${client.user.tag}`);
  console.log(`📡 Servidores: ${client.guilds.cache.size}`);
  console.log("🔴 Estado: DND");
  console.log("================================");

  // SIEMPRE DND
  client.user.setPresence({
    status: "dnd",

    activities: [
      {
        name: "aplica =guia",
        type: 0
      }
    ]
  });
});

// ======================================================
// USUARIO ENTRA
// ======================================================

client.on("guildMemberAdd", async (member) => {
  try {
    // ------------------------------------------
    // CANAL DE BIENVENIDA
    // ------------------------------------------

    const canalBienvenida =
      member.guild.channels.cache.get(
        CANAL_BIENVENIDA
      );

    if (canalBienvenida) {
      await canalBienvenida.send({
        content: `${member}`,
        embeds: [
          crearBienvenida(member.user)
        ]
      });
    }

    // ------------------------------------------
    // MENSAJE PRIVADO
    // ------------------------------------------

    try {
      await member.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("💙 ¡Bienvenido/a a la DID!")
            .setDescription(
              `Hola **${member.user.username}** 👋\n\n` +
              `Gracias por unirte a nuestra comunidad.\n\n` +
              `🔗 **Invitación:**\n${INVITE}\n\n` +
              `📚 Recuerda usar \`=guia\` dentro del servidor ` +
              `para consultar los comandos disponibles.`
            )
            .setFooter({
              text: "DID • Departamento de Investigación"
            })
            .setTimestamp()
        ]
      });
    } catch (error) {
      console.log(
        `⚠️ No se pudo enviar MD a ${member.user.tag}`
      );
    }

    // ------------------------------------------
    // LOG AUTOMÁTICO DE USUARIO UNIDO
    // ------------------------------------------

    const canalLogs =
      member.guild.channels.cache.get(
        CANAL_LOGS_UNION
      );

    if (canalLogs) {
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

      await canalLogs.send({
        embeds: [embed]
      });
    }

  } catch (error) {
    console.error(
      "❌ Error en bienvenida:",
      error
    );
  }
});

// ======================================================
// USUARIO SALE
// ======================================================

client.on("guildMemberRemove", async (member) => {
  try {
    const canal =
      member.guild.channels.cache.get(
        CANAL_DESPEDIDA
      );

    if (!canal) return;

    await canal.send({
      embeds: [
        crearDespedida(member.user)
      ]
    });

  } catch (error) {
    console.error(
      "❌ Error en despedida:",
      error
    );
  }
});

// ======================================================
// MENSAJES Y COMANDOS
// ======================================================

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.guild) return;

    if (!message.content.startsWith(PREFIX)) {
      return;
    }

    const args = message.content
      .slice(PREFIX.length)
      .trim()
      .split(/\s+/);

    const command =
      args.shift().toLowerCase();

    // ==================================================
    // GUÍA
    // ==================================================

    if (
      command === "guia" ||
      command === "guía" ||
      command === "help" ||
      command === "ayuda"
    ) {
      if (esStaff(message.member)) {
        return message.reply({
          embeds: [crearGuiaStaff()]
        });
      }

      return message.reply({
        embeds: [crearGuiaNormal()]
      });
    }

    // ==================================================
    // PING
    // ==================================================

    if (command === "ping") {
      return message.reply(
        `🏓 Pong! **${client.ws.ping}ms**`
      );
    }

    // ==================================================
    // BOT
    // ==================================================

    if (command === "bot") {
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("🤖・DID BOT")
        .setDescription(
          "Bot oficial de la DID."
        )
        .addFields(
          {
            name: "📡 Servidores",
            value: `${client.guilds.cache.size}`,
            inline: true
          },
          {
            name: "🔴 Estado",
            value: "DND",
            inline: true
          },
          {
            name: "📚 Ayuda",
            value: "`=guia`",
            inline: true
          }
        )
        .setTimestamp();

      return message.reply({
        embeds: [embed]
      });
    }

    // ==================================================
    // UPTIME
    // ==================================================

    if (command === "uptime") {
      const total =
        Math.floor(client.uptime / 1000);

      const dias =
        Math.floor(total / 86400);

      const horas =
        Math.floor(
          (total % 86400) / 3600
        );

      const minutos =
        Math.floor(
          (total % 3600) / 60
        );

      const segundos =
        total % 60;

      return message.reply(
        `⏱️ **Tiempo activo:** ${dias}d ${horas}h ${minutos}m ${segundos}s`
      );
    }

    // ==================================================
    // SERVER
    // ==================================================

    if (command === "server") {
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("🏠・SERVIDOR")
        .setDescription(
          `**${message.guild.name}**`
        )
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
          }
        )
        .setTimestamp();

      return message.reply({
        embeds: [embed]
      });
    }

    // ==================================================
    // STATS
    // ==================================================

    if (command === "stats") {
      return message.reply(
        `📊 **Estadísticas**\n\n` +
        `👥 Miembros: **${message.guild.memberCount}**\n` +
        `💬 Canales: **${message.guild.channels.cache.size}**\n` +
        `🎭 Roles: **${message.guild.roles.cache.size}**\n` +
        `🚀 Boosts: **${message.guild.premiumSubscriptionCount || 0}**`
      );
    }

    // ==================================================
    // INVITE
    // ==================================================

    if (command === "invite") {
      return message.reply(
        `🔗 **Invitación DID:**\n${INVITE}`
      );
    }

    // ==================================================
    // SUPPORT
    // ==================================================

    if (command === "support") {
      return message.reply(
        `🆘 **Soporte:** <#${CANAL_SUPPORT}>`
      );
    }

    // ==================================================
    // USER / INFO
    // ==================================================

    if (
      command === "user" ||
      command === "info"
    ) {
      const user =
        message.mentions.users.first() ||
        message.author;

      const member =
        message.guild.members.cache.get(
          user.id
        );

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(`👤・${user.username}`)
        .setThumbnail(
          user.displayAvatarURL({
            extension: "png",
            size: 256
          })
        )
        .addFields(
          {
            name: "🆔 ID",
            value: `\`${user.id}\``
          },
          {
            name: "📅 Cuenta creada",
            value: `<t:${Math.floor(
              user.createdTimestamp / 1000
            )}:F>`
          },
          {
            name: "📥 Entró al servidor",
            value:
              member && member.joinedTimestamp
                ? `<t:${Math.floor(
                    member.joinedTimestamp / 1000
                  )}:F>`
                : "No disponible"
          }
        )
        .setTimestamp();

      return message.reply({
        embeds: [embed]
      });
    }

    // ==================================================
    // AVATAR
    // ==================================================

    if (command === "avatar") {
      const user =
        message.mentions.users.first() ||
        message.author;

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(
          `🖼️・AVATAR DE ${user.username}`
        )
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

    // ==================================================
    // BANNER
    // ==================================================

    if (command === "banner") {
      const user =
        message.mentions.users.first() ||
        message.author;

      const fetched =
        await client.users.fetch(
          user.id,
          {
            force: true
          }
        );

      if (!fetched.banner) {
        return message.reply(
          "❌ Este usuario no tiene banner."
        );
      }

      const url =
        fetched.bannerURL({
          extension: "png",
          size: 1024
        });

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(
              `🖼️・BANNER DE ${user.username}`
            )
            .setImage(url)
        ]
      });
    }

    // ==================================================
    // ROLES
    // ==================================================

    if (command === "roles") {
      const member =
        message.mentions.members.first() ||
        message.member;

      const roles =
        member.roles.cache
          .filter(role => role.id !== message.guild.id)
          .map(role => role.toString());

      return message.reply(
        roles.length
          ? `🎭 **Roles de ${member.user.username}:**\n${roles.join(" ")}`
          : "🎭 Este usuario no tiene roles."
      );
    }

    // ==================================================
    // JOINED
    // ==================================================

    if (command === "joined") {
      const member =
        message.mentions.members.first() ||
        message.member;

      if (!member.joinedTimestamp) {
        return message.reply(
          "❌ No pude obtener la fecha."
        );
      }

      return message.reply(
        `📥 **${member.user.username}** entró al servidor el <t:${Math.floor(
          member.joinedTimestamp / 1000
        )}:F>.`
      );
    }

    // ==================================================
    // ACCOUNT
    // ==================================================

    if (command === "account") {
      const user =
        message.mentions.users.first() ||
        message.author;

      return message.reply(
        `👤 **${user.tag}** creó su cuenta el <t:${Math.floor(
          user.createdTimestamp / 1000
        )}:F>.`
      );
    }

    // ==================================================
    // STAFF
    // ==================================================

    if (command === "staff") {
      const role =
        message.guild.roles.cache.get(
          STAFF_ROLE
        );

      if (!role) {
        return message.reply(
          "❌ No encontré el rol Staff."
        );
      }

      const miembros =
        role.members.map(
          member =>
            `• ${member.user.tag}`
        );

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle("🛡️・STAFF DID")
            .setDescription(
              miembros.length
                ? miembros.join("\n")
                : "No hay Staff."
            )
            .setFooter({
              text: `Total: ${miembros.length}`
            })
        ]
      });
    }

    // ==================================================
    // COMPROBAR STAFF
    // ==================================================

    const comandosStaf
