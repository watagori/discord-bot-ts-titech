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
  @Slash("grade")
  async grade(interaction: CommandInteraction) {
    await interaction.deferReply();

    const datas = [
      [
        {
          id: "B1",
          style: MessageButtonStyles.PRIMARY,
        },
        {
          id: "B2",
          style: MessageButtonStyles.PRIMARY,
        },
        {
          id: "B3",
          style: MessageButtonStyles.PRIMARY,
        },
        {
          id: "B4",
          style: MessageButtonStyles.PRIMARY,
        },
      ],
      [
        {
          id: "M1",
          style: MessageButtonStyles.DANGER,
        },
        {
          id: "M2",
          style: MessageButtonStyles.DANGER,
        },
      ],
      [
        {
          id: "D1",
          style: MessageButtonStyles.SUCCESS,
        },
        {
          id: "D2",
          style: MessageButtonStyles.SUCCESS,
        },
        {
          id: "D3",
          style: MessageButtonStyles.SUCCESS,
        },
      ],
      [
        {
          id: "教授",
          style: MessageButtonStyles.SECONDARY,
        },
        {
          id: "准教授",
          style: MessageButtonStyles.SECONDARY,
        },
        {
          id: "助教",
          style: MessageButtonStyles.SECONDARY,
        },
        {
          id: "OB",
          style: MessageButtonStyles.SECONDARY,
        },
        {
          id: "その他の役職",
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
      .setTitle("あなたの学年・肩書は何ですか?")
      .setDescription("What is your grade/pisition?");
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
