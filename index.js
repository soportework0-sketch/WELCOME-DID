const express = require("express");
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActivityType,
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

if (!TOKEN) {
  console.error("❌ Falta la variable TOKEN en Render.");
  process.exit(1);
}

// =====================================================
// EXPRESS - RENDER
// =====================================================

const app = express();

app.get("/", (req, res) => {
  res.send("🤖 Bot funcionando correctamente.");
});

app.get("/status", (req, res) => {
  res.json({
    online: true,
    bot: client.user ? client.user.tag : null,
    guilds: client.guilds.cache.size,
    uptime: process.uptime(),
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
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.GuildMember],
});

// =====================================================
// 100 COMANDOS
// =====================================================

const comandos = [
  ["guia", "Muestra todos los comandos"],
  ["comandos", "Muestra todos los comandos"],
  ["menu", "Muestra el menú principal"],
  ["ayuda", "Muestra la ayuda"],
  ["ping", "Muestra la latencia"],
  ["bot", "Información del bot"],
  ["estado", "Muestra el estado del bot"],
  ["uptime", "Tiempo activo del bot"],
  ["version", "Versión del bot"],
  ["info", "Información general"],

  ["server", "Información del servidor"],
  ["servidor", "Resumen del servidor"],
  ["miembros", "Cantidad de miembros"],
  ["usuarios", "Información de usuarios"],
  ["roles", "Cantidad de roles"],
  ["canales", "Lista de canales"],
  ["categorias", "Cantidad de categorías"],
  ["emojis", "Cantidad de emojis"],
  ["boost", "Información de boosts"],
  ["propietario", "Información del propietario"],

  ["avatar", "Muestra tu avatar"],
  ["usuario", "Información de tu usuario"],
  ["perfil", "Muestra tu perfil"],
  ["id", "Muestra tu ID"],
  ["banner", "Información de tu perfil"],
  ["fecha", "Muestra la fecha"],
  ["hora", "Muestra la hora"],
  ["fecha-server", "Fecha de creación del servidor"],
  ["fecha-creacion", "Fecha de creación"],
  ["region", "Información regional"],

  ["hola", "Saluda al usuario"],
  ["saludo", "Muestra un saludo"],
  ["gracias", "Responde al usuario"],
  ["buenosdias", "Mensaje de buenos días"],
  ["buenasnoches", "Mensaje de buenas noches"],
  ["bienvenido", "Mensaje de bienvenida"],
  ["frase", "Muestra una frase"],
  ["motivacion", "Mensaje motivacional"],
  ["chiste", "Cuenta un chiste"],
  ["broma", "Cuenta una broma"],

  ["curiosidad", "Muestra una curiosidad"],
  ["dato", "Muestra un dato"],
  ["dado", "Lanza un dado"],
  ["moneda", "Lanza una moneda"],
  ["coin", "Cara o cruz"],
  ["numero", "Genera un número"],
  ["numeros", "Genera un número"],
  ["random", "Número aleatorio"],
  ["suerte", "Mensaje de suerte"],
  ["8ball", "Bola mágica"],

  ["eleccion", "Elige entre opciones"],
  ["si-no", "Responde sí o no"],
  ["reto", "Genera un reto"],
  ["reto-diario", "Genera un reto diario"],
  ["pregunta", "Genera una pregunta"],
  ["animal", "Animal aleatorio"],
  ["nombre", "Genera un nombre"],
  ["color", "Genera un color"],
  ["sorpresa", "Sorpresa aleatoria"],
  ["diversion", "Mensaje divertido"],

  ["staff", "Información del Staff"],
  ["staffinfo", "Información del equipo Staff"],
  ["staffrole", "Muestra el rol Staff"],
  ["soporte", "Información de soporte"],
  ["support", "Información de soporte"],
  ["canal-soporte", "Muestra el canal de soporte"],
  ["reglas", "Información de reglas"],
  ["normas", "Muestra las normas"],
  ["reglasstaff", "Reglas del Staff"],
  ["seguridad", "Información de seguridad"],

  ["verificacion", "Información de verificación"],
  ["actividad", "Información de actividad"],
  ["comunidad", "Información de comunidad"],
  ["discord", "Información sobre Discord"],
  ["sistema", "Información del sistema"],
  ["bienvenidas", "Información de bienvenida"],
  ["despedidas", "Información de despedidas"],
  ["invitar", "Muestra el enlace del servidor"],
  ["contacto", "Información de contacto"],
  ["estado-bot", "Estado detallado del bot"],

  ["graciasstaff", "Agradece al Staff"],
  ["mayusculas", "Convierte texto a mayúsculas"],
  ["minusculas", "Convierte texto a minúsculas"],
  ["contar", "Cuenta caracteres"],
  ["repetir", "Repite un texto"],
  ["decir", "Hace que el bot diga algo"],
  ["mensaje", "Crea un mensaje"],
  ["saludo2", "Segundo saludo"],
  ["prueba", "Prueba el sistema"],
  ["online", "Muestra usuarios visibles"],
];

// =====================================================
// UTILIDADES
// =====================================================

function embed(titulo, descripcion) {
  return new EmbedBuilder()
    .setColor(0xff69b4)
    .setTitle(titulo)
    .setDescription(descripcion)
    .setTimestamp()
    .setFooter({
      text: "Sistema de comunidad",
    });
}

function random(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function esStaff(message) {
  return (
    message.member &&
    message.member.roles &&
    message.member.roles.cache.has(STAFF_ROLE_ID)
  );
}

// =====================================================
// READY
// =====================================================

client.once("ready", () => {
  console.log("====================================");
  console.log(`✅ Bot conectado: ${client.user.tag}`);
  console.log(`🏠 Servidores: ${client.guilds.cache.size}`);
  console.log(`📋 Comandos: ${comandos.length}`);
  console.log("====================================");

  client.user.setPresence({
    status: "dnd",
    activities: [
      {
        name: "=guia | Ver comandos",
        type: ActivityType.Watching,
      },
    ],
  });
});

// =====================================================
// BIENVENIDA
// =====================================================

client.on("guildMemberAdd", async (member) => {
  const bienvenida = new EmbedBuilder()
    .setColor(0xff69b4)
    .setTitle("🎉 ¡BIENVENIDO/A A NUESTRA COMUNIDAD!")
    .setDescription(
      `💗 ¡Hola ${member}!\n\n` +
        `Nos alegra muchísimo tenerte con nosotros.\n\n` +
        `✨ **Disfruta de la comunidad**\n` +
        `🤝 Conoce nuevos amigos\n` +
        `💬 Participa en nuestros canales\n` +
        `🎮 Diviértete con todos\n\n` +
        `🔗 **Enlace de la comunidad:**\n${INVITE_LINK}\n\n` +
        `📖 Usa \`=guia\` para conocer todos los comandos del bot.`
    )
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
    .setTimestamp()
    .setFooter({
      text: "¡Gracias por unirte! ❤️",
    });

  try {
    await member.send({
      embeds: [bienvenida],
    });
  } catch {
    console.log(`⚠️ No se pudo enviar DM a ${member.user.tag}`);
  }

  const logChannel = member.guild.channels.cache.get(
    JOIN_LOG_CHANNEL_ID
  );

  if (logChannel && logChannel.isTextBased()) {
    const log = embed(
      "📥 NUEVO MIEMBRO",
      `👤 **Usuario:** ${member}\n` +
        `🏷️ **Tag:** ${member.user.tag}\n` +
        `🆔 **ID:** ${member.id}\n` +
        `👥 **Miembros:** ${member.guild.memberCount}`
    );

    logChannel.send({ embeds: [log] }).catch(() => {});
  }
});

// =====================================================
// DESPEDIDA
// =====================================================

client.on("guildMemberRemove", async (member) => {
  const channel = member.guild.channels.cache.get(LEAVE_CHANNEL_ID);

  if (!channel || !channel.isTextBased()) return;

  const despedida = embed(
    "📤 HASTA PRONTO",
    `😢 **${member.user.tag}** ha salido de la comunidad.\n\n` +
      `🆔 **ID:** ${member.id}\n` +
      `👥 **Miembros restantes:** ${member.guild.memberCount}\n\n` +
      `💗 Esperamos volver a verte pronto.`
  );

  channel.send({
    embeds: [despedida],
  }).catch(() => {});
});

// =====================================================
// MENSAJES
// =====================================================

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (!message.content.startsWith("=")) return;

  const partes = message.content
    .slice(1)
    .trim()
    .split(/\s+/);

  const comando = partes.shift()?.toLowerCase();
  const args = partes;

  if (!comando) return;

  // ===================================================
  // GUÍA
  // ===================================================

  if (
    comando === "guia" ||
    comando === "comandos" ||
    comando === "menu" ||
    comando === "ayuda"
  ) {
    const porPagina = 25;

    for (let inicio = 0; inicio < comandos.length; inicio += porPagina) {
      const pagina = comandos.slice(inicio, inicio + porPagina);

      const texto = pagina
        .map(
          ([nombre, descripcion], index) =>
            `**${inicio + index + 1}.** \`=${nombre}\` — ${descripcion}`
        )
        .join("\n");

      await message.channel.send({
        embeds: [
          embed(
            `📖 GUÍA DE COMANDOS ${Math.floor(inicio / porPagina) + 1}/4`,
            texto
          ),
        ],
      });
    }

    return;
  }

  // ===================================================
  // PING
  // ===================================================

  if (comando === "ping") {
    return message.reply(
      `🏓 **Pong!**\n📡 Latencia: **${client.ws.ping}ms**`
    );
  }

  // ===================================================
  // BOT
  // ===================================================

  if (comando === "bot") {
    return message.reply({
      embeds: [
        embed(
          "🤖 INFORMACIÓN DEL BOT",
          `🤖 **Nombre:** ${client.user.tag}\n` +
            `🆔 **ID:** ${client.user.id}\n` +
            `🔴 **Estado:** No molestar\n` +
            `🏠 **Servidores:** ${client.guilds.cache.size}\n` +
            `📋 **Comandos:** ${comandos.length}\n` +
            `📡 **Ping:** ${client.ws.ping}ms`
        ),
      ],
    });
  }

  // ===================================================
  // ESTADO
  // ===================================================

  if (
    comando === "estado" ||
    comando === "estado-bot"
  ) {
    return message.reply({
      embeds: [
        embed(
          "🔴 ESTADO DEL BOT",
          `🔴 **Estado:** No molestar\n` +
            `📡 **Ping:** ${client.ws.ping}ms\n` +
            `⏱️ **Uptime:** ${Math.floor(process.uptime())} segundos\n` +
            `🏠 **Servidores:** ${client.guilds.cache.size}\n\n` +
            `📖 Usa \`=guia\` para ver todos los comandos.`
        ),
      ],
    });
  }

  // ===================================================
  // UPTIME
  // ===================================================

  if (comando === "uptime") {
    const segundos = Math.floor(process.uptime());

    const dias = Math.floor(segundos / 86400);
    const horas = Math.floor((segundos % 86400) / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const seg = segundos % 60;

    return message.reply(
      `⏱️ **Tiempo activo:** ${dias}d ${horas}h ${minutos}m ${seg}s`
    );
  }

  // ===================================================
  // VERSION
  // ===================================================

  if (comando === "version") {
    return message.reply(
      `🤖 **Versión:** 1.0.0\n📋 **Comandos:** ${comandos.length}`
    );
  }

  // ===================================================
  // SERVIDOR
  // ===================================================

  if (
    comando === "server" ||
    comando === "servidor" ||
    comando === "info"
  ) {
    const guild = message.guild;

    return message.reply({
      embeds: [
        embed(
          `🏠 ${guild.name}`,
          `👥 **Miembros:** ${guild.memberCount}\n` +
            `🎭 **Roles:** ${guild.roles.cache.size}\n` +
            `💬 **Canales:** ${guild.channels.cache.size}\n` +
            `😀 **Emojis:** ${guild.emojis.cache.size}\n` +
            `🚀 **Boosts:** ${guild.premiumSubscriptionCount || 0}\n` +
            `🆔 **ID:** ${guild.id}`
        ),
      ],
    });
  }

  // ===================================================
  // MIEMBROS
  // ===================================================

  if (
    comando === "miembros" ||
    comando === "usuarios"
  ) {
    return message.reply(
      `👥 Este servidor tiene **${message.guild.memberCount} miembros**.`
    );
  }

  // ===================================================
  // ROLES
  // ===================================================

  if (comando === "roles") {
    return message.reply(
      `🎭 Este servidor tiene **${message.guild.roles.cache.size} roles**.`
    );
  }

  // ===================================================
  // CANALES
  // ===================================================

  if (comando === "canales") {
    const canales = message.guild.channels.cache
      .filter((c) => c.isTextBased())
      .first(20)
      .map((c) => `<#${c.id}>`)
      .join("\n");

    return message.reply({
      embeds: [
        embed(
          "📚 CANALES",
          canales || "No hay canales disponibles."
        ),
      ],
    });
  }

  // ===================================================
  // CATEGORÍAS
  // ===================================================

  if (comando === "categorias") {
    const cantidad = message.guild.channels.cache.filter(
      (c) => c.type === 4
    ).size;

    return message.reply(
      `📁 El servidor tiene **${cantidad} categorías**.`
    );
  }

  // ===================================================
  // EMOJIS
  // ===================================================

  if (comando === "emojis") {
    return message.reply(
      `😀 El servidor tiene **${message.guild.emojis.cache.size} emojis**.`
    );
  }

  // ===================================================
  // BOOST
  // ===================================================

  if (comando === "boost") {
    return message.reply(
      `🚀 El servidor tiene **${message.guild.premiumSubscriptionCount || 0} boosts**.`
    );
  }

  // ===================================================
  // PROPIETARIO
  // ===================================================

  if (comando === "propietario") {
    try {
      const owner = await message.guild.fetchOwner();

      return message.reply(
        `👑 **Propietario:** ${owner.user.tag}\n🆔 ${owner.id}`
      );
    } catch {
      return message.reply("❌ No pude obtener el propietario.");
    }
  }

  // ===================================================
  // AVATAR
  // ===================================================

  if (comando === "avatar") {
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xff69b4)
          .setTitle("🖼️ TU AVATAR")
          .setImage(
            message.author.displayAvatarURL({
              size: 1024,
              extension: "png",
            })
          ),
      ],
    });
  }

  // ===================================================
  // USUARIO / PERFIL / ID
  // ===================================================

  if (
    comando === "usuario" ||
    comando === "perfil" ||
    comando === "id"
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
        ),
      ],
    });
  }

  // ===================================================
  // BANNER
  // ===================================================

  if (comando === "banner") {
    const banner = message.author.bannerURL({
      size: 1024,
    });

    return message.reply(
      banner
        ? `🖼️ **Tu banner:** ${banner}`
        : "❌ Este usuario no tiene banner."
    );
  }

  // ===================================================
  // FECHA
  // ===================================================

  if (comando === "fecha") {
    return message.reply(
      `📅 Hoy es **${new Date().toLocaleDateString("es-CO")}**.`
    );
  }

  // ===================================================
  // HORA
  // ===================================================

  if (comando === "hora") {
    return message.reply(
      `🕐 Hora actual: **${new Date().toLocaleTimeString("es-CO")}**`
    );
  }

  // ===================================================
  // FECHA SERVER
  // ===================================================

  if (
    comando === "fecha-server" ||
    comando === "fecha-creacion"
  ) {
    return message.reply(
      `📅 Servidor creado: <t:${Math.floor(
        message.guild.createdTimestamp / 1000
      )}:F>`
    );
  }

  // ===================================================
  // REGION
  // ===================================================

  if (comando === "region") {
    return message.reply(
      "🌎 Discord gestiona automáticamente la región de voz del servidor."
    );
  }

  // ===================================================
  // INVITAR
  // ===================================================

  if (comando === "invitar") {
    return message.reply(
      `🔗 **Invitación de la comunidad:**\n${INVITE_LINK}`
    );
  }

  // ===================================================
  // HOLA
  // ===================================================

  if (
    comando === "hola" ||
    comando === "saludo" ||
    comando === "saludo2"
  ) {
    return message.reply(
      `👋 ¡Hola ${message.author}! 💗 ¡Qué bueno verte por aquí!`
    );
  }

  // ===================================================
  // GRACIAS
  // ===================================================

  if (comando === "gracias") {
    return message.reply(
      `🥰 ¡De nada, ${message.author}! ❤️`
    );
  }

  // ===================================================
  // BUENOS DÍAS
  // ===================================================

  if (comando === "buenosdias") {
    return message.reply(
      "🌞 ¡Buenos días! Que tengas un excelente día. ❤️"
    );
  }

  // ===================================================
  // BUENAS NOCHES
  // ===================================================

  if (comando === "buenasnoches") {
    return message.reply(
      "🌙 ¡Buenas noches! Descansa mucho. ❤️"
    );
  }

  // ===================================================
  // BIENVENIDO
  // ===================================================

  if (comando === "bienvenido") {
    return message.reply({
      embeds: [
        embed(
          "🎉 ¡BIENVENIDO/A!",
          `¡Bienvenido/a ${message.author}!\n\n` +
            `💗 Esperamos que disfrutes mucho de la comunidad.\n\n` +
            `🔗 ${INVITE_LINK}`
        ),
      ],
    });
  }

  // ===================================================
  // FRASES
  // ===================================================

  if (
    comando === "frase" ||
    comando === "motivacion"
  ) {
    const frases = [
      "✨ Nunca dejes de intentarlo.",
      "🔥 Tú puedes lograrlo.",
      "💪 Cada día es una nueva oportunidad.",
      "❤️ Sigue adelante.",
      "🌟 Todo esfuerzo tiene su recompensa.",
      "🚀 Los grandes resultados comienzan con pequeños pasos.",
    ];

    retur
