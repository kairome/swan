import axios, { Method } from 'axios';

const api = async <T>(requestType: Method, url: string, payload?: any, headers?: object) => {
  try {
    const request = axios.create({
      headers: headers !== undefined ? headers : {},
    });

    if (requestType === 'GET') {
      return await request.get<T>(url, { params: payload });
    }

    return await request.request<T>({
      url,
      method: requestType,
      data: payload,
    });
  } catch (error) {
    throw error;
  }
};

export default api;
