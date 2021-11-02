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
  @Slash("school")
  async grade(interaction: CommandInteraction) {
    await interaction.deferReply();

    const datas = [
      [
        {
          id: "理学院",
          style: MessageButtonStyles.PRIMARY,
        },
        {
          id: "工学院",
          style: MessageButtonStyles.PRIMARY,
        },
        {
          id: "物質理工学院",
          style: MessageButtonStyles.PRIMARY,
        },
      ],
      [
        {
          id: "情報理工学院",
          style: MessageButtonStyles.PRIMARY,
        },
        {
          id: "生命理工学院",
          style: MessageButtonStyles.PRIMARY,
        },
        {
          id: "環境・社会理工学院",
          style: MessageButtonStyles.PRIMARY,
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
      .setTitle("あなたの院は?")
      .setDescription("What is your school?")
      .setFooter("学部に在籍・学部を卒業した場合選択してください");
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
