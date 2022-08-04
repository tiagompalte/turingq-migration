// Nosso frontend usa uma biblioteca chamada Axios
// para chamadas HTTP. Esta é uma biblioteca muito comum
// em desenvolvimento frontend ou até backend em
// aplicações Node.js.
import axios, { AxiosRequestConfig } from 'axios';

import keycloakClient from '../auth';

const getHeaders = (): Record<string, string> => ({
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
});
const ApiService = axios.create({
  headers: getHeaders(),
});

const setAuthorizationToken = (
  config: AxiosRequestConfig,
  token?: string | null
): void => {
  if (token) {
    // Se o token existe, o adicionamos aos cabeçalhos
    // (“headers”) da requisição no formato que discutimos
    // anteriormente
    config.headers.Authorization = `Bearer ${token}`;
  }
};

// Esta é uma configuração do Axios. Nós usamos
// “interceptors”. Se você não entender como o axios funciona,
// a nossa lógica é simplesmente verificar se estamos
// autenticados no Keycloak e, caso sim, adicionar o token
// ao cabeçalho de nossa requisição HTTP.
// Isso acontece para todas as requisições feitas com o axios,
// de modo que, se um usuário estiver logado, o axios enviará
// o token para o backend.
ApiService.interceptors.request.use(
  (
    config: AxiosRequestConfig
  ): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
    if (!keycloakClient.authenticated) {
      return config;
    }

    if (keycloakClient?.token) {
      setAuthorizationToken(config, keycloakClient.token);
      return config;
    }

    return new Promise((resolve, reject): void => {
      keycloakClient.onAuthSuccess = () => {
        setAuthorizationToken(config, keycloakClient.token);
        resolve(config);
      };
      keycloakClient.onAuthError = () => {
        reject(config);
      };
    });
  }
);

export default ApiService;
