import { ApiService } from '../index';

export default class UserApiService {
  static async getUsers({ params }) {
    const res = await ApiService.get(`/api/users`, { params });
    return res.data;
  }
  static async updateUsers({ body }) {
    const res = await ApiService.put(`/api/users`, body);
    return res.data;
  }
}
