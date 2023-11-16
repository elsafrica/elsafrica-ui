import axios, { Axios } from "axios";

const axiosConfig = {
	baseURL: process.env.BASE_URL,
	timeout: 10000,
	timeoutErrorMessage: 'Sorry! Unable to perform operation. Please try again.',
};

class AxiosInstance {
  instance: Axios;

  constructor() {
    this.instance = axios.create(axiosConfig);
  }

  initInstance(token: string) {
		this.instance = axios.create(axiosConfig);

		this.instance.interceptors.request.use(async (config) => {

			if (token) {
				config.headers['Authorization'] = `Bearer ${token}`;
			}

			return config;
		});
		return this.instance;
	}
}

const instance = new AxiosInstance()
export default instance;