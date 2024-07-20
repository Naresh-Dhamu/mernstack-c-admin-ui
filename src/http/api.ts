import { CreacteUserData, Credentials, TenantTypes } from "../types";
import { api } from "./client";

export const login = (credentials: Credentials) =>
  api.post("/auth/login", credentials);
export const self = () => api.get("/auth/self");
export const logout = () => api.post("/auth/logout");
export const getUsers = (queryString?: string) =>
  api.get(`/users?${queryString}`);
export const creacteUser = (user: CreacteUserData) => api.post("/users", user);
export const getTenants = () => api.get("/tenants");
export const creacteTenants = (tenant: TenantTypes) =>
  api.post("/tenants", tenant);
