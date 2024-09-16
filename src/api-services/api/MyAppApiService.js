import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class MyAppApiService {
  static async getMyApps() {
    const response = await CommonCall(`${URL_API}list_my_app`);
    return response.apps;
  }
}
