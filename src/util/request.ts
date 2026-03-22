import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from "./token";

const baseURL = "/api/v1";

const request = axios.create({
  baseURL,
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.userToken = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 通用请求方法
 * @param url - 请求地址
 * @param options - 请求配置
 */
export const http = async <T = any>(
  url: string,
  options: AxiosRequestConfig & { needToken?: boolean } = {}
): Promise<T> => {
  const { needToken = true, ...config } = options;

    config.headers = {
        ...(config.headers || {}),
        cheat: 'jyrs123456'
    }
  if (!needToken) {
    delete config.headers?.userToken;
  }

  const response = await request<T>({
    url,
    ...config,
  });

  return response.data;
};

/**
 * GET 请求
 */
export const get = <T = any>(
  url: string,
  options?: AxiosRequestConfig & { needToken?: boolean }
) => http<T>(url, { method: "get", ...options });

/**
 * POST 请求
 */
export const post = <T = any>(
  url: string,
  data?: any,
  options?: AxiosRequestConfig & { needToken?: boolean }
) => http<T>(url, { method: "post", data, ...options });

export default request;