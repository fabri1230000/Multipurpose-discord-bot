var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu
} = require('discord.js')
module.exports = {
  name: "setup-menuticket",
  category: "💪 Setup",
  aliases: ["setupmenuticket", "menuticket-setup", "menuticketsetup", "menuticketsystem"],
  cooldown: 5,
  usage: "setup-menuticket --> Follow Steps",
  description: "Manage up to 25 different Ticket Systems in a form of a DISCORD-MENU",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {

    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    try {
      var theDB = client.menuticket;
      var pre;

      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      let NumberEmojis = getNumberEmojis();
      first_layer()
      async function first_layer() {

        let menuoptions = []
        for (let i = 1; i <= 100; i++) {
          menuoptions.push({
            value: `${i}. Menu Ticket`,
            description: `Manage/Edit the ${i}. Menu Ticket Setup`,
            emoji: NumberEmojiIds[i]
          })
        }

        let row1 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haz click para configurar los Menu-Tickets')
          .addOptions(
            menuoptions.slice(0, 25).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row2 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection2')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haz click para configurar los Menu-Tickets')
          .addOptions(
            menuoptions.slice(25, 50).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row3 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection3')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haz click para configurar los Menu-Tickets')
          .addOptions(
            menuoptions.slice(50, 75).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row4 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection4')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Haz click para configurar los Menu-Tickets')
          .addOptions(
            menuoptions.slice(75, 100).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )

        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.getAuthor('Menu Tickets', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/envelope_2709-fe0f.png', 'https://discord.gg/7drhkaXxSF'))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))

        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [row1, row2, row3, row4]
        })
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000, errors: ["time"]
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            let SetupNumber = menu?.values[0].split(".")[0];
            pre = `menuticket${SetupNumber}`;
            theDB = client.menuticket; //change to the right database
            second_layer(SetupNumber)
          } else menu?.reply({
            content: `<:no:833101993668771842> ¡No tienes permitido hacer eso! Solamente: <@${cmduser.id}>`,
            ephemeral: true
          });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({
            embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
            components: [],
            content: `<a:ys4:989016203525750825> **Seleccionado: \`${collected && collected.first() && collected.first().values ? collected.first().values[0] : "Nothing"}\` ****`
          }).catch(() => { });
        });
      }
      async function second_layer(SetupNumber) {
        //setup-menuticket
        theDB.ensure(message.guild.id, {
          messageId: "",
          channelId: "",
          claim: {
            enabled: false,
            messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
            messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
          },
          access: [],
          data: [
            /*
              {
                value: "",
                description: "",
                category: null,
                replyMsg: "{user} Welcome to the Support!",
              }
            */
          ]
        }, pre);
        let menuoptions = [{
          value: "Enviar Mensaje Configurado",
          description: `(Re) Envia al Mensaje (con Menu)`,
          emoji: "989016203525750825"
        },
        {
          value: "Añadir Opción de Ticket",
          description: `Añade hasta 25 diferentes opciónes`,
          emoji: "📤"
        },
        {
          value: "Editar Opción de Ticket",
          description: `Edita una de tus opciónes`,
          emoji: "🖊"
        },
        {
          value: "Remover Opción de Ticket",
          description: `Remueve una Opción`,
          emoji: "🗑"
        },
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder('Haz click para configurar los Menu-Tickets')
          .addOptions(
            menuoptions.map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            }))
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
      
          .setAuthor(client.getAuthor('Menu Tickets', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/envelope_2709-fe0f.png', 'https://discord.gg/7drhkaXxSF'))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))

        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [new MessageActionRow().addComponents(Selection)]
        })
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000, errors: ["time"]
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            handle_the_picks(menu?.values[0], menuoptiondata, SetupNumber)
          } else menu?.reply({
            content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`,
            ephemeral: true
          });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({
            embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
            components: [],
            content: `<a:ys4:989016203525750825> **Seleccionado: \`${collected && collected.first() && collected.first().values ? collected.first().values[0] : "Nothing"}\`**`
          })
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata, SetupNumber) {
        switch (optionhandletype) {
          case "Ticket Claim System": {
            /*
              claim: {
                enabled: false,
                messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
                messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
              }
            */
            let claimData = theDB.get(message.guild.id, `${pre}.claim`);
            third_layer(SetupNumber)
            async function third_layer(SetupNumber) {
              let menuoptions = [{
                value: `${claimData.enabled ? "Disable Claim System" : "Enable Claim System"}`,
                description: `${claimData.enabled ? "No need to claim the Tickets anymore" : "Make it so that Staff needs to claim the Ticket"}`,
                emoji: `${claimData.enabled ? "❌" : "✅"}`
              },
              {
                value: "Edit Open Message",
                description: `Edit the Claim-Info-Message when a Ticket opens`,
                emoji: "🛠"
              },
              {
                value: "Edit Claim Message",
                description: `Edit the Claim-Message when a Staff claims it!`,
                emoji: "😎"
              },
              {
                value: "Cancel",
                description: `Cancel and stop the Ticket-Setup!`,
                emoji: "862306766338523166"
              }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection')
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder(`Click me to manage the ${SetupNumber} Ticket System!\n\n**You've picked:**\n> Ticket Claim System`)
                .addOptions(
                  menuoptions.map(option => {
                    let Obj = {
                      label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                      value: option.value.substring(0, 50),
                      description: option.description.substring(0, 50),
                    }
                    if (option.emoji) Obj.emoji = option.emoji;
                    return Obj;
                  }))

              //define the embed
              let MenuEmbed = new Discord.MessageEmbed()
                .setColor(es.color)
                .setAuthor(SetupNumber + " Ticket Setup", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/incoming-envelope_1f4e8.png", "https://discord.gg/milrato")
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable4"]))
              //send the menu msg
              let menumsg = await message.reply({
                embeds: [MenuEmbed],
                components: [new MessageActionRow().addComponents(Selection)]
              })
              //function to handle the menuselection
              function menuselection(menu) {
                let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
                if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable5"]))
                menu?.deferUpdate();
                handle_the_picks2(menu?.values[0], SetupNumber)
              }
              //Create the collector
              const collector = menumsg.createMessageComponentCollector({
                filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                time: 90000
              })
              //Menu Collections
              collector.on('collect', menu => {
                if (menu?.user.id === cmduser.id) {
                  collector.stop();
                  let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
                  if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                  menuselection(menu)
                } else menu?.reply({
                  content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`,
                  ephemeral: true
                });
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({
                  embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
                  components: [],
                  content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**"}`
                })
              });
            }
            async function handle_the_picks2(optionhandletype) {

              switch (optionhandletype) {
                case `${claimData.enabled ? "Disable Claim System" : "Enable Claim System"}`: {
                  theDB.set(message.guild.id, !claimData.enabled, `${pre}.claim.enabled`);
                  claimData = theDB.get(message.guild.id, `${pre}.claim`);
                  return message.reply({
                    embeds: [
                      new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                        .setFooter(client.getFooter(es))
                        .setTitle(`${claimData.enabled ? "Enabled the Claim System" : "Disabled the Claim System"}`)
                        .setDescription(`${claimData.enabled ? "When a User opens a Ticket, a Staff Member needs to claim it, before he can send something in there!\n> This is useful for Professionality and Information!\n> **NOTE:** Admins can always chat..." : "You now don't need to claim a Ticket anymore"}`)
                    ]
                  });
                } break;
                case "Edit Open Message": {
                  var rembed = new MessageEmbed()
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                    .setTitle("What should be the new Message when a User opens a Ticket?")
                    .setDescription(String("{user} will be replaced with a USERPING\n\n**Current Message:**\n>>> " + claimData.messageOpen.substring(0, 1900)))
                  message.reply({
                    embeds: [rembed]
                  }).then(msg => {
                    msg.channel.awaitMessages({
                      filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 30000,
                      errors: ['time']
                    }).then(collected => {
                      theDB.set(message.guild.id, collected.first().content, `${pre}.claim.messageOpen`);
                      message.reply(`Successfully set the New Message!`)
                    }).catch(error => {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                  })
                } break;
                case "Edit Claim Message": {
                  var rembed = new MessageEmbed()
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                    .setTitle("What should be the new Message when a Staff claims a Ticket?")
                    .setDescription(String("{user} will be replaced with a USERPING\n{claimer} will be replaced with a PING for WHO CLAIMED IT\n\n**Current Message:**\n>>> " + claimData.messageClaim.substring(0, 1900)))
                  message.reply({
                    embeds: [rembed]
                  }).then(msg => {
                    msg.channel.awaitMessages({
                      filter: m => m.author.id === message.author.id,
                      max: 1,
                      time: 30000,
                      errors: ['time']
                    }).then(collected => {
                      theDB.set(message.guild.id, collected.first().content, `${pre}.claim.messageClaim`);
                      message.reply(`Successfully set the New Message!`)
                    }).catch(error => {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                  })
                } break;
              }
            }
          } break;
          case "Enviar Mensaje Configurado": {
            await message.guild.emojis.fetch().catch(() => { });
            let data = theDB.get(message.guild.id, pre + ".data");
            let settings = theDB.get(message.guild.id, pre);
            if (!data || data.length < 1) {
              return message.reply("<:no:833101993668771842> **You need to add at least 1 Open-Ticket-Option**")
            }
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor(es.color)
                  .setTitle("Cual debería de ser el Texto a Mostrar en el Embed?")
                  .setDescription(`Por ejemplo:\n> \`\`\`Para abrir un Ticket, selecciona en qué necesitas soporte!\`\`\``)
              ]
            });

            let collected = await tempmsg.channel.awaitMessages({
              filter: (m) => m.author.id == cmduser.id,
              max: 1,
              time: 90000, errors: ["time"]
            });
            if (collected && collected.first().content) {
              let tempmsg = await message.reply({
                embeds: [
                  new MessageEmbed()
                    .setColor(es.color)
                    .setTitle("En donde debería de enviar el mensaje?")
                    .setDescription(`Menciona el canal!\n> Escribe: \`#Canal\`${settings.channelId && message.guild.channels.cache.get(settings.channelId) ? `| Canal del Ticket: <#${settings.channelId}>` : settings.channelId ? `| Canal del Ticket: ${settings.channelId} (Channel got deleted)` : ""}\n\nPuedes editar el titulo etc. después usand \`${prefix}editembed\` Command`)
                ]
              });

              let collected2 = await tempmsg.channel.awaitMessages({
                filter: (m) => m.author.id == cmduser.id,
                max: 1,
                time: 90000, errors: ["time"]
              });
              if (collected2 && (collected2.first().mentions.channels.size > 0 || message.guild.channels.cache.get(collected2.first().content?.trim()))) {
                let data = theDB.get(message.guild.id, pre + ".data");
                let channel = collected2.first().mentions.channels.first() || message.guild.channels.cache.get(collected2.first().content?.trim());
                let msgContent = collected.first().content;
                let embed = new MessageEmbed()
                  .setColor(es.color)
                  .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setFooter(client.getFooter(es))
                  .setDescription(msgContent)
                  .setTitle("📨 Abrir un Ticket")
                //define the selection
                let Selection = new MessageSelectMenu()
                  .setCustomId('MenuSelection')
                  .setMaxValues(1)
                  .setMinValues(1)
                  .setPlaceholder('¡Seleccione el tipo de ayuda!')
                  .addOptions(
                    data.map((option, index) => {
                      let Obj = {
                        label: option.value.substring(0, 50),
                        value: option.value.substring(0, 50),
                        description: option.description.substring(0, 50),
                        emoji: isEmoji(option.emoji) ? option.emoji : NumberEmojiIds[index + 1]
                      }
                      return Obj;
                    }))
                channel.send({
                  embeds: [embed],
                  components: [new MessageActionRow().addComponents([Selection])]
                }).catch((err) => {
                  console.log(err)
                  let Selection = new MessageSelectMenu()
                    .setCustomId('MenuSelection')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder('Click me to Access the Menu-Ticket System!')
                    .addOptions(
                      data.map((option, index) => {
                        let Obj = {
                          label: option.value.substring(0, 50),
                          value: option.value.substring(0, 50),
                          description: option.description.substring(0, 50),
                          emoji: NumberEmojiIds[index + 1]
                        }
                        return Obj;
                      }))
                  channel.send({
                    embeds: [embed],
                    components: [new MessageActionRow().addComponents([Selection])]
                  }).catch((e) => {
                    console.warn(e)
                  }).then(msg => {
                    theDB.set(message.guild.id, msg.id, pre + ".messageId");
                    theDB.set(message.guild.id, channel.id, pre + ".channelId");
                    message.reply(`Successfully Setupped the Menu-Ticket in <#${channel.id}>`)
                  });
                }).then(msg => {
                  theDB.set(message.guild.id, msg.id, pre + ".messageId");
                  theDB.set(message.guild.id, channel.id, pre + ".channelId");
                  message.reply(`<a:ys4:989016203525750825> Configurado en <#${channel.id}>`)
                });
              } else {
                return message.reply("<:no:833101993668771842> **You did not ping a valid Channel!**")
              }
            } else {
              return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
            }
          }
            break;
          case "Añadir Opción de Ticket": {
            let data = theDB.get(message.guild.id, pre + ".data");
            if (data.length >= 25) {
              return message.reply("<:no:833101993668771842> **You reached the limit of 25 different Options!** Remove another Option first!")
            }
            //ask for value and description
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor(es.color)
                  .setTitle("Cual debería de ser el VALOR y la DESCRIPCIÓN de la Opción?")
                  .setDescription(`**USO:** \`VALOR++DESCRIPCIÓN\`\n> **Nota:** La longitud máxima de VALOR es: \`25 Letters\`\n> **Nota:** La longitud máxima de la DESCRIPCIÓN es \`50 Letters\`\n\nPor Ejemplo:\n> \`\`\`Soporte General++Recibe ayuda en lo que necesites!\`\`\``)
              ]
            });
            let collected = await tempmsg.channel.awaitMessages({
              filter: (m) => m.author.id == cmduser.id,
              max: 1,
              time: 90000, errors: ["time"]
            });
            if (collected && collected.first().content) {
              if (!collected.first().content.includes("++")) return message.reply("<:no:833101993668771842> **Invalid Usage! Please mind the Usage and check the Example**")
              let value = collected.first().content.split("++")[0].trim().substring(0, 25);
              let index = data.findIndex(v => v.value == value);
              if (index >= 0) {
                return message.reply("<:no:833101993668771842> **Options can't have the SAME VALUE!** There is already an Option with that Value!");
              }
              let description = collected.first().content.split("++")[1].trim().substring(0, 50);
              //ask for category
              let tempmsg = await message.reply({
                embeds: [
                  new MessageEmbed()
                    .setColor(es.color)
                    .setTitle("En qué categoría se deberían de abrir los Tickets?")
                    .setDescription(`**Esto es sugerido para rellenar ya que, hay ajustes para SINCRONIZAR con esa Categoría!**\nEnvia la ID de la Categoría / envia \`no\` para dejarlo sin categoría!\nPor Ejemploe:\n> \`840332704494518292\``)
                ]
              });
              let collected2 = await tempmsg.channel.awaitMessages({
                filter: (m) => m.author.id == cmduser.id,
                max: 1,
                time: 90000, errors: ["time"]
              });
              if (collected2 && collected2.first().content) {
                let categoryId = collected2.first().content;
                let category = message.guild.channels.cache.get(categoryId) || null;
                if (category && category.id) category = category.id;
                else category = null;
                //ask for reply message
                let tempmsg = await message.reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor(es.color)
                      .setTitle("Cual debería de ser el mensaje de bievenida cuando alguien abre un Ticket?")
                      .setDescription(`Por Ejempplo:\n> \`\`\`{user} Bienvenido al Soporte! Dinos en qué necesitas ayuda!\`\`\``)
                  ]
                });
                let collected3 = await tempmsg.channel.awaitMessages({
                  filter: (m) => m.author.id == cmduser.id,
                  max: 1,
                  time: 90000, errors: ["time"]
                });
                if (collected3 && collected3.first().content) {
                  let replyMsg = collected3.first().content;
                  let defaultname = "🎫・{count}・{member}";
                  let tempmsg = await message.reply({
                    embeds: [
                      new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("Cual debería de ser el NOMBRE por DEFECTO?")
                        .setDescription(`Actual/Sugerido es:  \`${defaultname}\` que se convertirá en: \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\`\n> \`{member}\`... será reemplazado por el nombre del usuario que ha abierto el ticket\n> \`{count}\` ... será reemplazado por la ID del Ticket\n**Envía el mensaje!**`)
                    ]
                  });
                  let collected4 = await tempmsg.channel.awaitMessages({
                    filter: (m) => m.author.id == cmduser.id,
                    max: 1,
                    time: 90000, errors: ["time"]
                  });
                  if (collected4 && collected4.first().content) {
                    if (!collected4.first().content || !collected4.first().content.includes("{member}")) {
                      message.reply("You need to have {member} somewhere, using the SUGGESTION DEFAULTNAME (you change it via edit)");
                    } else if (!collected4.first().content || collected4.first().content.length > 32) {
                      message.reply("A Channelname can't be longer then 32 Characters, using the SUGGESTION DEFAULTNAME (you change it via edit)");
                    } else {
                      defaultname = collected4.first().content
                    }


                    var rermbed = new MessageEmbed()
                      .setColor(es.color)
                      .setTitle("Cual debería de ser el EMOJI para esta opción?")
                      .setDescription(`Reacciona en este mensaje con el emoji deseado\n\n Reacciona con <:numero1:989991546877263872> para usar el emoji por defecto (<:numero1:989991546877263872>)`)

                    var emoji, emojiMsg;
                    message.reply({ embeds: [rermbed] }).then(async msg => {
                      await msg.react("989991546877263872").catch(console.warn);
                      msg.awaitReactions({
                        filter: (reaction, user) => user.id == cmduser.id,
                        max: 1,
                        time: 180e3
                      }).then(async collected => {
                        await msg.reactions.removeAll().catch(console.warn);
                        if (collected.first().emoji?.id && collected.first().emoji?.id.length > 2) {
                          emoji = collected.first().emoji?.id;
                          if (collected.first().emoji?.animated) emojiMsg = "<" + "a:" + collected.first().emoji?.name + ":" + collected.first().emoji?.id + ">";
                          else emojiMsg = "<" + ":" + collected.first().emoji?.name + ":" + collected.first().emoji?.id + ">";
                        } else if (collected.first().emoji?.name) {
                          emoji = collected.first().emoji?.name;
                          emojiMsg = collected.first().emoji?.name;
                        } else {
                          message.reply(":x: **No se agregó emoji válido, usando EMOJI predeterminado**");
                          emoji = null;
                          emojiMsg = NumberEmojis[data.length];
                        }

                        try {
                          await msg.react(emoji);
                          if (NumberEmojiIds.includes(collected.first().emoji?.id)) {
                            emoji = null;
                            emojiMsg = NumberEmojis[data.length];
                          }
                        } catch (e) {
                          console.log(e)
                          message.reply(":x: **No pude usar el EMOJI PERSONALIZADO que agregaste, ya que no puedo acceder a él/usarlo como una reacción/emoji para el menú**\nUso de emojis predeterminados!");
                          emoji = null;
                          emojiMsg = NumberEmojis[data.length];
                        }
                        finished();

                      }).catch(() => {
                        message.reply(":x: **NNo se agregó emoji válido, usando EMOJI predeterminado**");
                        emoji = null;
                        emojiMsg = NumberEmojis[data.length];
                        finished();
                      });
                    })
                    function finished() {
                      theDB.push(message.guild.id, {
                        value,
                        description,
                        category,
                        defaultname,
                        replyMsg,
                        emoji
                      }, pre + ".data");
                      message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("<a:ys4:989016203525750825> Datos Añadidos a la Lista!")
                            .setDescription(`Asegurate de re-enviar el mensaje, para actualizar la información!\n> \`${prefix}setup-menuticket\`  --> Enviar Mensaje Configurado`)
                            .addField("Valor:", `> ${value}`.substring(0, 1024), true)
                            .addField("Descripción:", `> ${description}`.substring(0, 1024), true)
                            .addField("Categoría:", `> <#${category}> (${category})`.substring(0, 1024), true)
                            .addField("Nombre por Defecto:", `> \`${defaultname}\` --> \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\``.substring(0, 1024), true)
                            .addField("Mensaje de Respuesta::", `> ${replyMsg}`.substring(0, 1024), true)
                            .addField("Emoji de Ticket:", `> ${emojiMsg}`.substring(0, 1024), true)
                        ]
                      });
                    }



                  } else {
                    return message.reply("<:nope3:989982433522905098> **¡No ingresó un mensaje válido a tiempo! CANCELADO!**")
                  }
                } else {
                  return message.reply("<:nope3:989982433522905098> **¡No ingresó un mensaje válido a tiempo! CANCELADO!**")
                }
              } else {
                return message.reply("<:nope3:989982433522905098> **¡No ingresó un mensaje válido a tiempo! CANCELADO!**")
              }
            } else {
              return message.reply("<:nope3:989982433522905098> **¡No ingresó un mensaje válido a tiempo! CANCELADO!**")
            }
          }
            break;
          case "Editar Opción de Ticket": {


            let data = theDB.get(message.guild.id, pre + ".data");
            if (!data || data.length < 1) {
              return message.reply("<:no:833101993668771842> **No hay una Opción que pueda eliminare**")
            }
            let embed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setDescription("Que opción quieres editar?")
              .setTitle("Elige la opción que quieras editar!")
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(1)
              .setMinValues(1)
              .setPlaceholder('Elige una opción para editar!')
              .addOptions(
                data.map((option, index) => {
                  let Obj = {
                    label: option.value.substring(0, 50),
                    value: option.value.substring(0, 50),
                    description: option.description.substring(0, 50),
                    emoji: isEmoji(option.emoji) ? option.emoji : NumberEmojiIds[index + 1]
                  }
                  return Obj;
                }))
            let menumsg;

            //send the menu msg
            menumsg = await message.reply({
              embeds: [embed],
              components: [new MessageActionRow().addComponents([Selection])]
            }).catch(async (err) => {
              console.log(err)
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection')
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder('Haz click para configurar los Menu-Tickets')
                .addOptions(
                  data.map((option, index) => {
                    let Obj = {
                      label: option.value.substring(0, 50),
                      value: option.value.substring(0, 50),
                      description: option.description.substring(0, 50),
                      emoji: NumberEmojiIds[index + 1]
                    }
                    return Obj;
                  }))
              menumsg = await message.reply({
                embeds: [embed],
                components: [new MessageActionRow().addComponents([Selection])]
              }).catch((e) => {
                console.warn(e)
              })
            })
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({
              filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
              max: 1,
              time: 90000, errors: ["time"]
            })
            //Menu Collections
            collector.on('collect', async menu => {
              if (menu?.user.id === cmduser.id) {
                let index = data.findIndex(v => v.value == menu?.values[0]);




                let menuoptions = [{
                  value: "Editar Valor y Descripción".substring(0, 25),
                  description: `Editar el Valor y Descripción de la Opción`,
                  emoji: "⚙️"
                },
                {
                  value: "Editar Nombre de los Tickets",
                  description: `Edit el Nombre de los Ticket-canales`,
                  emoji: "🎟️"
                },
                {
                  value: "Editar Nombre de los Tickets Cerrados",
                  description: `Edit el Nombre de los Ticket-canales Cerrados`,
                  emoji: "🚫"
                },
                {
                  value: "Change Open Category",
                  description: `When Opening a Ticket, it will be moved to there`,
                  emoji: "✂️"
                },
                {
                  value: "Cambiar Emoji de la Option",
                  description: `Cambiar el Emoji de la Option del Menu`,
                  emoji: "⭐"
                },
                {
                  value: "Editar Mensaje",
                  description: `Cambiar el Mensaje Cuando se abre el Ticket`,
                  emoji: "🛠️"
                },
                  {
                    value: "Añadir rol de Tickets",
                    description: `Añade un rol que pueda dar soporte a los Tickets`,
                    emoji: "😎"

                  },
                  {
                    value: "Remover Rol de Tickets",
                    description: `Remueve un rol de soporte de los Tickets`,
                    emoji: "🗑"
              
                  },
                  {
                    value: "Categoría de Tickets",
                    description: `Define la Categoría donde se crearan los Tickets`,
                    emoji: "🔘"
                  },
                  {
                    value: "Categoría de Tickets Cerrados",
                    description: `Define la Categoría para Cerrar el ticekt`,
                    emoji: "🔐"
                  },
                  {
                    value: "Sistema de Reclamación",
                    description: `Configura el Sistema de Reclamación`,
                    emoji: "989016203525750825"
                  },
                  {
                    value: "Canal de Registro",
                    description: `Define un canal para Registrar los Tickets`,
                    emoji: "📜"
                  },
                  {
                  
    
                  value: "Cambiar mensaje de respuesta",
                  description: `Cambiar el Mensaje cuando abrió el Ticket`,
                  emoji: "✅"
                },
        
              {
                value: "Cancelar",
                description: `Cancelar y finalizar`,
                emoji: "862306766338523166"
              },
                ]
                //define the selection
                let Selection = new MessageSelectMenu()
                  .setCustomId('MenuSelection')
                  .setMaxValues(1)
                  .setMinValues(1)
                  .setPlaceholder(`Haz click para configurar los Menu-Tickets`)
                  .addOptions(
                    menuoptions.map(option => {
                      let Obj = {
                        label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                        value: option.value.substring(0, 50),
                        description: option.description.substring(0, 50),
                      }
                      if (option.emoji) Obj.emoji = option.emoji;
                      return Obj;
                    }))
                //define the embed
                let MenuEmbed = new Discord.MessageEmbed()
                  .setColor(es.color)
                  .setAuthor(client.getAuthor('Soporte General', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/envelope_2709-fe0f.png', 'https://discord.gg/7drhkaXxSF'))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))

                //send the menu msg
                let menumsg = await message.reply({
                  embeds: [MenuEmbed],
                  components: [new MessageActionRow().addComponents(Selection), new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL("https://youtu.be/QGESDc31d4U").setLabel("Tutorial Video").setEmoji("840260133686870036"))]
                })
                //Create the collector
                const collector = menumsg.createMessageComponentCollector({
                  filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                  time: 90000, errors: ["time"]
                })
                //Menu Collections
                collector.on('collect', menu => {
                  if (menu?.user.id === cmduser.id) {
                    collector.stop();
                    let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
                    if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                    menu?.deferUpdate();
                    handle_the_picks3(menu?.values[0], menuoptiondata, SetupNumber)
                  } else menu?.reply({
                    content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`,
                    ephemeral: true
                  });
                });
                //Once the Collections ended edit the menu message
                collector.on('end', collected => {
                  menumsg.edit({
                    embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
                    components: [],
                    content: `<a:ys4:989016203525750825> **Seleccionado: \`${collected && collected.first() && collected.first().values ? collected.first().values[0] : "Nothing"}\`**`
                  })
                });

                async function handle_the_picks3(optionhandletype) {

                  switch (optionhandletype) {
                    case `Editar Valor y Descripción`.substring(0, 25): {
                      let tempmsg = await message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("Cual debería de ser el VALOR y DESCRIPCIÓN de esta opcion?")
                            .setDescription(`**Uso:** \`VALOR++DESCRIPCIÓN\`\n> **Nota:** La longitud máxima de VALOR es:  \`25 Letters\`\n> **Nota:** La longitud máxima de la DESCRIPCIÓN es:  \`50 Letters\`\n\nPor Ejemplo:\n> \`\`\`Soporte General++Recibe ayuda en lo que necesites!\`\`\``)
                        ]
                      });
                      let collected = await tempmsg.channel.awaitMessages({
                        filter: (m) => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000, errors: ["time"]
                      });
                      if (collected && collected.first().content) {
                        if (!collected.first().content.includes("++")) return message.reply("<:nope3:989982433522905098> **¡Uso no válido! Tenga en cuenta el uso y verifique el ejemplo**")
                        let value = collected.first().content.split("++")[0].trim().substring(0, 25);
                        let index2 = data.findIndex(v => v.value == value);
                        if (index2 >= 0 && index != index2) {
                          return message.reply("<:nope3:989982433522905098> **Las Opciones no pueden tener EL MISMO VALOR!** Ya hay una Opción con ese Valor!");
                        }
                        let description = collected.first().content.split("++")[1].trim().substring(0, 50);
                        data[index].value = value;
                        data[index].description = description;
                        return finished();
                      } else {
                        return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
                      }
                    } break;
                    case `Change Open Category`: {
                      let tempmsg = await message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("Escribe la Categoría de los Tickets!")
                            .setDescription(`**This is suggested to fill it in, because there are settings for SYNCING to that Category!**\n\nJust send the ID of it, send \`no\` for no category!\nFor Example:\n> \`840332704494518292\``)
                        ]
                      });
                      let collected = await tempmsg.channel.awaitMessages({
                        filter: (m) => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000, errors: ["time"]
                      });
                      let categoryId = collected ? collected2.first().content : "";
                      let category = message.guild.channels.cache.get(categoryId) || null;
                      if (category && category.id) {
                        data[index].category = category.id;
                        return finished();
                      }
                      return message.reply("<:no:833101993668771842> **Invalid Category-ID added**")
                    } break;
                    case `Editar Nombre de los Tickets`: {
                      let defaultname = "🎫・{count}・{member}";
                      let tempmsg = await message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("Cual debería de ser el Nombre de los Tickets?")
                            .setDescription(`Actual/Sugerido es:  \`${defaultname}\` que se convertirá en: \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\`\n> \`{member}\` ... será reemplazado por el nombre del usuario que ha abierto el ticket\n> \`{count}\` ... será reemplazado por el nº de ticket\n**Envia el mensaje!**`)
                        ]
                      });
                      let collected = await tempmsg.channel.awaitMessages({
                        filter: (m) => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000, errors: ["time"]
                      });
                      let content = collected.first().content;
                if(!collected4.first().content || !collected4.first().content.includes("{member}")) {
                  return message.reply("You need to have {member} somewhere")
                }
                if (!content || content.length > 32) {
                  return message.reply("A Channelname can't be longer then 32 Characters")
                }
                defaultname = content;
                client.setups.set(message.guild.id, defaultname, `ticketsystem${SetupNumber}.defaultname`);
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setColor(es.color)
                    .setTitle(`<a:ys2:934869188349161492> Cambiado el Nombre de los Tickets a \`${defaultname}\``)
                  ]
                });
                    } break;
                    case `Cambiar Emoji de la Option`: {
                      var rermbed = new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("Cual debería de ser el EMOJI de esta Opción?")
                        .setDescription(`Reacciona en **_ESTE MENSAJE_** con el emoji deseado\n\n Reacciona con <:numero1:989991546877263872> para usar el emoji normal (<:numero1:989991546877263872>)`)

                      var emoji, emojiMsg;
                      message.reply({ embeds: [rermbed] }).then(async msg => {
                        await msg.react("989991546877263872").catch(console.warn);
                        msg.awaitReactions({
                          filter: (reaction, user) => user.id == cmduser.id,
                          max: 1,
                          time: 180e3
                        }).then(async collected => {
                          await msg.reactions.removeAll().catch(console.warn);
                          if (collected.first().emoji?.id && collected.first().emoji?.id.length > 2) {
                            emoji = collected.first().emoji?.id;
                            if (collected.first().emoji?.animated) emojiMsg = "<" + "a:" + collected.first().emoji?.name + ":" + collected.first().emoji?.id + ">";
                            else emojiMsg = "<" + ":" + collected.first().emoji?.name + ":" + collected.first().emoji?.id + ">";
                          } else if (collected.first().emoji?.name) {
                            emoji = collected.first().emoji?.name;
                            emojiMsg = collected.first().emoji?.name;
                          } else {
                            message.reply(":x: **No valid emoji added, using default EMOJI**");
                            data[index].emoji = null;
                            data[index].emojiMsg = NumberEmojis[data.length];
                          }

                          try {
                            await msg.react(emoji);
                            if (NumberEmojiIds.includes(collected.first().emoji?.id)) {
                              data[index].emoji = null;
                              data[index].emojiMsg = NumberEmojis[data.length];
                            } else {
                              data[index].emoji = emoji;
                              data[index].emojiMsg = emojiMsg;
                            }
                          } catch (e) {
                            console.log(e)
                            message.reply(":x: **TIMEOUT! Usando el emoji por defecto (<:numero1:989991546877263872>)");
                            data[index].emoji = null;
                            data[index].emojiMsg = NumberEmojis[data.length];
                          }
                          finished();
                        }).catch((e) => {
                          console.log(e)
                          message.reply(":x: **No valid emoji added, using default EMOJI**");
                          data[index].emoji = null;
                          data[index].emojiMsg = NumberEmojis[data.length];
                          finished();
                        });
                      })
                    } break;
                    case `Cambiar mensaje de respuesta`: {
                      let tempmsg = await message.reply({
                        embeds: [
                          new MessageEmbed()
                            .setColor(es.color)
                            .setTitle("Que texto de respuesta se tiene que mostrar cuando alguien intente abrir un ticket?")
                            .setDescription(`Por ejemploe:\n> \`\`\`{user} Bienvenido al Soporte! Dinos en qué necesitas ayuda\`\`\``)
                        ]
                      });
                      let collected = await tempmsg.channel.awaitMessages({
                        filter: (m) => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000, errors: ["time"]
                      });
                      if (collected && collected.first().content) {
                        data[index].replyMsg = collected3.first().content;
                        return finished();
                      } else {
                        return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
                      }
                    } break;
                  }
                }
                function finished() {
                  theDB.set(message.guild.id, data, pre + ".data");
                  let {
                    value,
                    description,
                    defaultname,
                    category,
                    replyMsg,
                    emojiMsg, emoji
                  } = data[index];
                  emojiMsg = emojiMsg ? emojiMsg : client.emojis.cache.has(emoji) ? client.emojis.cache.get(emoji).toString() : emoji;
                  message.reply({
                    embeds: [
                      new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("<a:ys4:989016203525750825> Datos Añadidos a la Lista!")
                        .setDescription(`>>> ${menu?.values.map(i => `\`${i}\``).join(", ")}\n\nNo olvide volver a enviar el mensaje de configuración del ticket!`)
                        .addField("Valor:", `> ${value}`.substring(0, 1024), true)
                        .addField("Descripción:", `> ${description}`.substring(0, 1024), true)
                        .addField("Categoría:", `> <#${category}> (${category})`.substring(0, 1024), true)
                        .addField("Nombre por Defecto:", `> \`${defaultname}\` --> \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\``.substring(0, 1024), true)
                        .addField("Mensaje de Respuesta:", `> ${replyMsg}`.substring(0, 1024), true)
                        .addField("Emoji de Ticket:", `> ${emojiMsg}`.substring(0, 1024), true)

                    ]
                  });
                }



              } else menu?.reply({
                content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`,
                ephemeral: true
              });
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({
                embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
                components: [],
                content: `<a:ys4:989016203525750825> **Seleccionado: \`${collected.size > 0 ? collected.first().values[0] : "NOTHING"}\`**`
              })
            });
          }
            break;
          case "Remove Ticket Option": {
            let data = theDB.get(message.guild.id, pre + ".data");
            if (!data || data.length < 1) {
              return message.reply("<:no:833101993668771842> **There are no Open-Ticket-Options to remove**")
            }
            let embed = new MessageEmbed()
              .setColor(es.color)
              .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setDescription("Just pick the Options you want to remove!")
              .setTitle("Which Option Do you want to remove?")
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(data.length)
              .setMinValues(1)
              .setPlaceholder('Click me to setup the Menu-Ticket System!')
              .addOptions(
                data.map((option, index) => {
                  let Obj = {
                    label: option.value.substring(0, 50),
                    value: option.value.substring(0, 50),
                    description: option.description.substring(0, 50),
                    emoji: NumberEmojiIds[index + 1]
                  }
                  return Obj;
                }))
            //send the menu msg
            let menumsg;
            menumsg = await message.reply({
              embeds: [embed],
              components: [new MessageActionRow().addComponents([Selection])]
            }).catch(async (err) => {
              console.log(err)
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection')
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder('Click me to Access the Menu-Ticket System!')
                .addOptions(
                  data.map((option, index) => {
                    let Obj = {
                      label: option.value.substring(0, 50),
                      value: option.value.substring(0, 50),
                      description: option.description.substring(0, 50),
                      emoji: NumberEmojiIds[index + 1]
                    }
                    return Obj;
                  }))
              menumsg = await message.reply({
                embeds: [embed],
                components: [new MessageActionRow().addComponents([Selection])]
              }).catch((e) => {
                console.warn(e)
              })
            })
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({
              filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
              time: 90000, errors: ["time"]
            })
            //Menu Collections
            collector.on('collect', async menu => {
              if (menu?.user.id === cmduser.id) {
                collector.stop();
                for (const value of menu?.values) {
                  let index = data.findIndex(v => v.value == value);
                  data.splice(index, 1)
                }
                theDB.set(message.guild.id, data, pre + ".data");
                message.reply(`**Successfully removed:**\n>>> ${menu?.values.map(i => `\`${i}\``).join(", ")}\n\nDon't forget to resend the Ticket Config-Message!`)
              } else menu?.reply({
                content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`,
                ephemeral: true
              });
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({
                embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
                components: [],
                content: `<a:yes:833101995723194437> **Selected: \`${collected.first().values[0]}\`**`
              })
            });
          }
            break;
          case "Categoría de Tickets Cerrados": {
            let parentId = theDB.get(message.guild.id, `${pre}.closedParent`);
            let parent = parentId ? message.guild.channels.cache.get(parentId) : null;
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle("Escribe la Categoría de los Tickets Cerrados!")
              .setDescription(`Currently it's: \`${parentId ? "Not Setupped yet" : parent ? parent.name : `Channel not Found: ${parentId}`}\`!\nWhen closing a Ticket, it will be moved to there until it get's deleted!\n> **Send the new __PARENT ID__ now!**`)
            message.reply({
              embeds: [rembed]
            }).then(msg => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                let content = collected.first().content;
                if (!content || content.length > 19 || content.length < 17) {
                  return message.reply("An Id is between 17 and 19 characters big")
                }
                parent = message.guild.channels.cache.get(content);
                if (!parent) {
                  return message.reply(`There is no parent i can access in this Guild which has the ID ${content}`);
                }
                if (parent.type !== "GUILD_CATEGORY") {
                  return message.reply(`<#${parent.id}> is not a CATEGORY/PARENT`);
                }
                theDB.set(message.guild.id, parent.id, `${pre}.closedParent`);
                message.reply(`I will now move closed Tickets to ${parent.name} (${parent.id})`);
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          } break;

          case "Añadir rol de Tickets": {
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor(es.color)
                  .setTitle("Menciona un Rol!")
                  .setDescription(`Menciona el Rol`)
              ]
            });

            let collected = await tempmsg.channel.awaitMessages({
              filter: (m) => m.author.id == cmduser.id,
              max: 1,
              time: 90000, errors: ["time"]
            });
            if (collected && (collected.first().mentions.roles.size > 0 || collected.first().mentions.users.size > 0)) {
              let { users, roles } = collected.first().mentions;
              let settings = theDB.get(message.guild.id, pre);
              let toadd = [];
              let toremove = [];
              for (const role of roles.map(r => r.id)) {
                if ([...settings.access].includes(role)) {
                  toremove.push(role)
                } else {
                  toadd.push(role)
                }
              }
              for (const user of users.map(r => r.id)) {
                if ([...settings.access].includes(user)) {
                  toremove.push(user)
                } else {
                  toadd.push(user)
                }
              }
              for (const add of toadd) {
                theDB.push(message.guild.id, add, pre + ".access");
              }
              for (const remove of toremove) {
                theDB.remove(message.guild.id, remove, pre + ".access");
              }
              message.reply(`<a:ys4:989016203525750825> añadido: \`${toadd.length} al Soporte de Tickets`)
            } else {
              message.reply(":x: **No hizo ping a usuarios válidos**")
            }
          } break;
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable39"]))
        ]
      });
    }
    function getNumberEmojis() {
      return [
        "<:Number_0:843943149915078696>",
        "<:Number_1:843943149902626846>",
        "<:Number_2:843943149868023808>",
        "<:Number_3:843943149914554388>",
        "<:Number_4:843943149919535154>",
        "<:Number_5:843943149759889439>",
        "<:Number_6:843943150468857876>",
        "<:Number_7:843943150179713024>",
        "<:Number_8:843943150360068137>",
        "<:Number_9:843943150443036672>",
        "<:Number_10:843943150594031626>",
        "<:Number_11:893173642022748230>",
        "<:Number_12:893173642165383218>",
        "<:Number_13:893173642274410496>",
        "<:Number_14:893173642198921296>",
        "<:Number_15:893173642182139914>",
        "<:Number_16:893173642530271342>",
        "<:Number_17:893173642538647612>",
        "<:Number_18:893173642307977258>",
        "<:Number_19:893173642588991488>",
        "<:Number_20:893173642307977266>",
        "<:Number_21:893173642274430977>",
        "<:Number_22:893173642702250045>",
        "<:Number_23:893173642454773782>",
        "<:Number_24:893173642744201226>",
        "<:Number_25:893173642727424020>"
      ]
    }
    function isEmoji(emoji) {
      if (!emoji) return false;
      const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
      let unicode = regexExp.test(String(emoji));
      if (unicode) {
        return true
      } else {
        let dcemoji = client.emojis.cache.has(emoji) || message.guild.emojis.cache.has(emoji);
        if (dcemoji) return true;
        else return false;
      }
    }
  },
};
