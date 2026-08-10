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

// Canal donde se registran ENTRADAS y SALIDAS
const LOG_CHANNEL_ID = "1536210300770975775";

// Canal específico para DESPEDIDAS
const LEAVE_CHANNEL_ID = "1536467088133070888";

// Servidor de apelación
const APPEAL_SERVER = "https://discord.gg/hKkDghPybK";

// Prefijo
const PREFIX = "=";

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
  res.status(200).send("🤖 Bot de bienvenida funcionando correctamente.");
});

app.get("/status", (req, res) => {
  res.status(200).json({
    online: true,
    bot: client.user ? client.user.tag : null,
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Servidor web activo en el puerto ${PORT}`);
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
// FUNCIÓN: MENSAJE DE BIENVENIDA
// ======================================================

function crearBienvenida(member) {
  return new EmbedBuilder()
    .setTitle("🎉 ¡BIENVENIDO/A!")
    .setDescription(
      `Hola ${member}! ❤️\n\n` +

      `¡Nos alegra mucho tenerte en nuestra comunidad! 🥳\n\n` +

      `⚖️ **Servidor de Apelación**\n` +
      `Aquí podrás encontrar un espacio para realizar tus apelaciones y recibir atención cuando la necesites.\n\n` +

      `📌 Te recomendamos revisar los canales del servidor y leer la información importante.\n\n` +

      `🤝 Respeta a los demás miembros.\n` +
      `📖 Lee las normas antes de participar.\n` +
      `💬 Si necesitas ayuda, busca al equipo correspondiente.\n\n` +

      `🔗 **Servidor de Apelación:**\n` +
      `${APPEAL_SERVER}\n\n` +

      `❤️ ¡Esperamos que tengas una excelente experiencia con nosotros!`
    )
    .setFooter({
      text: "¡Gracias por unirte a nuestra comunidad!"
    });
}

// ======================================================
// FUNCIÓN: MENSAJE DE ENTRADA PARA LOGS
// ======================================================

function crearLogEntrada(member) {
  return new EmbedBuilder()
    .setTitle("📥 ¡NUEVO MIEMBRO!")
    .setDescription(
      `🎉 ¡Bienvenido/a ${member}!\n\n` +

      `Nos alegra mucho tenerte con nosotros. ❤️\n\n` +

      `⚖️ Te recomendamos conocer nuestro servidor de apelación y revisar toda la información disponible.\n\n` +

      `🔗 **Servidor de Apelación:**\n` +
      `${APPEAL_SERVER}\n\n` +

      `👥 ¡Esperamos que disfrutes de la comunidad!`
    )
    .setFooter({
      text: "Sistema de bienvenida"
    })
    .setTimestamp();
}

// ======================================================
// FUNCIÓN: MENSAJE DE DESPEDIDA
// ======================================================

function crearDespedida(member) {
  return new EmbedBuilder()
    .setTitle("👋 ¡HASTA PRONTO!")
    .setDescription(
      `😢 **${member.user.username}** ha salido del servidor.\n\n` +

      `Esperamos volver a verte pronto. ❤️\n\n` +

      `⚖️ Si necesitas nuestro servidor de apelación, puedes volver cuando quieras.\n\n` +

      `🔗 **Servidor de Apelación:**\n` +
      `${APPEAL_SERVER}\n\n` +

      `¡Gracias por haber formado parte de nuestra comunidad!`
    )
    .setFooter({
      text: "Sistema de despedidas"
    })
    .setTimestamp();
}

// ======================================================
// READY
// ======================================================

client.once("ready", () => {
  console.log("==========================================");
  console.log("🤖 BOT INICIADO CORRECTAMENTE");
  console.log(`👤 Usuario: ${client.user.tag}`);
  console.log(`🏠 Servidores: ${client.guilds.cache.size}`);
  console.log("📥 Sistema de bienvenida: ACTIVADO");
  console.log("📤 Sistema de despedida: ACTIVADO");
  console.log("📋 Sistema de logs: ACTIVADO");
  console.log("🧪 Comando disponible: =pruebaall");
  console.log("==========================================");

  client.user.setPresence({
    status: "online",
    activities: [
      {
        name: "Servidor de Apelación",
        type: 0
      }
    ]
  });
});

// ======================================================
// USUARIO ENTRA AL SERVIDOR
// ======================================================

client.on("guildMemberAdd", async (member) => {

  console.log(
    `📥 Nuevo miembro: ${member.user.username}`
  );

  // ====================================================
  // MD DE BIENVENIDA
  // ====================================================

  try {

    const bienvenida = crearBienvenida(member);

    await member.send({
      embeds: [bienvenida]
    });

    console.log(
      `✅ MD de bienvenida enviado a ${member.user.username}`
    );

  } catch (error) {

    console.log(
      `⚠️ No se pudo enviar MD a ${member.user.username}`
    );
  }

  // ====================================================
  // LOG DE ENTRADA
  // ====================================================

  try {

    const canalLogs =
      member.guild.channels.cache.get(LOG_CHANNEL_ID);

    if (!canalLogs) {

      console.log(
        `⚠️ No se encontró el canal de logs: ${LOG_CHANNEL_ID}`
      );

      return;
    }

    const log = crearLogEntrada(member);

    await canalLogs.send({
      embeds: [log]
    });

    console.log(
      "✅ Entrada registrada en el canal de logs."
    );

  } catch (error) {

    console.error(
      "❌ Error registrando entrada:",
      error
    );
  }
});

// ======================================================
// USUARIO SALE DEL SERVIDOR
// ======================================================

client.on("guildMemberRemove", async (member) => {

  console.log(
    `📤 Usuario salió: ${member.user.username}`
  );

  // ====================================================
  // DESPEDIDA EN CANAL DE LOGS
  // ====================================================

  try {

    const canalLogs =
      member.guild.channels.cache.get(LOG_CHANNEL_ID);

    if (canalLogs) {

      const despedida = crearDespedida(member);

      await canalLogs.send({
        embeds: [despedida]
      });

      console.log(
        "✅ Despedida enviada al canal de logs."
      );
    }

  } catch (error) {

    console.error(
      "❌ Error enviando despedida a logs:",
      error
    );
  }

  // ====================================================
  // DESPEDIDA EN CANAL DE DESPEDIDAS
  // ====================================================

  try {

    const canalDespedida =
      member.guild.channels.cache.get(LEAVE_CHANNEL_ID);

    if (canalDespedida) {

      const despedida = crearDespedida(member);

      await canalDespedida.send({
        embeds: [despedida]
      });

      console.log(
        "✅ Despedida enviada al canal de despedidas."
      );
    }

  } catch (error) {

    console.error(
      "❌ Error enviando despedida:",
      error
    );
  }
});

// ======================================================
// COMANDO =PRUEBAALL
// ======================================================

client.on("messageCreate", async (message) => {

  // Ignorar bots
  if (message.author.bot) return;

  // Solo mensajes con =
  if (!message.content.startsWith(PREFIX)) return;

  const contenido = message.content
    .slice(PREFIX.length)
    .trim();

  const comando = contenido
    .split(/\s+/)[0]
    .toLowerCase();

  // ====================================================
  // =PRUEBAALL
  // ====================================================

  if (comando === "pruebaall") {

    // Crear objeto parecido a un miembro
    const usuarioPrueba = message.member;

    if (!usuarioPrueba) {

      return message.reply(
        "❌ Este comando solo puede utilizarse dentro de un servidor."
      );
    }

    // ==================================================
    // MENSAJE DE PRUEBA EN EL CANAL
    // ==================================================

    const prueba = new EmbedBuilder()
      .setTitle("🧪 PRUEBA DEL SISTEMA")
      .setDescription(
        `✅ **Sistema de bienvenida y despedida funcionando.**\n\n` +

        `📥 Bienvenida: **ACTIVA**\n` +
        `📤 Despedida: **ACTIVA**\n` +
        `📋 Logs: **ACTIVOS**\n` +
        `💌 MD de bienvenida: **ACTIVO**\n\n` +

        `⚖️ **Servidor de Apelación:**\n` +
        `${APPEAL_SERVER}`
      )
      .setFooter({
        text: "Prueba realizada correctamente"
      })
      .setTimestamp();

    await message.reply({
      embeds: [prueba]
    });

    // ==================================================
    // PROBAR BIENVENIDA EN LOGS
    // ==================================================

    try {

      const canalLogs =
        message.guild.channels.cache.get(LOG_CHANNEL_ID);

      if (canalLogs) {

        const bienvenida =
          crearLogEntrada(usuarioPrueba);

        await canalLogs.send({
          embeds: [bienvenida]
        });
      }

    } catch (error) {

      console.error(
        "❌ Error en prueba de bienvenida:",
        error
      );
    }

    // ==================================================
    // PROBAR DESPEDIDA
    // ==================================================

    try {

      const canalDespedida =
        message.guild.channels.cache.get(
          LEAVE_CHANNEL_ID
        );

      if (canalDespedida) {

        const despedida =
          crearDespedida(usuarioPrueba);

        await canalDespedida.send({
          embeds: [despedida]
        });
      }

    } catch (error) {

      console.error(
        "❌ Error en prueba de despedida:",
        error
      );
    }

    return;
  }

});

// ======================================================
// MANEJO DE ERRORES
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

process.on("uncaughtException", (error) => {

  console.error(
    "❌ Uncaught Exception:",
    error
  );

});

// ======================================================
// LOGIN DEL BOT
// ======================================================

client.login(TOKEN);
