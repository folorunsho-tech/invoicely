import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // recommended for GCM
const AUTH_TAG_LENGTH = 16;

// Master key comes from env, NEVER hardcoded or committed
function getMasterKey(): Buffer {
	const key = process.env.ENCRYPTION_MASTER_KEY;
	if (!key) throw new Error("ENCRYPTION_MASTER_KEY not set");
	return Buffer.from(key, "hex"); // 32 bytes hex = 64 chars
}

export function encrypt(plaintext: string): string {
	const iv = crypto.randomBytes(IV_LENGTH);
	const cipher = crypto.createCipheriv(ALGORITHM, getMasterKey(), iv);

	const encrypted = Buffer.concat([
		cipher.update(plaintext, "utf8"),
		cipher.final(),
	]);
	const authTag = cipher.getAuthTag();

	// store iv + authTag + ciphertext together, base64
	return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

export function decrypt(payload: string): string {
	const data = Buffer.from(payload, "base64");

	const iv = data.subarray(0, IV_LENGTH);
	const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
	const encrypted = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

	const decipher = crypto.createDecipheriv(ALGORITHM, getMasterKey(), iv);
	decipher.setAuthTag(authTag);

	return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
		"utf8",
	);
}
