/**
 * Telegraf Commands
 * =====================
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: MIT License
 *
 */
import bot from "./telegraf";
import * as databases from "./databases";
import config from "../configs/config";
import { launchPolling, launchWebhook } from "./launcher";
import { Context } from "vm";

/**
 * command: /quit
 * =====================
 * If user exit from bot
 *
 */
const quit = async (): Promise<void> => {
	bot.command("quit", (ctx: Context) => {
		ctx.telegram.leaveChat(ctx.message.chat.id);
		ctx.leaveChat();
	});
};

/**
 * command: /photo
 * =====================
 * Send photo from picsum to chat
 *
 */
const sendPhoto = async (): Promise<void> => {
	bot.command("photo", (ctx: Context) => {
		ctx.replyWithPhoto("https://picsum.photos/200/300/");
	});
};

/**
 * command: /start
 * =====================
 * Send welcome message
 *
 */
const start = async (): Promise<void> => {
	bot.start((ctx: Context) => {
		databases.writeUser(ctx.update.message.from);
		// console.log(ctx.update.message.from);

		// Check for Daily Play limit
		function getSpinData() {
			const today = new Date();
			const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today
				.getDate()
				.toString()
				.padStart(2, "0")}`;

			const spinData = databases.databases.spins
				.get("spins")
				.filter((item) => {
					const spinDate = new Date(item.spin_date);
					const formattedSpinDate = `${spinDate.getFullYear()}-${(spinDate.getMonth() + 1)
						.toString()
						.padStart(2, "0")}-${spinDate.getDate().toString().padStart(2, "0")}`;
					return item.user_id === ctx.update.message.from.id && formattedSpinDate === formattedToday;
				})
				.value();

			return spinData;
		}
		const spinCount = getSpinData().length;
		if (spinCount >= 2) {
			ctx.reply("You have already played Twice. \nTry again tomorrow :)");
			return;
		}

		ctx.reply("Welcome to Wheel of Fortune", {
			reply_markup: { keyboard: [[{ text: "web app", web_app: { url: config.weblink } }]] },
		});
	});
};

/**
 * Run bot
 * =====================
 * Send welcome message
 *
 */
const launch = async (): Promise<void> => {
	const mode = config.mode;
	if (mode === "webhook") {
		launchWebhook();
	} else {
		launchPolling();
	}
};

export { launch, quit, sendPhoto, start };
export default launch;
