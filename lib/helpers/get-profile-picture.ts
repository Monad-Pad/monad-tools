import { database } from "../links";
import { User } from "../../types/user";

const profilePictures = [
    "zombie.webp",
    "samurai.webp",
    "stonenad.webp",
];

/**
 * Generates a random profile picture URL.
 * 
 * @returns {string} The URL of a randomly selected profile picture.
 */
export const randomPfp = (): string => {
    const pfp = profilePictures[Math.floor(Math.random() * profilePictures.length)];
    return `${database.storage.users.default}/${pfp}`;
}

/**
 * Retrieves the profile picture URL for a given user.
 * 
 * @param {User | null} user - The user object to retrieve the profile picture URL for.
 * @returns {string} The URL of the user's profile picture, or a random profile picture if the user has no profile picture.
 */
export function getProfilePicture(user: User | null): string {
    if (user?.profile_picture_url) {
        return user.profile_picture_url;
    }

    return randomPfp();
}