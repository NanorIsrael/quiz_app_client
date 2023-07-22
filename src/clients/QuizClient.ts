const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export interface RequestResponse<T> {
  ok: boolean;
  status: number;
  body: T | null;
}

interface OptionsType<T> {
  method: string;
  headers?: HeaderType;
  query?: string;
  body?: T;
  url: string;
}
interface HTTPTOptions {
  headers?: HeaderType;
}
interface HeaderType {
  Authorization: string;
}

export interface QuizAPIClient {
  get: <R>(
    url: string,
    query?: string,
    options?: HTTPTOptions,
  ) => Promise<RequestResponse<R>>;
  post: <T, R>(
    url: string,
    body: T,
    options?: HTTPTOptions,
  ) => Promise<RequestResponse<R>>;
  put: <T, R>(
    url: string,
    body: T,
    options?: HTTPTOptions,
  ) => Promise<RequestResponse<R>>;
  delete: (
    url: string,
    options?: HTTPTOptions,
  ) => Promise<RequestResponse<null>>;
  login: (username: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export default class Client {
  base_url;
  onError;

  constructor(onError: <T>(res: RequestResponse<T>) => void) {
    this.onError = onError;

    if (!BASE_API_URL) {
      throw new Error('Base url is not provided');
    }
    this.base_url = BASE_API_URL;
  }

  async request<T, R>(options: OptionsType<T>) {
    const response = await this.requestInternal<T, R>(options);

    if (response.status === 401 && options.url !== '/users/tokens') {
      const res = await this.put<LoginResponse, LoginResponse>(
        '/users/tokens',
        {
          accessToken: localStorage.getItem('accessToken') as string,
        },
      );
      if (res.ok) {
        localStorage.setItem('accessToken', res.body?.accessToken as string);
      }
    }
    if (response.status >= 500 && this.onError) {
      this.onError(response);
    }
    return response;
  }

  async requestInternal<T, R>(
    options: OptionsType<T>,
  ): Promise<RequestResponse<R>> {
    let response;
    let query = new URLSearchParams(
      (options.query || {}) as URLSearchParams,
    ).toString();

    if (query !== '') {
      query = '?' + query;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (
        !accessToken &&
        options.url !== '/users/tokens' &&
        options.url !== '/users/token'
      ) {
        throw new Error('Access token not found');
      }

      response = await fetch(this.base_url + options.url + query, {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(accessToken),
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : null,
        credentials: 'include',
      });
    } catch (error) {
      response = {
        ok: false,
        status: 500,
        // eslint-disable-next-line @typescript-eslint/require-await
        json: async () => ({
          code: 500,
          message: 'The server is unresponsive',
          description: error ? String(error) : '',
        }),
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? ((await response.json()) as R) : null,
    };
  }

  async get<T>(
    url: string,
    query?: string,
    options?: HTTPTOptions,
  ): Promise<RequestResponse<T>> {
    return this.request({
      method: 'GET',
      url,
      query,
      ...options,
    });
  }

  async post<T, R>(
    url: string,
    body: T,
    options?: HTTPTOptions,
  ): Promise<RequestResponse<R>> {
    return await this.request({ method: 'POST', url, body, ...options });
  }
  async put<T, R>(
    url: string,
    body: T,
    options?: HTTPTOptions,
  ): Promise<RequestResponse<R>> {
    return this.request({ method: 'PUT', url, body, ...options });
  }
  async delete(
    url: string,
    options?: HTTPTOptions,
  ): Promise<RequestResponse<null>> {
    return this.request({ method: 'DELETE', url, ...options });
  }

  async login(email: string, password: string) {
    const response = await this.post<null, LoginResponse>(
      '/users/token',
      null,
      {
        headers: {
          Authorization: 'Basic ' + btoa(email + ':' + password),
        },
      },
    );

    if (!response.ok) {
      return response.status === 401 ? 'fail' : 'error';
    }
    if (response.body?.accessToken) {
      localStorage.setItem('accessToken', response.body?.accessToken);
    }
    return 'ok';
  }

  async logout() {
    await this.delete('/users/tokens');
    localStorage.removeItem('accessToken');
  }

  isAuthenticated() {
    return localStorage.getItem('accessToken') !== null;
  }
}

interface LoginResponse {
  accessToken: string;
}
