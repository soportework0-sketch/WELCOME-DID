const express = require("express");

const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

// =====================================================
// CONFIGURACIÓN
// =====================================================

const TOKEN = process.env.TOKEN;

const STAFF_ROLE_ID = "1536211170971754590";
const SUPPORT_CHANNEL_ID = "1533650120783040604";

const JOIN_LOG_CHANNEL_ID = "1536210300770975775";
const LEAVE_CHANNEL_ID = "1536467088133070888";

const INVITE_LINK = "https://discord.gg/hKkDghPybK";

const PREFIX = "=";

// =====================================================
// COMPROBAR TOKEN
// =====================================================

if (!TOKEN) {
  console.error("❌ No existe la variable TOKEN en Render.");
  process.exit(1);
}

// =====================================================
// EXPRESS PARA RENDER
// =====================================================

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("🤖 Bot funcionando correctamente.");
});

app.get("/status", (req, res) => {
  res.status(200).json({
    online: true,
    bot: client.user ? client.user.tag : null,
    uptime: Math.floor(process.uptime()),
    guilds: client.guilds.cache.size
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Express activo en el puerto ${PORT}`);
});

// =====================================================
// CLIENTE DISCORD
// =====================================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.GuildMember,
    Partials.User,
    Partials.Message,
    Partials.Channel
  ]
});

// =====================================================
// 100 COMANDOS
// =====================================================

const comandos = [
  ["guia", "Muestra todos los comandos"],
  ["comandos", "Muestra todos los comandos"],
  ["menu", "Muestra el menú principal"],
  ["ayuda", "Muestra el sistema de ayuda"],
  ["ping", "Muestra la latencia del bot"],
  ["bot", "Muestra información del bot"],
  ["estado", "Muestra el estado del bot"],
  ["uptime", "Muestra el tiempo activo"],
  ["version", "Muestra la versión del sistema"],
  ["info", "Muestra información general"],

  ["server", "Muestra información del servidor"],
  ["servidor", "Muestra un resumen del servidor"],
  ["miembros", "Muestra la cantidad de miembros"],
  ["usuarios", "Muestra información de usuarios"],
  ["roles", "Muestra la cantidad de roles"],
  ["canales", "Muestra información de canales"],
  ["categorias", "Muestra las categorías"],
  ["emojis", "Muestra la cantidad de emojis"],
  ["boost", "Muestra los boosts del servidor"],
  ["propietario", "Muestra información del propietario"],

  ["avatar", "Muestra tu avatar"],
  ["usuario", "Muestra información de usuario"],
  ["perfil", "Muestra tu perfil"],
  ["id", "Muestra tu ID"],
  ["banner", "Muestra información de tu perfil"],
  ["fecha", "Muestra la fecha actual"],
  ["hora", "Muestra la hora actual"],
  ["creado", "Muestra cuándo fue creada tu cuenta"],
  ["invitar", "Muestra el enlace de invitación"],
  ["discord", "Muestra información sobre Discord"],

  ["hola", "Saluda al usuario"],
  ["saludo", "Envía un saludo"],
  ["gracias", "Responde a un agradecimiento"],
  ["buenosdias", "Envía un saludo de buenos días"],
  ["buenastardes", "Envía un saludo de buenas tardes"],
  ["buenasnoches", "Envía un saludo de buenas noches"],
  ["bienvenido", "Envía un mensaje de bienvenida"],
  ["comunidad", "Información de la comunidad"],
  ["contacto", "Información de contacto"],
  ["soporte", "Muestra información de soporte"],

  ["dado", "Lanza un dado"],
  ["moneda", "Lanza una moneda"],
  ["coin", "Lanza una moneda"],
  ["numero", "Genera un número aleatorio"],
  ["random", "Genera algo aleatorio"],
  ["suerte", "Mensaje de suerte"],
  ["reto", "Genera un reto"],
  ["pregunta", "Genera una pregunta"],
  ["eleccion", "Elige una opción"],
  ["si-no", "Responde sí o no"],

  ["frase", "Muestra una frase"],
  ["motivacion", "Muestra una frase motivacional"],
  ["chiste", "Cuenta un chiste"],
  ["broma", "Cuenta una broma"],
  ["curiosidad", "Muestra una curiosidad"],
  ["dato", "Muestra un dato"],
  ["meme", "Muestra un mensaje divertido"],
  ["sorpresa", "Genera una sorpresa"],
  ["diversion", "Genera algo divertido"],
  ["8ball", "Pregunta a la bola mágica"],

  ["staff", "Muestra información del Staff"],
  ["staffinfo", "Muestra información del equipo"],
  ["staffrole", "Muestra el rol Staff"],
  ["ayudastaff", "Muestra ayuda para Staff"],
  ["reglasstaff", "Muestra información para Staff"],
  ["estado-staff", "Muestra el estado del Staff"],
  ["administracion", "Información administrativa"],
  ["seguridad", "Información de seguridad"],
  ["verificacion", "Información de verificación"],
  ["actividad", "Información de actividad"],

  ["reglas", "Muestra información de reglas"],
  ["normas", "Muestra información de normas"],
  ["canal-soporte", "Muestra el canal de soporte"],
  ["bienvenidas", "Información del sistema de bienvenida"],
  ["despedidas", "Información del sistema de despedida"],
  ["sistema", "Información del sistema"],
  ["prueba", "Prueba el sistema"],
  ["estado-bot", "Estado detallado del bot"],
  ["online", "Muestra información de conexión"],
  ["region", "Muestra información regional"],

  ["color", "Genera un color hexadecimal"],
  ["animal", "Genera un animal aleatorio"],
  ["nombre", "Genera un nombre aleatorio"],
  ["fecha-creacion", "Muestra la creación del servidor"],
  ["servidor-info", "Muestra información detallada"],
  ["comunidad-info", "Muestra información comunitaria"],
  ["mi-info", "Muestra tu información"],
  ["canal", "Muestra información del canal"],
  ["rol", "Muestra información del rol"],
  ["ayuda-comunidad", "Muestra ayuda de la comunidad"],

  ["graciasstaff", "Agradece al Staff"],
  ["saludo-staff", "Saluda al Staff"],
  ["mensaje", "Envía un mensaje"],
  ["repetir", "Repite un texto"],
  ["mayusculas", "Convierte texto a mayúsculas"],
  ["minusculas", "Convierte texto a minúsculas"],
  ["contar", "Cuenta caracteres"],
  ["limpiar", "Limpia mensajes"],
  ["anuncio", "Muestra información de anuncios"],
  ["info-soporte", "Muestra información del soporte"]
];

// =====================================================
// VERIFICACIÓN
// =====================================================

console.log(`📋 Comandos cargados: ${comandos.length}`);

if (comandos.length !== 100) {
  console.error(
    `❌ ERROR: Se esperaban 100 comandos y hay ${comandos.length}.`
  );
}

// =====================================================
// FUNCIONES
// =====================================================

function embed(titulo, descripcion) {
  return new EmbedBuilder()
    .setTitle(titulo)
    .setDescription(descripcion)
    .setTimestamp()
    .setFooter({
      text: "Sistema de comunidad"
    });
}

function aleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function esStaff(member) {
  if (!member) return false;

  return member.roles.cache.has(STAFF_ROLE_ID);
}

function formatoUptime() {
  const segundos = Math.floor(process.uptime());

  const dias = Math.floor(segundos / 86400);
  const horas = Math.floor((segundos % 86400) / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const secs = segundos % 60;

  return `${dias}d ${horas}h ${minutos}m ${secs}s`;
}

// =====================================================
// READY
// =====================================================

client.once("ready", () => {
  console.log("=================================");
  console.log("🤖 BOT CONECTADO");
  console.log(`👤 ${client.user.tag}`);
  console.log(`🏠 Servidores: ${client.guilds.cache.size}`);
  console.log(`📋 Comandos: ${comandos.length}`);
  console.log("=================================");

  // DND SIEMPRE
  client.user.setPresence({
    status: "dnd",
    activities: [
      {
        name: "=guia • Comunidad",
        type: 0
      }
    ]
  });

  console.log("🔴 Estado configurado como DND");
});

// =====================================================
// MANTENER DND
// =====================================================

setInterval(() => {
  if (!client.user) return;

  client.user.setPresence({
    status: "dnd",
    activities: [
      {
        name: "=guia • Comunidad",
        type: 0
      }
    ]
  });
}, 60000);

// =====================================================
// USUARIO ENTRA
// =====================================================

client.on("guildMemberAdd", async member => {

  // -----------------------------------------------
  // MENSAJE PRIVADO
  // -----------------------------------------------

  try {
    const bienvenida = new EmbedBuilder()
      .setTitle("╭・🎉 ¡BIENVENIDO/A!")
      .setDescription(
        `¡Hola ${member}! ❤️\n\n` +
        `Nos alegra muchísimo tenerte con nosotros.\n\n` +
        `╭───────────────╮\n` +
        `✨ **¡Ya eres parte de nuestra comunidad!**\n` +
        `╰───────────────╯\n\n` +
        `🌟 **¿Qué puedes hacer aquí?**\n\n` +
        `💬 Conocer nuevos amigos\n` +
        `🎮 Disfrutar de la comunidad\n` +
        `🎉 Participar en actividades\n` +
        `🤝 Compartir con los demás\n` +
        `🛟 Pedir ayuda cuando la necesites\n\n` +
        `📖 Cuando estés dentro, escribe:\n` +
        `**=guia**\n\n` +
        `🔗 **Enlace de la comunidad:**\n` +
        `${INVITE_LINK}\n\n` +
        `💗 ¡Esperamos que disfrutes muchísimo tu estancia!`
      )
      .setThumbnail(
        member.user.displayAvatarURL({
          size: 512
        })
      )
      .setTimestamp()
      .setFooter({
        text: "¡Gracias por unirte a nuestra comunidad!"
      });

    await member.send({
      embeds: [bienvenida]
    });

  } catch (error) {
    console.log(
      `⚠️ No se pudo enviar DM a ${member.user.tag}`
    );
  }

  // -----------------------------------------------
  // CANAL DE ENTRADAS
  // -----------------------------------------------

  const joinChannel =
    member.guild.channels.cache.get(JOIN_LOG_CHANNEL_ID);

  if (joinChannel && joinChannel.isTextBased()) {

    const entrada = new EmbedBuilder()
      .setTitle("📥 ¡NUEVO MIEMBRO!")
      .setDescription(
        `🎉 ¡Denle la bienvenida a ${member}!\n\n` +
        `👤 **Usuario:** ${member.user.tag}\n` +
        `🆔 **ID:** ${member.id}\n` +
        `👥 **Miembros:** ${member.guild.memberCount}`
      )
      .setThumbnail(
        member.user.displayAvatarURL({
          size: 512
        })
      )
      .setTimestamp()
      .setFooter({
        text: "Sistema de bienvenida"
      });

    joinChannel.send({
      embeds: [entrada]
    }).catch(() => {});
  }
});

// =====================================================
// USUARIO SALE
// =====================================================

client.on("guildMemberRemove", async member => {

  const channel =
    member.guild.channels.cache.get(LEAVE_CHANNEL_ID);

  if (!channel || !channel.isTextBased()) return;

  const despedida = new EmbedBuilder()
    .setTitle("📤 ¡HASTA PRONTO!")
    .setDescription(
      `😢 **${member.user.tag}** ha salido de la comunidad.\n\n` +
      `👤 Usuario: **${member.user.tag}**\n` +
      `🆔 ID: **${member.id}**\n\n` +
      `💗 Esperamos volver a verte algún día.\n` +
      `👋 ¡Cuídate mucho!`
    )
    .setThumbnail(
      member.user.displayAvatarURL({
        size: 512
      })
    )
    .setTimestamp()
    .setFooter({
      text: "Sistema de despedidas"
    });

  channel.send({
    embeds: [despedida]
  }).catch(() => {});
});

// =====================================================
// MENSAJES
// =====================================================

client.on("messageCreate", async message => {

  try {

    if (message.author.bot) return;

    if (!message.guild) return;

    if (!message.content.startsWith(PREFIX)) return;

    const contenido =
      message.content.slice(PREFIX.length).trim();

    if (!contenido) return;

    const partes = contenido.split(/\s+/);

    const comando =
      partes.shift().toLowerCase();

    const args = partes;

    // =================================================
    // GUÍA
    // =================================================

    if (
      comando === "guia" ||
      comando === "comandos" ||
      comando === "menu"
    ) {

      const bloques = [];

      for (let i = 0; i < comandos.length; i += 20) {

        const bloque = comandos
          .slice(i, i + 20)
          .map(
            (c, index) =>
              `**${i + index + 1}.** \`${PREFIX}${c[0]}\` — ${c[1]}`
          )
          .join("\n");

        bloques.push(bloque);
      }

      for (let i = 0; i < bloques.length; i++) {

        await message.channel.send({
          embeds: [
            embed(
              `📖 GUÍA DE COMANDOS ${i + 1}/5`,
              bloques[i]
            )
          ]
        });
      }

      return;
    }

    // =================================================
    // PING
    // =================================================

    if (comando === "ping") {

      return message.reply({
        embeds: [
          embed(
            "🏓 Pong",
            `⚡ Latencia: **${client.ws.ping}ms**\n` +
            `🔴 Estado: **DND**`
          )
        ]
      });
    }

    // =================================================
    // BOT
    // =================================================

    if (comando === "bot") {

      return message.reply({
        embeds: [
          embed(
            "🤖 INFORMACIÓN DEL BOT",
            `👤 **Bot:** ${client.user.tag}\n` +
            `🆔 **ID:** ${client.user.id}\n` +
            `🔴 **Estado:** No molestar\n` +
            `🏠 **Servidores:** ${client.guilds.cache.size}\n` +
            `📋 **Comandos:** ${comandos.length}\n` +
            `⏱️ **Activo:** ${formatoUptime()}`
          )
        ]
      });
    }

    // =================================================
    // ESTADO
    // =================================================

    if (
      comando === "estado" ||
      comando === "estado-bot"
    ) {

      return message.reply({
        embeds: [
          embed(
            "🔴 ESTADO DEL BOT",
            `🔴 **Estado:** No molestar\n` +
            `🏓 **Ping:** ${client.ws.ping}ms\n` +
            `⏱️ **Uptime:** ${formatoUptime()}\n` +
            `🏠 **Servidores:** ${client.guilds.cache.size}\n\n` +
            `📖 Usa **=guia** para ver todos los comandos.`
          )
        ]
      });
    }

    // =================================================
    // UPTIME
    // =================================================

    if (comando === "uptime") {

      return message.reply(
        `⏱️ Llevo conectado **${formatoUptime()}**.`
      );
    }

    // =================================================
    // SERVER
    // =================================================

    if (
      comando === "server" ||
      comando === "servidor" ||
      comando === "servidor-info"
    ) {

      const guild = message.guild;

      return message.reply({
        embeds: [
          embed(
            `🏠 ${guild.name}`,
            `👥 **Miembros:** ${guild.memberCount}\n` +
            `💬 **Canales:** ${guild.channels.cache.size}\n` +
            `🎭 **Roles:** ${guild.roles.cache.size}\n` +
            `😀 **Emojis:** ${guild.emojis.cache.size}\n` +
            `🚀 **Boosts:** ${guild.premiumSubscriptionCount || 0}\n` +
            `🆔 **ID:** ${guild.id}`
          )
        ]
      });
    }

    // =================================================
    // MIEMBROS
    // =================================================

    if (
      comando === "miembros" ||
      comando === "usuarios"
    ) {

      return message.reply(
        `👥 Este servidor tiene **${message.guild.memberCount} miembros**.`
      );
    }

    // =================================================
    // ROLES
    // =================================================

    if (comando === "roles") {

      return message.reply(
        `🎭 El servidor tiene **${message.guild.roles.cache.size} roles**.`
      );
    }

    // =================================================
    // CANALES
    // =================================================

    if (
      comando === "canales" ||
      comando === "channel"
    ) {

      const canales =
        message.guild.channels.cache
          .filter(channel => channel.isTextBased())
          .first(20)
          .map(channel => `<#${channel.id}>`)
          .join("\n");

      return message.reply({
        embeds: [
          embed(
            "📚 CANALES",
            canales || "No hay canales disponibles."
          )
        ]
      });
    }

    // =================================================
    // CATEGORÍAS
    // =================================================

    if (comando === "categorias") {

      const categorias =
        message.guild.channels.cache
          .filter(channel => channel.type === 4)
          .map(channel => `📁 ${channel.name}`)
          .join("\n");

      return message.reply({
        embeds: [
          embed(
            "📁 CATEGORÍAS",
            categorias || "No hay categorías."
          )
        ]
      });
    }

    // =================================================
    // EMOJIS
    // =================================================

    if (comando === "emojis") {

      return message.reply(
        `😀 Este servidor tiene **${message.guild.emojis.cache.size} emojis**.`
      );
    }

    // =================================================
    // BOOST
    // =================================================

    if (comando === "boost") {

      return message.reply(
        `🚀 El servidor tiene **${message.guild.premiumSubscriptionCount || 0} boosts**.`
      );
    }

    // =================================================
    // AVATAR
    // =================================================

    if (comando === "avatar") {

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("🖼️ TU AVATAR")
            .setImage(
              message.author.displayAvatarURL({
                size: 1024,
                extension: "png"
              })
            )
            .setTimestamp()
        ]
      });
    }

    // =================================================
    // USUARIO / PERFIL / ID
    // =================================================

    if (
      comando === "usuario" ||
      comando === "perfil" ||
      comando === "id" ||
      comando === "mi-info"
    ) {

      return message.reply({
        embeds: [
          embed(
            "👤 INFORMACIÓN DEL USUARIO",
            `👤 **Usuario:** ${message.author.tag}\n` +
            `🆔 **ID:** ${message.author.id}\n` +
            `📅 **Cuenta creada:** <t:${Math.floor(
              message.author.createdTimestamp / 1000
            )}:F>`
          )
        ]
      });
    }

    // =================================================
    // BANNER
    // =================================================

    if (comando === "banner") {

      const usuario =
        await client.users.fetch(
          message.author.id,
          { force: true }
        );

      const banner =
        usuario.bannerURL({
          size: 1024
        });

      if (!banner) {
        return message.reply(
          "🖼️ No tienes un banner configurado."
        );
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("🖼️ TU BANNER")
            .setImage(banner)
            .setTimestamp()
        ]
      });
    }

    // =================================================
    // 
