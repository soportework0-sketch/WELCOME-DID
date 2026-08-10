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

const TOKEN = process.env.TOKEN;

const STAFF_ROLE_ID = "1536211170971754590";
const SUPPORT_CHANNEL_ID = "1533650120783040604";

const LOG_CHANNEL_ID = "1536209949645078608";
const JOIN_LOG_CHANNEL_ID = "1536210300770975775";
const LEAVE_CHANNEL_ID = "1536467088133070888";

const INVITE_LINK = "https://discord.gg/hKkDghPybK";

// ======================================================
// EXPRESS PARA RENDER
// ======================================================

const app = express();

app.get("/", (req, res) => {
  res.send("🤖 Bot funcionando correctamente.");
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
  partials: [Partials.GuildMember]
});

// ======================================================
// 100 COMANDOS
// ======================================================

const comandos = [

  // 1 - 10
  ["guia", "Muestra todos los comandos"],
  ["server", "Información del servidor"],
  ["support", "Información de soporte"],
  ["channel", "Información de canales"],
  ["prueba", "Prueba el sistema de bienvenida"],
  ["ping", "Muestra la latencia del bot"],
  ["bot", "Información del bot"],
  ["estado", "Estado actual del bot"],
  ["info", "Información general"],
  ["ayuda", "Muestra ayuda"],

  // 11 - 20
  ["avatar", "Muestra tu avatar"],
  ["banner", "Muestra información de tu perfil"],
  ["usuario", "Información de un usuario"],
  ["perfil", "Muestra tu perfil"],
  ["id", "Muestra tu ID"],
  ["fecha", "Muestra la fecha actual"],
  ["hora", "Muestra la hora actual"],
  ["uptime", "Muestra cuánto lleva activo"],
  ["version", "Muestra la versión del bot"],
  ["invitar", "Muestra el enlace del servidor"],

  // 21 - 30
  ["hola", "Saluda al usuario"],
  ["gracias", "Respuesta automática"],
  ["buenosdias", "Mensaje de buenos días"],
  ["buenasnoches", "Mensaje de buenas noches"],
  ["bienvenido", "Mensaje de bienvenida"],
  ["reglas", "Información sobre las reglas"],
  ["normas", "Muestra las normas"],
  ["staff", "Información del Staff"],
  ["administracion", "Información administrativa"],
  ["contacto", "Información de contacto"],

  // 31 - 40
  ["dado", "Lanza un dado"],
  ["moneda", "Lanza una moneda"],
  ["numero", "Genera un número aleatorio"],
  ["suerte", "Mensaje de suerte"],
  ["reto", "Genera un reto"],
  ["pregunta", "Genera una pregunta"],
  ["frase", "Muestra una frase"],
  ["motivacion", "Mensaje motivacional"],
  ["chiste", "Cuenta un chiste"],
  ["curiosidad", "Muestra una curiosidad"],

  // 41 - 50
  ["ranking", "Información del ranking"],
  ["miembros", "Cantidad de miembros"],
  ["online", "Cantidad de usuarios visibles"],
  ["roles", "Cantidad de roles"],
  ["canales", "Cantidad de canales"],
  ["categorias", "Cantidad de categorías"],
  ["emojis", "Cantidad de emojis"],
  ["boost", "Información de boosts"],
  ["fecha-server", "Fecha de creación del servidor"],
  ["propietario", "Muestra el propietario"],

  // 51 - 60
  ["limpiar", "Limpia mensajes"],
  ["avisar", "Envía un aviso"],
  ["anuncio", "Crea un anuncio"],
  ["embed", "Crea un mensaje embed"],
  ["decir", "Hace que el bot diga algo"],
  ["mensaje", "Envía un mensaje"],
  ["repetir", "Repite un texto"],
  ["mayusculas", "Convierte texto a mayúsculas"],
  ["minusculas", "Convierte texto a minúsculas"],
  ["contar", "Cuenta caracteres"],

  // 61 - 70
  ["staffinfo", "Información del equipo Staff"],
  ["staffrole", "Muestra el rol Staff"],
  ["soporte", "Abre información de soporte"],
  ["ayudastaff", "Ayuda para Staff"],
  ["estado-staff", "Estado del Staff"],
  ["canal-soporte", "Muestra el canal de soporte"],
  ["reglasstaff", "Reglas del Staff"],
  ["bienvenidas", "Información del sistema"],
  ["despedidas", "Información de despedidas"],
  ["sistema", "Información de sistemas"],

  // 71 - 80
  ["random", "Número aleatorio"],
  ["color", "Genera un color hexadecimal"],
  ["coin", "Cara o cruz"],
  ["8ball", "Bola mágica"],
  ["eleccion", "Elige entre opciones"],
  ["si-no", "Respuesta sí o no"],
  ["reto-diario", "Reto aleatorio"],
  ["dato", "Dato aleatorio"],
  ["animal", "Animal aleatorio"],
  ["nombre", "Genera un nombre"],

  // 81 - 90
  ["fecha-creacion", "Fecha de creación del servidor"],
  ["region", "Información regional"],
  ["seguridad", "Información de seguridad"],
  ["verificacion", "Información de verificación"],
  ["actividad", "Información de actividad"],
  ["usuarios", "Información de usuarios"],
  ["servidor", "Resumen del servidor"],
  ["discord", "Información de Discord"],
  ["comunidad", "Información de comunidad"],
  ["estado-bot", "Estado detallado del bot"],

  // 91 - 100
  ["graciasstaff", "Agradece al Staff"],
  ["saludo", "Mensaje de saludo"],
  ["broma", "Broma aleatoria"],
  ["meme", "Mensaje divertido"],
  ["randomuser", "Usuario aleatorio"],
  ["numeros", "Número aleatorio"],
  ["sorpresa", "Sorpresa aleatoria"],
  ["diversion", "Mensaje divertido"],
  ["comandos", "Lista de comandos"],
  ["menu", "Menú principal"]
];

// ======================================================
// UTILIDADES
// ======================================================

function esStaff(message) {
  return message.member?.roles?.cache?.has(STAFF_ROLE_ID);
}

function embed(titulo, descripcion) {
  return new EmbedBuilder()
    .setTitle(titulo)
    .setDescription(descripcion)
    .setTimestamp()
    .setFooter({ text: "Sistema del bot" });
}

function aleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

// ======================================================
// READY
// ======================================================

client.once("ready", async () => {

  console.log(`✅ Conectado como ${client.user.tag}`);
  console.log(`🌐 Servidores: ${client.guilds.cache.size}`);
  console.log(`📋 Comandos: ${comandos.length}`);

  client.user.setPresence({
    status: "dnd",
    activities: [
      {
        name: "=guia | Sistema de bienvenida",
        type: 0
      }
    ]
  });
});

// ======================================================
// USUARIO SE UNE
// ======================================================

client.on("guildMemberAdd", async member => {

  // DM DE BIENVENIDA
  try {

    const bienvenida = new EmbedBuilder()
      .setTitle("🎉 ¡BIENVENIDO/A!")
      .setDescription(
        `¡Hola ${member}! ❤️\n\n` +
        `Nos alegra muchísimo tenerte aquí.\n\n` +
        `✨ **Disfruta de la comunidad**\n` +
        `🤝 Conoce nuevos amigos\n` +
        `💬 Participa en los canales\n` +
        `🎉 Diviértete con todos\n\n` +
        `🔗 **Únete y disfruta:**\n${INVITE_LINK}`
      )
      .setTimestamp()
      .setFooter({ text: "¡Gracias por unirte!" });

    await member.send({ embeds: [bienvenida] });

  } catch (error) {
    console.log(`⚠️ No se pudo enviar DM a ${member.user.tag}`);
  }

  // LOG DE USUARIO UNIDO
  const logChannel = member.guild.channels.cache.get(
    JOIN_LOG_CHANNEL_ID
  );

  if (logChannel) {

    const log = new EmbedBuilder()
      .setTitle("📥 Nuevo usuario")
      .setDescription(
        `👤 Usuario: ${member}\n` +
        `🏷️ Nombre: ${member.user.tag}\n` +
        `🆔 ID: ${member.id}\n` +
        `👥 Miembros: ${member.guild.memberCount}`
      )
      .setTimestamp();

    logChannel.send({ embeds: [log] }).catch(() => {});
  }
});

// ======================================================
// USUARIO SALE
// ======================================================

client.on("guildMemberRemove", async member => {

  const channel = member.guild.channels.cache.get(
    LEAVE_CHANNEL_ID
  );

  if (!channel) return;

  const despedida = new EmbedBuilder()
    .setTitle("📤 Usuario salió")
    .setDescription(
      `😢 **${member.user.tag}** ha salido del servidor.\n\n` +
      `🆔 ID: ${member.id}\n` +
      `👥 Miembros restantes: ${member.guild.memberCount}`
    )
    .setTimestamp();

  channel.send({
    embeds: [despedida]
  }).catch(() => {});
});

// ======================================================
// MENSAJES
// ======================================================

client.on("messageCreate", async message => {

  if (message.author.bot) return;

  if (!message.content.startsWith("=")) return;

  const args = message.content.slice(1).trim().split(/\s+/);
  const comando = args.shift()?.toLowerCase();

  if (!comando) return;

  // ====================================================
  // GUÍA
  // ====================================================

  if (comando === "guia" || comando === "comandos" || comando === "menu") {

    const lista = comandos
      .map((c, i) => `**${i + 1}.** \`=${c[0]}\` — ${c[1]}`)
      .join("\n");

    const partes = [];

    for (let i = 0; i < lista.length; i += 3900) {
      partes.push(lista.slice(i, i + 3900));
    }

    for (const parte of partes) {

      await message.channel.send({
        embeds: [
          embed(
            "📖 GUÍA DE COMANDOS",
            parte
          )
        ]
      });
    }

    return;
  }

  // ====================================================
  // PRUEBA DE BIENVENIDA
  // ====================================================

  if (comando === "prueba") {

    const prueba = new EmbedBuilder()
      .setTitle("🎉 ¡BIENVENIDO/A!")
      .setDescription(
        `¡Hola ${message.author}! ❤️\n\n` +
        `Este es un **mensaje de prueba de bienvenida**.\n\n` +
        `✨ ¡Nos alegra tenerte aquí!\n\n` +
        `🔗 **Servidor:**\n${INVITE_LINK}`
      )
      .setTimestamp();

    return message.channel.send({
      embeds: [prueba]
    });
  }

  // ====================================================
  // PING
  // ====================================================

  if (comando === "ping") {

    return message.reply(
      `🏓 Pong!\nLatencia: **${client.ws.ping}ms**`
    );
  }

  // ====================================================
  // BOT
  // ====================================================

  if (comando === "bot") {

    return message.reply({
      embeds: [
        embed(
          "🤖 Información del Bot",
          `**Nombre:** ${client.user.tag}\n` +
          `**ID:** ${client.user.id}\n` +
          `**Estado:** DND\n` +
          `**Servidores:** ${client.guilds.cache.size}\n` +
          `**Comandos:** ${comandos.length}`
        )
      ]
    });
  }

  // ====================================================
  // ESTADO
  // ====================================================

  if (comando === "estado" || comando === "estado-bot") {

    return message.reply({
      embeds: [
        embed(
          "🔴 Estado del Bot",
          `**Estado:** No molestar\n` +
          `**Ping:** ${client.ws.ping}ms\n` +
          `**Uptime:** ${Math.floor(process.uptime())} segundos\n\n` +
          `📖 Usa \`=guia\` para ver todos los comandos.`
        )
      ]
    });
  }

  // ====================================================
  // SERVER
  // ====================================================

  if (
    comando === "server" ||
    comando === "servidor" ||
    comando === "info"
  ) {

    const guild = message.guild;

    if (!guild) return;

    return message.reply({
      embeds: [
        embed(
          `🏠 ${guild.name}`,
          `👥 **Miembros:** ${guild.memberCount}\n` +
          `💬 **Canales:** ${guild.channels.cache.size}\n` +
          `🎭 **Roles:** ${guild.roles.cache.size}\n` +
          `😀 **Emojis:** ${guild.emojis.cache.size}\n` +
          `🆔 **ID:** ${guild.id}`
        )
      ]
    });
  }

  // ====================================================
  // SUPPORT
  // ====================================================

  if (
    comando === "support" ||
    comando === "soporte" ||
    comando === "canal-soporte"
  ) {

    return message.reply(
      `🛟 **Soporte**\n\n` +
      `Puedes recibir ayuda en <#${SUPPORT_CHANNEL_ID}>.`
    );
  }

  // ====================================================
  // CHANNEL
  // ====================================================

  if (comando === "channel" || comando === "canales") {

    const canales = message.guild.channels.cache
      .filter(c => c.isTextBased())
      .first(20)
      .map(c => `<#${c.id}>`)
      .join("\n");

    return message.reply({
      embeds: [
        embed(
          "📚 Canales",
          canales || "No hay canales disponibles."
        )
      ]
    });
  }

  // ====================================================
  // STAFF
  // ====================================================

  if (
    comando === "staff" ||
    comando === "staffinfo" ||
    comando === "staffrole"
  ) {

    return message.reply(
      `🛡️ **Staff**\n\n` +
      `Rol Staff: <@&${STAFF_ROLE_ID}>`
    );
  }

  // ====================================================
  // AVATAR
  // ====================================================

  if (comando === "avatar") {

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("🖼️ Tu avatar")
          .setImage(
            message.author.displayAvatarURL({
              size: 1024,
              extension: "png"
            })
          )
      ]
    });
  }

  // ====================================================
  // USUARIO
  // ====================================================

  if (
    comando === "usuario" ||
    comando === "perfil" ||
    comando === "id"
  ) {

    return message.reply({
      embeds: [
        embed(
          "👤 Usuario",
          `**Usuario:** ${message.author.tag}\n` +
          `**ID:** ${message.author.id}\n` +
          `**Creado:** <t:${Math.floor(
            message.author.createdTimestamp / 1000
          )}:F>`
        )
      ]
    });
  }

  // ====================================================
  // MIEMBROS
  // ====================================================

  if (
    comando === "miembros" ||
    comando === "usuarios"
  ) {

    return message.reply(
      `👥 Este servidor tiene **${message.guild.memberCount} miembros**.`
    );
  }

  // ====================================================
  // ROLES
  // ====================================================

  if (comando === "roles") {

    return message.reply(
      `🎭 Hay **${message.guild.roles.cache.size} roles**.`
    );
  }

  // ====================================================
  // EMOJIS
  // ====================================================

  if (comando === "emojis") {

    return message.reply(
      `😀 Hay **${message.guild.emojis.cache.size} emojis**.`
    );
  }

  // ====================================================
  // BOOST
  // ====================================================

  if (comando === "boost") {

    return message.reply(
      `🚀 El servidor tiene **${message.guild.premiumSubscriptionCount || 0} boosts**.`
    );
  }

  // ====================================================
  // INVITAR
  // ====================================================

  if (comando === "invitar") {

    return message.reply(
      `🔗 **Invitación:** ${INVITE_LINK}`
    );
  }

  // ====================================================
  // HOLA
  // ====================================================

  if (comando === "hola" || comando === "saludo") {

    return message.reply(
      `👋 ¡Hola ${message.author}! ¡Qué bueno verte por aquí! ❤️`
    );
  }

  // ====================================================
  // GRACIAS
  // ====================================================

  if (comando === "gracias") {

    return message.reply(
      `🥰 ¡De nada, ${message.author}!`
    );
  }

  // ====================================================
  // BUENOS DÍAS
  // ====================================================

  if (comando === "buenosdias") {

    return message.reply(
      "🌞 ¡Buenos días! Que tengas un excelente día ❤️"
    );
  }

  // ====================================================
  // BUENAS NOCHES
  // ====================================================

  if (comando === "buenasnoches") {

    return message.reply(
      "🌙 ¡Buenas noches! Descansa mucho ❤️"
    );
  }

  // ====================================================
  // BIENVENIDO
  // ====================================================

  if (comando === "bienvenido") {

    return message.reply(
      `🎉 ¡Bienvenido/a a nuestra comunidad, ${message.author}!`
    );
  }

  // ====================================================
  // FRASE
  // ====================================================

  if (comando === "frase" || comando === "motivacion") {

    const frases = [
      "✨ Nunca dejes de intentarlo.",
      "🔥 Tú puedes lograrlo.",
      "💪 Cada día es una nueva oportunidad.",
      "❤️ Sigue adelante.",
      "🌟 Todo esfuerzo tiene su recompensa."
    ];

    return message.reply(aleatorio(frases));
  }

  // ====================================================
  // CHISTE
  // ====================================================

  if (comando === "chiste" || comando === "broma") {

    const chistes = [
      "😂 ¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
      "🤣 ¿Cuál es el colmo de un jardinero? Que siempre lo dejen plantado.",
      "😆 ¿Qué le dijo un techo a otro? Techo de menos."
    ];

    return message.reply(aleatorio(chistes));
  }

  // ====================================================
  // CURIOSIDAD
  // ====================================================

  if (comando === "curiosidad" || comando === "dato") {

    const datos = [
      "🧠 Los pulpos tienen tres corazones.",
      "🌎 La Tierra no es una esfera perfecta.",
      "🐙 Los pulpos pueden cambiar de color.",
      "🌙 La Luna se aleja lentamente de la Tierra."
    ];

    return message.reply(aleatorio(datos));
  }

  // ====================================================
  // DADO
  // ====================================================

  if (comando === "dado") {

    const numero = Math.floor(Math.random() * 6) + 1;

    return message.reply(
      `🎲 Has sacado **${numero}**.`
    );
  }

  // ====================================================
  // MONEDA
  // ====================================================

  if (
    comando === "moneda" ||
    comando === "coin"
  ) {

    return message.reply(
      `🪙 **${Math.random() < 0.5 ? "Cara" : "Cruz"}**`
    );
  }

  // ====================================================
  // NÚMERO
  // ====================================================

  if (
    comando === "numero" ||
    comando === "random" ||
    comando === "numeros"
  ) {

    const numero =
      Math.floor(Math.random() * 100) + 1;

    return message.reply(
      `🔢 Número aleatorio: **${numero}**`
    );
  }

  // ====================================================
  // SÍ / NO
  // ====================================================

  if (comando === "si-no") {

    return message.reply(
      Math.random() < 0.5 ? "✅ Sí" : "❌ No"
    );
  }

  // ====================================================
  // 8 BALL
  // ====================================================

  if (comando === "8ball") {

    const respuestas = [
      "🎱 Sí.",
      "🎱 Definitivamente.",
      "🎱 Probablemente.",
      "🎱 No.",
      "🎱 No estoy seguro.",
      "
