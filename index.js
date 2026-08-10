const express = require("express");

const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder
} = require("discord.js");

// ======================================================
// CONFIGURACIÓN
// ======================================================

const TOKEN = process.env.TOKEN;

// Canal de logs generales
const LOG_CHANNEL_ID = "1536209949645078608";

// Canal de bienvenida
const JOIN_LOG_CHANNEL_ID = "1536210300770975775";

// Canal de despedidas
const LEAVE_CHANNEL_ID = "1536467088133070888";

// Invitación del servidor
const INVITE_LINK = "https://discord.gg/hKkDghPybK";

// Prefijo
const PREFIX = "=";

// ======================================================
// COMPROBAR TOKEN
// ======================================================

if (!TOKEN) {
  console.error("❌ ERROR: No se encontró la variable TOKEN.");
  console.error("👉 Agrega TOKEN en las variables de entorno de Render.");
  process.exit(1);
}

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
    Partials.GuildMember,
    Partials.Channel,
    Partials.Message
  ]
});

// ======================================================
// EXPRESS PARA RENDER
// ======================================================

const app = express();

app.get("/", (req, res) => {
  res.send(
    "🤖 Bot funcionando correctamente.<br>" +
    "👋 Sistema de bienvenida activo.<br>" +
    "📤 Sistema de despedidas activo.<br>" +
    "📋 Sistema de logs activo."
  );
});

app.get("/status", (req, res) => {
  res.json({
    online: true,
    bot: client.user ? client.user.tag : null,
    id: client.user ? client.user.id : null,
    guilds: client.guilds.cache.size,
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("======================================");
  console.log(`🌐 Express activo en puerto ${PORT}`);
  console.log("======================================");
});

// ======================================================
// FUNCIONES
// ======================================================

function crearEmbed(titulo, descripcion) {
  return new EmbedBuilder()
    .setTitle(titulo)
    .setDescription(descripcion)
    .setTimestamp()
    .setFooter({
      text: "Sistema del servidor"
    });
}

function obtenerCanal(guild, channelId) {
  return guild.channels.cache.get(channelId);
}

// ======================================================
// LOG GENERAL
// ======================================================

async function enviarLog(guild, titulo, descripcion, tipo = "general") {

  try {

    const canal = obtenerCanal(
      guild,
      LOG_CHANNEL_ID
    );

    if (!canal) {
      console.log(
        `⚠️ No se encontró el canal de logs: ${LOG_CHANNEL_ID}`
      );
      return;
    }

    let emoji = "📋";

    if (tipo === "entrada") {
      emoji = "📥";
    }

    if (tipo === "salida") {
      emoji = "📤";
    }

    if (tipo === "sistema") {
      emoji = "⚙️";
    }

    const embed = new EmbedBuilder()
      .setTitle(`${emoji} ${titulo}`)
      .setDescription(descripcion)
      .setTimestamp()
      .setFooter({
        text: "Logs del servidor"
      });

    await canal.send({
      embeds: [embed]
    });

  } catch (error) {

    console.error(
      "❌ Error enviando log:",
      error
    );

  }
}

// ======================================================
// READY
// ======================================================

client.once("ready", async () => {

  console.log("======================================");
  console.log("🤖 BOT CONECTADO");
  console.log(`👤 Usuario: ${client.user.tag}`);
  console.log(`🆔 ID: ${client.user.id}`);
  console.log(`🏠 Servidores: ${client.guilds.cache.size}`);
  console.log("======================================");

  client.user.setPresence({
    status: "online",
    activities: [
      {
        name: "bienvenidas y despedidas ❤️",
        type: 0
      }
    ]
  });

  console.log("✅ Presencia configurada.");

  // Log de inicio
  for (const guild of client.guilds.cache.values()) {

    await enviarLog(
      guild,
      "BOT INICIADO",
      `🤖 El bot se ha conectado correctamente.\n\n` +
      `👤 **Bot:** ${client.user.tag}\n` +
      `🆔 **ID:** ${client.user.id}\n` +
      `🏠 **Servidor:** ${guild.name}\n` +
      `📊 **Miembros:** ${guild.memberCount}`,
      "sistema"
    );

  }

});

// ======================================================
// BIENVENIDA
// ======================================================

client.on("guildMemberAdd", async (member) => {

  console.log(
    `📥 ENTRÓ: ${member.user.tag} (${member.id})`
  );

  // ----------------------------------------------------
  // MENSAJE PRIVADO
  // ----------------------------------------------------

  try {

    const bienvenidaDM = new EmbedBuilder()
      .setTitle("🎉 ¡BIENVENIDO/A!")
      .setDescription(
        `¡Hola ${member}! ❤️\n\n` +

        `Nos alegra muchísimo tenerte en nuestra comunidad.\n\n` +

        `✨ **Disfruta del servidor**\n` +
        `🤝 Conoce nuevos amigos\n` +
        `💬 Participa en la comunidad\n` +
        `🎉 Diviértete con nosotros\n\n` +

        `🔗 **Invitación del servidor:**\n` +
        `${INVITE_LINK}`
      )
      .setTimestamp()
      .setFooter({
        text: "¡Gracias por unirte!"
      });

    await member.send({
      embeds: [bienvenidaDM]
    });

    console.log(
      `✅ DM de bienvenida enviado a ${member.user.tag}`
    );

  } catch (error) {

    console.log(
      `⚠️ No se pudo enviar DM a ${member.user.tag}`
    );

  }

  // ----------------------------------------------------
  // CANAL DE BIENVENIDAS
  // ----------------------------------------------------

  try {

    const canal = obtenerCanal(
      member.guild,
      JOIN_LOG_CHANNEL_ID
    );

    if (canal) {

      const bienvenida = new EmbedBuilder()
        .setTitle("🎉 ¡NUEVO MIEMBRO!")
        .setDescription(
          `¡Démosle la bienvenida a ${member}! ❤️\n\n` +

          `👤 **Usuario:** ${member}\n` +
          `🏷️ **Nombre:** ${member.user.tag}\n` +
          `🆔 **ID:** ${member.id}\n` +
          `📅 **Cuenta creada:** <t:${Math.floor(
            member.user.createdTimestamp / 1000
          )}:F>\n\n` +

          `👥 **Miembros actuales:** ` +
          `${member.guild.memberCount}\n\n` +

          `🎉 ¡Esperamos que disfrutes de la comunidad!`
        )
        .setThumbnail(
          member.user.displayAvatarURL({
            size: 256
          })
        )
        .setTimestamp()
        .setFooter({
          text: "Sistema de bienvenida"
        });

      await canal.send({
        embeds: [bienvenida]
      });

    } else {

      console.log(
        `⚠️ No existe el canal de bienvenida ${JOIN_LOG_CHANNEL_ID}`
      );

    }

  } catch (error) {

    console.error(
      "❌ Error en canal de bienvenida:",
      error
    );

  }

  // ----------------------------------------------------
  // LOG GENERAL
  // ----------------------------------------------------

  await enviarLog(
    member.guild,
    "NUEVO MIEMBRO",
    `📥 Un usuario ha entrado al servidor.\n\n` +

    `👤 **Usuario:** ${member}\n` +
    `🏷️ **Nombre:** ${member.user.tag}\n` +
    `🆔 **ID:** ${member.id}\n` +
    `👥 **Miembros:** ${member.guild.memberCount}`,
    "entrada"
  );

});

// ======================================================
// DESPEDIDA
// ======================================================

client.on("guildMemberRemove", async (member) => {

  console.log(
    `📤 SALIÓ: ${member.user.tag} (${member.id})`
  );

  // ----------------------------------------------------
  // CANAL DE DESPEDIDA
  // ----------------------------------------------------

  try {

    const canal = obtenerCanal(
      member.guild,
      LEAVE_CHANNEL_ID
    );

    if (canal) {

      const despedida = new EmbedBuilder()
        .setTitle("📤 MIEMBRO SALIÓ")
        .setDescription(
          `😢 Un miembro ha salido del servidor.\n\n` +

          `👤 **Usuario:** ${member.user.tag}\n` +
          `🆔 **ID:** ${member.id}\n\n` +

          `👥 **Miembros restantes:** ` +
          `${member.guild.memberCount}\n\n` +

          `❤️ ¡Esperamos volver a verte!`
        )
        .setThumbnail(
          member.user.displayAvatarURL({
            size: 256
          })
        )
        .setTimestamp()
        .setFooter({
          text: "Sistema de despedidas"
        });

      await canal.send({
        embeds: [despedida]
      });

    } else {

      console.log(
        `⚠️ No existe el canal de despedida ${LEAVE_CHANNEL_ID}`
      );

    }

  } catch (error) {

    console.error(
      "❌ Error en canal de despedida:",
      error
    );

  }

  // ----------------------------------------------------
  // LOG GENERAL
  // ----------------------------------------------------

  await enviarLog(
    member.guild,
    "MIEMBRO SALIÓ",
    `📤 Un usuario ha salido del servidor.\n\n` +

    `👤 **Usuario:** ${member.user.tag}\n` +
    `🆔 **ID:** ${member.id}\n` +
    `👥 **Miembros restantes:** ${member.guild.memberCount}`,
    "salida"
  );

});

// ======================================================
// COMANDO =PRUEBA
// ======================================================

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  if (!message.content.startsWith(PREFIX)) return;

  const partes = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/\s+/);

  const comando = partes
    .shift()
    ?.toLowerCase();

  if (!comando) return;

  // ====================================================
  // =PRUEBA
  // ====================================================

  if (comando === "prueba") {

    const prueba = new EmbedBuilder()
      .setTitle("🧪 PRUEBA DE BIENVENIDA")
      .setDescription(
        `🎉 ¡Bienvenido/a, ${message.author}! ❤️\n\n` +

        `Este es un **mensaje de prueba** del sistema de bienvenida.\n\n` +

        `👤 **Usuario:** ${message.author}\n` +
        `🏷️ **Nombre:** ${message.author.tag}\n` +
        `🆔 **ID:** ${message.author.id}\n\n` +

        `✨ El sistema de bienvenida está funcionando correctamente.`
      )
      .setThumbnail(
        message.author.displayAvatarURL({
          size: 256
        })
      )
      .setTimestamp()
      .setFooter({
        text: "Prueba de bienvenida"
      });

    await message.reply({
      embeds: [prueba]
    });

    await enviarLog(
      message.guild,
      "PRUEBA DE BIENVENIDA",
      `🧪 Se ejecutó el comando \`=prueba\`.\n\n` +
      `👤 **Usuario:** ${message.author}\n` +
      `🆔 **ID:** ${message.author.id}\n` +
      `📍 **Canal:** ${message.channel}`,
      "sistema"
    );

    return;
  }

  // ====================================================
  // =PRUEBA-SALIDA
  // ====================================================

  if (comando === "prueba-salida") {

    const prueba = new EmbedBuilder()
      .setTitle("🧪 PRUEBA DE DESPEDIDA")
      .setDescription(
        `📤 Este es un **mensaje de prueba de despedida**.\n\n` +

        `👤 **Usuario:** ${message.author.tag}\n` +
        `🆔 **ID:** ${message.author.id}\n\n` +

        `😢 El sistema de despedidas está funcionando correctamente.`
      )
      .setThumbnail(
        message.author.displayAvatarURL({
          size: 256
        })
      )
      .setTimestamp()
      .setFooter({
        text: "Prueba de despedida"
      });

    await message.reply({
      embeds: [prueba]
    });

    await enviarLog(
      message.guild,
      "PRUEBA DE DESPEDIDA",
      `🧪 Se ejecutó el comando \`=prueba-salida\`.\n\n` +
      `👤 **Usuario:** ${message.author}\n` +
      `🆔 **ID:** ${message.author.id}\n` +
      `📍 **Canal:** ${message.channel}`,
      "sistema"
    );

    return;
  }

  // ====================================================
  // =ESTADO
  // ====================================================

  if (comando === "estado") {

    const embed = new EmbedBuilder()
      .setTitle("🤖 ESTADO DEL BOT")
      .setDescription(
        `🟢 **Estado:** Online\n` +
        `📡 **Ping:** ${client.ws.ping}ms\n` +
        `⏱️ **Uptime:** ${Math.floor(
          process.uptime()
        )} segundos\n` +
        `🏠 **Servidores:** ${client.guilds.cache.size}\n\n` +

        `👋 **Bienvenida:** Activa\n` +
        `📤 **Despedida:** Activa\n` +
        `📋 **Logs:** Activos\n` +
        `🧪 **=prueba:** Activo\n` +
        `🧪 **=prueba-salida:** Activo`
      )
      .setTimestamp()
      .setFooter({
        text: "Estado del sistema"
      });

    return message.reply({
      embeds: [embed]
    });
  }

});

// ======================================================
// ERRORES DEL CLIENTE
// ======================================================

client.on("error", (error) => {

  console.error(
    "❌ Error del cliente Discord:",
    error
  );

});

// ======================================================
// PROMESAS NO CONTROLADAS
// ======================================================

process.on("unhandledRejection", (error) => {

  console.error(
    "❌ Unhandled Rejection:",
    error
  );

});

// ======================================================
// EXCEPCIONES
// ======================================================

process.on("uncaughtException", (error) => {

  console.error(
    "❌ Uncaught Exception:",
    error
  );

});

// ======================================================
// LOGIN
// ======================================================

client.login(TOKEN);
