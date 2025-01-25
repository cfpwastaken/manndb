// OIDC Server needs to have redirect url for /login/callback
import { env } from "$env/dynamic/public";
export const CLIENT_ID = env.PUBLIC_CLIENT_ID;
const AUTH_URL = env.PUBLIC_AUTH_URL;
export const TOKEN_URL = env.PUBLIC_TOKEN_URL;

export async function getAuthURL() {
	const pkce = await generatePKCEChallenge();
	const state = generateRandomString(16);
	return {
		url: `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${window.location.origin}/login/callback&scope=openid%20profile&code_challenge=${pkce.codeChallenge}&code_challenge_method=S256&state=${state}`,
		codeVerifier: pkce.codeVerifier,
		state
	};
}

// Function to generate PKCE code challenge
// With the S256 method
async function generatePKCEChallenge() {
	const codeVerifier = generateRandomString(128);
	const codeChallengeBuf = await sha256(codeVerifier);
	const codeChallenge = base64URLEncode(new Uint8Array(codeChallengeBuf));
	return { codeVerifier, codeChallenge };
}

// Generates a cryptographically secure random string
/**
 * @param {number} length
 */
function generateRandomString(length) {
	const array = new Uint32Array(length / 2);
	window.crypto.getRandomValues(array);
	return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

// Encodes a string to base64url (no padding)
/**
 * @param {Uint8Array} buffer
 */
function base64URLEncode(buffer) {
	return btoa(String.fromCharCode(...buffer))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');
}

/**
 * @param {string | undefined} input
 */
async function sha256(input) {
	const encoder = new TextEncoder();
	const data = encoder.encode(input);
	return await window.crypto.subtle.digest("SHA-256", data);
}
