
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

const getAccessToken = async () => {
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
        return accessToken;
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.warn("Spotify Client ID or Secret missing in .env");
        return null; // Graceful fail if not configured
    }

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        if (data.access_token) {
            accessToken = data.access_token;
            tokenExpiry = Date.now() + (data.expires_in * 1000);
            return accessToken;
        }
    } catch (error) {
        console.error("Failed to get Spotify token", error);
    }
    return null;
};

export const searchTracks = async (query: string) => {
    const token = await getAccessToken();
    if (!token) return [];

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        return data.tracks?.items || [];
    } catch (error) {
        console.error("Spotify search failed", error);
        return [];
    }
};

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
    preview_url: string | null;
    external_urls: { spotify: string };
}
