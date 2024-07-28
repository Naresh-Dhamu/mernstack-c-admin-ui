import { CreacteUserData, Credentials, TenantTypes } from "../types";
import { api } from "./client";


export const AUTH_SERVICE = '/api/auth';
const CATALOG_SERVICE = '/api/catalog'; 
export const login = (credentials: Credentials) =>
  api.post(`${AUTH_SERVICE}/auth/login`, credentials);
export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);
export const getUsers = (queryString?: string) =>
  api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const creacteUser = (user: CreacteUserData) => api.post(`${AUTH_SERVICE}users`, user);
export const updateUser = (user: CreacteUserData, id: string) =>
  api.patch(`${AUTH_SERVICE}/users/${id}`, user);
export const getTenants = (queryString?: string) =>
  api.get(`${AUTH_SERVICE}/tenants?${queryString}`);
export const creacteTenants = (tenant: TenantTypes) =>
  api.post(`${AUTH_SERVICE}/tenants`, tenant);
export const updateTenants = (tenant: TenantTypes, id: string) =>
  api.patch(`${AUTH_SERVICE}/tenants/${id}`, tenant);

//Catelog service
export const getCategories = () =>api.get(`${CATALOG_SERVICE}/categories`)