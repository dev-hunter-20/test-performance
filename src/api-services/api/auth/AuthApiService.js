import AuthorizedInstance from '@/api-services/authorized';
import CommonCall from '@/api-services/network/CommonCall';
import env from '@/app/env';
import { DOMAIN, URL_API, URL_SUB_API } from '@/constants/ApiUrl';

const AppService = AuthorizedInstance(env.api.baseUrl.app);

export default class AuthApiService {
  static async changePassword({ token, params, body }) {
    const response = await AppService.post(`/create_new_password`, body, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  static async googleLogin({ params }) {
    const response = await AppService.get(`/google_login`, { params });
    return response.data;
  }
  static async loginApp({ params, body }) {
    const response = await AppService.post(`/login`, body, { params });
    return response.data;
  }
  static async registerApp({ params, body }) {
    const response = await AppService.post(`/register`, body, { params });
    return response.data;
  }
  static async resetPassword({ params, body }) {
    const response = await AppService.post(`/reset_password`, body, { params });
    return response.data;
  }
  static async registryTrialSubscriptions(data) {
    const header = {
      method: 'POST',
      body: JSON.stringify(data),
    };
    const response = await CommonCall(`${URL_SUB_API}/registry`, header);
    return response;
  }
  static async loginGoogle(state, code) {
    const response = await CommonCall(
      `${URL_API}google_login_callback?redirect_url=${DOMAIN}google_login_callback&state=${state}&code=${code}`,
    );
    return response;
  }
}
