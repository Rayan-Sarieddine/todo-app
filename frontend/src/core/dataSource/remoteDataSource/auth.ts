import { sendRequest } from "../../helpers/request";

export type LoginData = {
  email: string;
  password: string;
};
export type registerData = {
  email: string;
  fullName: string;
  userType?: string;
  password: string;
};
export type resetData = {
  newPassword: string;
  token: string | null;
};

export type forgetData = {
  email: string;
};
export type googleData = {
  token: string;
};

type User = {
  fullName: string;
  email: string;
  userType: string;
  id: number;
};
type loginResponse = {
  user: User;
  token: string;
};
type registerResponse = {
  message: string;
};
type resetResponse = {
  message: string;
};
type forgetResponse = {
  message: string;
};

export const authDataSource = {
  login: async (data: LoginData): Promise<loginResponse> => {
    const response = await sendRequest({
      body: data,
      route: "auth/login",
      method: "POST",
    });
    return response;
  },
  register: async (data: registerData): Promise<registerResponse> => {
    const response = await sendRequest({
      body: data,
      route: "auth/register",
      method: "POST",
    });
    return response;
  },
  resetPassword: async (data: resetData): Promise<resetResponse> => {
    const response = await sendRequest({
      body: data,
      route: "auth/reset-password",
      method: "POST",
    });
    return response;
  },
  forgetPassword: async (data: forgetData): Promise<forgetResponse> => {
    const response = await sendRequest({
      body: data,
      route: "auth/forgot-password",
      method: "POST",
    });
    return response;
  },
  googleAuth: async (data: googleData) => {
    const response = await sendRequest({
      body: data,
      route: "auth/google-login",
      method: "POST",
    });
    return response;
  },
};
