import {
  ButtonInteraction,
  CommandInteraction,
  MessageButton,
  MessageActionRow,
  GuildMember,
  Guild,
  MessageEmbed,
  Role,
  Message,
} from "discord.js";
import { ButtonComponent, Discord, Slash } from "discordx";
import { MessageButtonStyles } from "discord.js/typings/enums";

@Discord()
class grade {
  @Slash("lang")
  async grade(interaction: CommandInteraction) {
    await interaction.deferReply();

    const datas = [
      [
        {
          id: "Japanese",
          style: MessageButtonStyles.PRIMARY,
        },
        {
          id: "Chinese",
          style: MessageButtonStyles.PRIMARY,
        },
        {
          id: "Korean",
          style: MessageButtonStyles.PRIMARY,
        },
      ],
      [
        {
          id: "English",
          style: MessageButtonStyles.DANGER,
        },
        {
          id: "Spanish",
          style: MessageButtonStyles.DANGER,
        },
        {
          id: "French",
          style: MessageButtonStyles.DANGER,
        },
        {
          id: "German",
          style: MessageButtonStyles.DANGER,
        },
        {
          id: "Portuguese",
          style: MessageButtonStyles.DANGER,
        },
      ],
      [
        {
          id: "Thai",
          style: MessageButtonStyles.SUCCESS,
        },
        {
          id: "Vietnamese",
          style: MessageButtonStyles.SUCCESS,
        },
        {
          id: "Malay",
          style: MessageButtonStyles.SUCCESS,
        },
        {
          id: "Tagalog",
          style: MessageButtonStyles.SUCCESS,
        },
        {
          id: "Bahasa Indonesia",
          style: MessageButtonStyles.SUCCESS,
        },
      ],
      [
        {
          id: "Arabic",
          style: MessageButtonStyles.SECONDARY,
        },
        {
          id: "Hindi",
          style: MessageButtonStyles.SECONDARY,
        },
        {
          id: "Russian",
          style: MessageButtonStyles.SECONDARY,
        },
      ],
    ];

    const buttons = datas.map((data) => {
      return data.map((button) => {
        return new MessageButton()
          .setLabel(button.id)
          .setStyle(button.style)
          .setCustomId(button.id);
      });
    });

    const rows = buttons.map((button) => {
      return new MessageActionRow().addComponents(...button);
    });

    const exampleEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("あなたが使用することができる言語は何ですか(複数可)")
      .setDescription("What language(s) are available to you?");

    const message = await interaction.followUp({
      embeds: [exampleEmbed],
      components: [...rows],
      fetchReply: true,
    });
    if (!(message instanceof Message)) {
      throw Error("InvalidMessage instance");
    }
    const collector = message.createMessageComponentCollector();
    collector.on("collect", async (collectInteraction: ButtonInteraction) => {
      if (!(collectInteraction.member instanceof GuildMember)) {
        return;
      }
      if (!(collectInteraction.guild instanceof Guild)) {
        return;
      }
      const Role = collectInteraction.guild.roles.cache.find(
        (role) => role.name === collectInteraction.customId
      );
      if (!Role) {
        return;
      }
      collectInteraction.member.roles.add(Role);
      const roleBool = collectInteraction.member.roles.cache.find(
        (role) => role.name === collectInteraction.customId
      );

      if (!roleBool) {
        await collectInteraction.reply({
          content: `${Role}を選びました。訂正・変更がある場合はもう一度同じボタンを押してください`,
          ephemeral: true,
        });
      }

      if (roleBool) {
        collectInteraction.member.roles.remove(Role);
        await collectInteraction.reply({
          content: `${Role}を取り消しました。`,
          ephemeral: true,
        });
      }
    });
  }
}
