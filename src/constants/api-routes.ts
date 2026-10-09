import { ENV } from "./env";

const BASE_API = ENV.API_URL;
const API = "/api";
const version = "/v1";

const BASE_URL = `${BASE_API}${API}${version}`;

export const ApiRoutes = {
    AUTH: `${BASE_URL}/auth`,
    REFRESH_TOKEN: `${BASE_URL}/auth/refresh-token`,
    ME: `${BASE_URL}/users/me`
};