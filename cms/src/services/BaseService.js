import axios from 'axios';
import appConfig from 'configs/app.config';
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from 'constants/api.constant';
import { PERSIST_STORE_NAME } from 'constants/app.constant';
import deepParseJson from 'utils/deepParseJson';
import store from '../store';
import { onSignOutSuccess, setToken } from '../store/auth/sessionSlice';

const unauthorizedCode = [401];
const authorizedCode = [200];

const BaseService = axios.create({
  timeout: 60000,
  baseURL: appConfig.apiPrefix,
});

BaseService.interceptors.request.use(
  (config) => {
    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME);
    const persistData = deepParseJson(rawPersistData);
    const accessToken = persistData?.auth?.session?.access_token;

    if (accessToken) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

BaseService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;
    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME);
    const persistData = deepParseJson(rawPersistData);
    const { refresh_token, remember_me } = persistData?.auth?.session || {};

    if (unauthorizedCode.includes(response.status)) {
      try {
        const resp = await axios.post(`${appConfig.apiPrefix}tokens/refresh`, { refresh_token });
        const { data } = resp?.data || {};
        if (authorizedCode.includes(resp?.status) && remember_me === true) {
          store.dispatch(
            setToken({
              access_token: data.access_token,
            }),
          );
        } else {
          store.dispatch(onSignOutSuccess());
        }
      } catch (refreshError) {
        store.dispatch(onSignOutSuccess());
        console.error('Error refreshing token:', refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default BaseService;
