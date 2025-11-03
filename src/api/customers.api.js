import api from './apiClient';

const BASE = '/agent/customers';

export const listCustomers = async (page = 1, limit = 50, search = '') => {
  const res = await api.get(BASE, { params: { page, limit, search } });
  return res.data;
};

export const getCustomerById = async (id) => {
  const res = await api.get(`${BASE}/${id}`);
  return res.data;
};

export const createCustomer = async (payload) => {
  const res = await api.post(BASE, payload);
  return res.data;
};

export const updateCustomer = async (id, payload) => {
  const res = await api.put(`${BASE}/${id}`, payload);
  return res.data;
};

export const deleteCustomer = async (id) => {
  const res = await api.delete(`${BASE}/${id}`);
  return res.data;
};
