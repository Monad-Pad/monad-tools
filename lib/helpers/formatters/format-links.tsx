import { CustomLink, SocialLink, SocialLinkObject } from "../../../types/socials";
import { SiDiscord, SiGitbook, SiGithub, SiTelegram, SiX } from "@icons-pack/react-simple-icons";

/**
 * Formats social links into a more readable format.
 * 
 * @param {SocialLink[]} links - The social links to format.
 * @param {number} [size=16] - The size of the icons.
 * @returns {SocialLinkObject[]} The formatted social links.
 */
export function formatSocialLinks(links: SocialLink[], size: number = 16): SocialLinkObject[] {
	if (!links) return [];
	const formattedLinks: SocialLinkObject[] = [];

	const twitterLink = links.find((link) => link.type === "twitter");
	const discordLink = links.find((link) => link.type === "discord");
	const githubLink = links.find((link) => link.type === "github");
	const gitbookLink = links.find((link) => link.type === "gitbook");
	const telegramLink = links.find((link) => link.type === "telegram");

	if (twitterLink) {
		formattedLinks.push({
			label: "Twitter",
			url: twitterLink.url,
			icon: <SiX size={size} />,
		});
	}

	if (discordLink) {
		formattedLinks.push({
			label: "Discord",
			url: discordLink.url,
			icon: <SiDiscord size={size} />,
		});
	}

	if (githubLink) {
		formattedLinks.push({
			label: "GitHub",
			url: githubLink.url,
			icon: <SiGithub size={size} />,
		});
	}

	if (gitbookLink) {
		formattedLinks.push({
			label: "GitBook",
			url: gitbookLink.url,
			icon: <SiGitbook size={size} />,
		});
	}

	if (telegramLink) {
		formattedLinks.push({
			label: "Telegram",
			url: telegramLink.url,
			icon: <SiTelegram size={size} />,
		});
	}

	return formattedLinks;
}

export function formatCustomLinks(links: SocialLink[]): CustomLink[] {
	if (!links) return [];
	const customLinks: CustomLink[] = [];

	if (links.length > 0) {
		links.forEach((link) => {
			if (link.type === "link") {
				customLinks.push({
					label: link.label,
					url: link.url,
				});
			}
		});
	}

	return customLinks;
}
