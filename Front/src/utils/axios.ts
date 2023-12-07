import axios, { AxiosInstance } from "axios";

const createAxiosInstance = (baseUrl:string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
  });


  instance.interceptors.request.use(async (config) => {
    try {
      const userToken = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : {};
      const accessToken = userToken?.token;
      config.headers.Authorization = `Bearer ${accessToken}`;
    } catch (error) {
      console.error("Failed to retrieve access token:", error);
    }

    return config;
  });


  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};


const createAxiosInstancewithoutToken = (baseUrl:string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export { createAxiosInstance, createAxiosInstancewithoutToken };
