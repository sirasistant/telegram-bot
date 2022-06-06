import { Injectable } from '@nestjs/common';
import * as SpotifyWebApi from 'spotify-web-api-node';

const GET_SONGS_LIMIT = 100;
const EXPIRATION_MARGIN = 10 * 60 * 1000;

@Injectable()
export class SpotifyService {
    private spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    private expirationTime = 0;

    async getSpotifyApi() {
        if (this.expirationTime <= new Date().getTime()) {
            // Retrieve an access token.
            const response = await this.spotifyApi.clientCredentialsGrant();

            const duration =
                response.body.expires_in * 1000 - EXPIRATION_MARGIN;

            this.expirationTime = new Date().getTime() + duration;
            console.log(`Will refresh after ${duration}`);

            // Save the access token so that it's used in future calls
            this.spotifyApi.setAccessToken(response.body.access_token);
            return this.spotifyApi;
        } else {
            return this.spotifyApi;
        }
    }

    async getAllSongs(playlist) {
        let offset = 0;
        let songs = [];
        const api = await this.getSpotifyApi();
        do {
            songs = songs.concat(
                (
                    await api.getPlaylistTracks(playlist.id, {
                        offset: `${offset}`,
                    })
                ).body.items,
            );
            offset += GET_SONGS_LIMIT;
        } while (offset < playlist.tracks.total);
        return songs;
    }

    async describePlaylist(playListId) {
        const api = await this.getSpotifyApi();

        const { body: playlistData } = await api.getPlaylist(playListId);
        return playlistData;
    }

    async describeUser(userId) {
        const api = await this.getSpotifyApi();

        const { body: user } = await api.getUser(userId);
        return user;
    }
}
