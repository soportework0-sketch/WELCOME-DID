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

// Rol Staff
const STAFF_ROLE_ID = "1536211170971754590";

// Canal de bienvenida
const WELCOME_CHANNEL_ID = "1536209949645078608";

// Canal de logs
const LOG_CHANNEL_ID = "1536210300770975775";

// Canal de despedida
const LEAVE_CHANNEL_ID = "1536467088133070888";

// Servidor de APELACIÓN
const APPEAL_SERVER = "https://discord.gg/hKkDghPybK";

// Prefijo
const PREFIX = "=";

// ======================================================
// COMPROBAR TOKEN
// ======================================================

if (!TOKEN) {
  console.error("❌ No se encontró la variable TOKEN.");
  process.exit(1);
}

// ======================================================
// EXPRESS PARA RENDER
// ======================================================

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("🤖 Bot funcionando correctamente.");
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
  console.log(`🌐 Express activo en el puerto ${PORT}`);
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
    Partials.GuildMember,
    Partials.Channel,
    Partials.Message
  ]
});

// ======================================================
// EMBED DE BIENVENIDA
// ======================================================

function crearBienvenida(member) {
  return new EmbedBuilder()
    .setTitle("🎉 ¡BIENVENIDO/A!")
    .setDescription(
      `Hola ${member}! ❤️\n\n` +

      `¡Nos alegra muchísimo tenerte aquí! 🥳\n\n` +

      `⚖️ **Bienvenido/a al servidor de APELACIÓN**\n\n` +

      `Aquí encontrarás un espacio para realizar tus apelaciones ` +
      `y recibir la información correspondiente.\n\n` +

      `📖 Te recomendamos conocer los canales del servidor.\n` +
      `🤝 Respeta a todos los miembros.\n` +
      `📌 Revisa la información importante.\n` +
      `🎫 Utiliza los canales correspondientes cuando necesites ayuda.\n\n` +

      `🔗 **Servidor de APELACIÓN:**\n` +
      `${APPEAL_SERVER}\n\n` +

      `❤️ ¡Esperamos que disfrutes tu estadía en nuestra comunidad!`
    )
    .setFooter({
      text: "¡Gracias por unirte!"
    });
}

// ======================================================
// EMBED DE DESPEDIDA
// ======================================================

function crearDespedida(member) {
  return new EmbedBuilder()
    .setTitle("👋 ¡HASTA PRONTO!")
    .setDescription(
      `😢 **${member.user.username}** ha salido del servidor.\n\n` +

      `Gracias por haber formado parte de nuestra comunidad. ❤️\n\n` +

      `Esperamos volver a verte algún día.\n\n` +

      `⚖️ **Servidor de APELACIÓN**\n\n` +

      `Si necesitas volver a nuestra comunidad:\n` +
      `${APPEAL_SERVER}\n\n` +

      `👋 ¡Te deseamos lo mejor!`
    )
    .setFooter({
      text: "Sistema de despedidas"
    });
}

// ======================================================
// LOG SIMPLE DE ENTRADA
// ======================================================

function crearLogEntrada(member) {
  return new EmbedBuilder()
    .setTitle("📥 Entrada registrada")
    .setDescription(
      `👤 **${member.user.username}** entró al servidor.`
    )
    .setFooter({
      text: "Logs del servidor"
    });
}

// ======================================================
// LOG SIMPLE DE SALIDA
// ======================================================

function crearLogSalida(member) {
  return new EmbedBuilder()
    .setTitle("📤 Salida registrada")
    .setDescription(
      `👤 **${member.user.username}** salió del servidor.`
    )
    .setFooter({
      text: "Logs del servidor"
    });
}

// ======================================================
// READY
// ======================================================

client.once("ready", () => {

  console.log("==========================================");
  console.log("🤖 BOT INICIADO");
  console.log(`👤 Usuario: ${client.user.tag}`);
  console.log(`🏠 Servidores: ${client.guilds.cache.size}`);
  console.log("📥 Bienvenidas: ACTIVADAS");
  console.log("📤 Despedidas: ACTIVADAS");
  console.log("📋 Logs: ACTIVADOS");
  console.log("💌 MD bienvenida: ACTIVADO");
  console.log("🧪 Comando: =pruebaall");
  console.log("==========================================");

  client.user.setPresence({
    status: "online",
    activities: [
      {
        name: "Servidor de APELACIÓN",
        type: 0
      }
    ]
  });
});

// ======================================================
// USUARIO ENTRA
// ======================================================

client.on("guildMemberAdd", async (member) => {

  console.log(
    `📥 Entró: ${member.user.username}`
  );

  // ====================================================
  // BIENVENIDA EN EL CANAL
  // ====================================================

  try {

    const canalBienvenida =
      member.guild.channels.cache.get(
        WELCOME_CHANNEL_ID
      );

    if (canalBienvenida) {

      const mensaje =
        crearBienvenida(member);

      await canalBienvenida.send({
        embeds: [mensaje]
      });

      console.log(
        "✅ Mensaje enviado al canal de bienvenida."
      );
    }

  } catch (error) {

    console.error(
      "❌ Error en canal de bienvenida:",
      error
    );
  }

  // ====================================================
  // BIENVENIDA POR MD
  // ====================================================

  try {

    const mensaje =
      crearBienvenida(member);

    await member.send({
      embeds: [mensaje]
    });

    console.log(
      `✅ MD enviado a ${member.user.username}.`
    );

  } catch (error) {

    console.log(
      `⚠️ No se pudo enviar MD a ${member.user.username}.`
    );
  }

  // ====================================================
  // LOG DE ENTRADA
  // ====================================================

  try {

    const canalLogs =
      member.guild.channels.cache.get(
        LOG_CHANNEL_ID
      );

    if (canalLogs) {

      const log =
        crearLogEntrada(member);

      await canalLogs.send({
        embeds: [log]
      });

      console.log(
        "✅ Entrada registrada en logs."
      );
    }

  } catch (error) {

    console.error(
      "❌ Error en logs de entrada:",
      error
    );
  }
});

// ======================================================
// USUARIO SALE
// ======================================================

client.on("guildMemberRemove", async (member) => {

  console.log(
    `📤 Salió: ${member.user.username}`
  );

  // ====================================================
  // DESPEDIDA EN CANAL DE DESPEDIDAS
  // ====================================================

  try {

    const canalDespedida =
      member.guild.channels.cache.get(
        LEAVE_CHANNEL_ID
      );

    if (canalDespedida) {

      const mensaje =
        crearDespedida(member);

      await canalDespedida.send({
        embeds: [mensaje]
      });

      console.log(
        "✅ Despedida enviada al canal."
      );
    }

  } catch (error) {

    console.error(
      "❌ Error en canal de despedida:",
      error
    );
  }

  // ====================================================
  // LOG SIMPLE DE SALIDA
  // ====================================================

  try {

    const canalLogs =
      member.guild.channels.cache.get(
        LOG_CHANNEL_ID
      );

    if (canalLogs) {

      const log =
        crearLogSalida(member);

      await canalLogs.send({
        embeds: [log]
      });

      console.log(
        "✅ Salida registrada en logs."
      );
    }

  } catch (error) {

    console.error(
      "❌ Error en logs de salida:",
      error
    );
  }

  // ====================================================
  // IMPORTANTE:
  // NO SE ENVÍA MD AL USUARIO CUANDO SALE
  // ====================================================
});

// ======================================================
// COMANDO =PRUEBAALL
// ======================================================

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  if (!message.content.startsWith(PREFIX)) return;

  const contenido = message.content
    .slice(PREFIX.length)
    .trim();

  const comando = contenido
    .split(/\s+/)[0]
    .toLowerCase();

  if (comando !== "pruebaall") return;

  if (!message.guild) return;

  // ====================================================
  // COMPROBAR STAFF
  // ====================================================

  const esStaff =
    message.member.roles.cache.has(
      STAFF_ROLE_ID
    );

  if (!esStaff) {

    return message.reply(
      "❌ Solo el Staff puede utilizar este comando."
    );
  }

  // ====================================================
  // MENSAJE DE PRUEBA
  // ====================================================

  const prueba = new EmbedBuilder()
    .setTitle("🧪 PRUEBA DEL SISTEMA")
    .setDescription(
      `✅ El sistema está funcionando correctamente.\n\n` +

      `📥 **Bienvenida:** activa\n` +
      `💌 **MD de bienvenida:** activa\n` +
      `📤 **Despedida:** activa\n` +
      `📋 **Logs:** activos\n\n` +

      `⚖️ **Servidor de APELACIÓN:**\n` +
      `${APPEAL_SERVER}`
    )
    .setFooter({
      text: "Prueba completada"
    });

  await message.reply({
    embeds: [prueba]
  });

  // ====================================================
  // PRUEBA DE BIENVENIDA
  // ====================================================

  try {

    const canalBienvenida =
      message.guild.channels.cache.get(
        WELCOME_CHANNEL_ID
      );

    if (canalBienvenida) {

      const bienvenida =
        crearBienvenida(message.member);

      await canalBienvenida.send({
        embeds: [bienvenida]
      });
    }

  } catch (error) {

    console.error(
      "❌ Error en prueba de bienvenida:",
      error
    );
  }

  // ====================================================
  // PRUEBA DE MD
  // ====================================================

  try {

    const bienvenida =
      crearBienvenida(message.member);

    await message.author.send({
      embeds: [bienvenida]
    });

  } catch (error) {

    console.log(
      "⚠️ No se pudo enviar el MD de prueba."
    );
  }

  // ====================================================
  // PRUEBA DE LOG DE ENTRADA
  // ====================================================

  try {

    const canalLogs =
      message.guild.channels.cache.get(
        LOG_CHANNEL_ID
      );

    if (canalLogs) {

      const logEntrada =
        crearLogEntrada(message.member);

      await canalLogs.send({
        embeds: [logEntrada]
      });
    }

  } catch (error) {

    console.error(
      "❌ Error en prueba de log de entrada:",
      error
    );
  }

  // ====================================================
  // PRUEBA DE DESPEDIDA
  // ====================================================

  try {

    const canalDespedida =
      message.guild.channels.cache.get(
        LEAVE_CHANNEL_ID
      );

    if (canalDespedida) {

      const despedida =
        crearDespedida(message.member);

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

  // ====================================================
  // PRUEBA DE LOG DE SALIDA
  // ====================================================

  try {

    const canalLogs =
      message.guild.channels.cache.get(
        LOG_CHANNEL_ID
      );

    if (canalLogs) {

      const logSalida =
        crearLogSalida(message.member);

      await canalLogs.send({
        embeds: [logSalida]
      });
    }

  } catch (error) {

    console.error(
      "❌ Error en prueba de log de salida:",
      error
    );
  }
});

// ======================================================
// ERRORES
// ======================================================

client.on("error", (error) => {

  console.error(
    "❌ Error de Discord:",
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
