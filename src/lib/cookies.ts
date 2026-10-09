import { BAKERY_ACCESS_TOKEN, BAKERY_REFRESH_TOKEN } from '@/config/Cookies';
import Cookies from 'js-cookie';

export const cookies = {
    setAccessToken(token: string, expireAt?: number | string | Date) {
        if (expireAt) {
            const expires = typeof expireAt === 'number'
                ? new Date(Date.now() + expireAt * 1000)
                : new Date(expireAt);
            Cookies.set(BAKERY_ACCESS_TOKEN, token, { expires });
        } else {
            Cookies.set(BAKERY_ACCESS_TOKEN, token);
        }
    },

    getAccessToken() {
        return Cookies.get(BAKERY_ACCESS_TOKEN);
    },

    removeAccessToken() {
        Cookies.remove(BAKERY_ACCESS_TOKEN);
    },

    setRefreshToken(token: string, expireAt?: number | string | Date) {
        if (expireAt) {
            const expires = typeof expireAt === 'number'
                ? new Date(Date.now() + expireAt * 1000)
                : new Date(expireAt);
            Cookies.set(BAKERY_REFRESH_TOKEN, token, { expires });
        } else {
            Cookies.set(BAKERY_REFRESH_TOKEN, token);
        }
    },

    getRefreshToken() {
        return Cookies.get(BAKERY_REFRESH_TOKEN);
    },

    removeRefreshToken() {
        Cookies.remove(BAKERY_REFRESH_TOKEN);
    },

    clearAuth() {
        Cookies.remove(BAKERY_ACCESS_TOKEN);
        Cookies.remove(BAKERY_REFRESH_TOKEN);
    },
};