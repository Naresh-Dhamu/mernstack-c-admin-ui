import {
  CreacteUserData,
  Credentials,
  PromosTypes,
  // PromosTypes,
  TenantTypes,
} from "../types";
import { api } from "./client";

export const AUTH_SERVICE = "/api/auth";
const CATALOG_SERVICE = "/api/catalog";
export const login = (credentials: Credentials) =>
  api.post(`${AUTH_SERVICE}/auth/login`, credentials);
export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);
export const getUsers = (queryString?: string) =>
  api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const creacteUser = (user: CreacteUserData) =>
  api.post(`${AUTH_SERVICE}users`, user);
export const updateUser = (user: CreacteUserData, id: string) =>
  api.patch(`${AUTH_SERVICE}/users/${id}`, user);
export const getTenants = (queryString?: string) =>
  api.get(`${AUTH_SERVICE}/tenants?${queryString}`);
export const creacteTenants = (tenant: TenantTypes) =>
  api.post(`${AUTH_SERVICE}/tenants`, tenant);
export const updateTenants = (tenant: TenantTypes, id: string) =>
  api.patch(`${AUTH_SERVICE}/tenants/${id}`, tenant);

//Catelog service
export const getCategories = (queryString?: string) =>
  api.get(`${CATALOG_SERVICE}/categories?${queryString}`);
export const getProducts = (queryString?: string) =>
  api.get(`${CATALOG_SERVICE}/products?${queryString}`);
export const createProduct = (product: FormData) =>
  api.post(`${CATALOG_SERVICE}/products`, product, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getCategory = (id?: string) =>
  api.get(`${CATALOG_SERVICE}/categories/${id}`);
export const updateProduct = (product: FormData, id: string) => {
  return api.put(`${CATALOG_SERVICE}/products/${id}`, product, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Order-service
// export const creactePromos = (promos: PromosTypes) =>
//   api.post(`${ORDER_SERVICE}/promos`, promos);

const ORDER_SERVICE = "/api/order";
export const getCoupons = (queryString: string) =>
  api.get(`${ORDER_SERVICE}/coupons?${queryString}`);
export const createCoupons = (promos: PromosTypes) =>
  api.post(`${ORDER_SERVICE}/coupons`, promos);
export const updateCoupons = (promos: PromosTypes, _id: string) =>
  api.put(`${ORDER_SERVICE}/coupons/${_id}`, promos);

export const getOrders = (queryString: string) =>
  api.get(`${ORDER_SERVICE}/orders?${queryString}`);

export const getSingle = (orderId: string, queryString: string) =>
  api.get(`${ORDER_SERVICE}/orders/${orderId}?${queryString}`);
