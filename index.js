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

// Canal donde se registra cuando entra alguien
const JOIN_LOG_CHANNEL_ID = "1536210300770975775";

// Canal donde se registra cuando alguien sale
const LEAVE_CHANNEL_ID = "1536467088133070888";

// Invitación del servidor
const INVITE_LINK = "https://discord.gg/hKkDghPybK";

// ======================================================
// COMPROBAR TOKEN
// ======================================================

if (!TOKEN) {
  console.error("❌ ERROR: No existe la variable TOKEN.");
  process.exit(1);
}

// ======================================================
// EXPRESS PARA RENDER
// ======================================================

const app = express();

app.get("/", (req, res) => {
  res.send("🤖 Bot de bienvenida y despedida funcionando correctamente.");
});

app.get("/status", (req, res) => {
  res.json({
    online: true,
    bot: client.user ? client.user.tag : null,
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Servidor Express activo en el puerto ${PORT}`);
});

// ======================================================
// CLIENTE DISCORD
// ======================================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],

  partials: [
    Partials.GuildMember
  ]
});

// ======================================================
// BOT LISTO
// ======================================================

client.once("ready", () => {

  console.log("======================================");
  console.log("🤖 BOT INICIADO CORRECTAMENTE");
  console.log(`👤 Usuario: ${client.user.tag}`);
  console.log(`🆔 ID: ${client.user.id}`);
  console.log(`🏠 Servidores: ${client.guilds.cache.size}`);
  console.log("======================================");

  client.user.setPresence({
    status: "online",
    activities: [
      {
        name: "dando la bienvenida ❤️",
        type: 0
      }
    ]
  });

});

// ======================================================
// BIENVENIDA
// ======================================================

client.on("guildMemberAdd", async (member) => {

  console.log(
    `📥 Entró ${member.user.tag} (${member.id})`
  );

  // ----------------------------------------------------
  // MENSAJE PRIVADO DE BIENVENIDA
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
      `✅ Bienvenida enviada por DM a ${member.user.tag}`
    );

  } catch (error) {

    console.log(
      `⚠️ No se pudo enviar DM a ${member.user.tag}`
    );

  }

  // ----------------------------------------------------
  // LOG DE ENTRADA
  // ----------------------------------------------------

  const canal = member.guild.channels.cache.get(
    JOIN_LOG_CHANNEL_ID
  );

  if (!canal) {

    console.log(
      "⚠️ No se encontró el canal de bienvenida."
    );

    return;
  }

  const bienvenidaLog = new EmbedBuilder()
    .setTitle("📥 NUEVO MIEMBRO")
    .setDescription(
      `🎉 ¡Tenemos un nuevo miembro!\n\n` +

      `👤 **Usuario:** ${member}\n` +
      `🏷️ **Nombre:** ${member.user.tag}\n` +
      `🆔 **ID:** ${member.id}\n` +
      `📅 **Cuenta creada:** <t:${Math.floor(
        member.user.createdTimestamp / 1000
      )}:F>\n\n` +

      `👥 **Miembros actuales:** ` +
      `${member.guild.memberCount}`
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

  canal.send({
    embeds: [bienvenidaLog]
  }).catch((error) => {

    console.error(
      "❌ Error enviando log de bienvenida:",
      error
    );

  });

});

// ======================================================
// DESPEDIDA
// ======================================================

client.on("guildMemberRemove", async (member) => {

  console.log(
    `📤 Salió ${member.user.tag} (${member.id})`
  );

  // ----------------------------------------------------
  // CANAL DE DESPEDIDAS
  // ----------------------------------------------------

  const canal = member.guild.channels.cache.get(
    LEAVE_CHANNEL_ID
  );

  if (!canal) {

    console.log(
      "⚠️ No se encontró el canal de despedidas."
    );

    return;
  }

  const despedida = new EmbedBuilder()
    .setTitle("📤 MIEMBRO SALIÓ")
    .setDescription(
      `😢 Un miembro ha salido del servidor.\n\n` +

      `👤 **Usuario:** ${member.user.tag}\n` +
      `🆔 **ID:** ${member.id}\n\n` +

      `👥 **Miembros restantes:** ` +
      `${member.guild.memberCount}\n\n` +

      `¡Esperamos volver a verte! ❤️`
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

  canal.send({
    embeds: [despedida]
  }).catch((error) => {

    console.error(
      "❌ Error enviando despedida:",
      error
    );

  });

});

// ======================================================
// ERRORES
// ======================================================

client.on("error", (error) => {

  console.error(
    "❌ Error del cliente Discord:",
    error
  );

});

process.on("unhandledRejection", (error) => {

  console.error(
    "❌ Unhandled Rejection:",
    error
  );

});

// ======================================================
// LOGIN
// ======================================================

client.login(TOKEN);
