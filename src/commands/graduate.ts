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
  @Slash("graduate")
  async grade(interaction: CommandInteraction) {
    await interaction.deferReply();

    const datas = [
      [
        {
          id: "知能情報",
          style: MessageButtonStyles.PRIMARY,
        },
        {
          id: "エネルギー",
          style: MessageButtonStyles.PRIMARY,
        },
        {
          id: "ライフエンジニアリング",
          style: MessageButtonStyles.PRIMARY,
        },
        {
          id: "エンジニアリングデザイン",
          style: MessageButtonStyles.PRIMARY,
        },
        {
          id: "原子核工学",
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
      .setTitle("あなたの専攻は?")
      .setDescription("What is your major?")
      .setFooter("専攻がある場合選択してください");
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
