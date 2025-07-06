//  Đường dẫn API chung
const BASE_API = 'https://685166518612b47a2c09e711.mockapi.io';

//  Đường dẫn sản phẩm
const PRODUCT_API = `${BASE_API}/products`;

//  Đường dẫn người dùng
const USER_API = `${BASE_API}/users`;

//  API thao tác với sản phẩm
export const api = {
  getAll: async () => {
    const res = await axios.get(PRODUCT_API);
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${PRODUCT_API}/${id}`);
    return res.data;
  },

  create: async (product) => {
    const res = await axios.post(PRODUCT_API, product);
    return res.data;
  },

  update: async (id, updatedProduct) => {
    const res = await axios.put(`${PRODUCT_API}/${id}`, updatedProduct);
    return res.data;
  },

  delete: async (id) => {
    const res = await axios.delete(`${PRODUCT_API}/${id}`);
    return res.data;
  }
};

// API thao tác với người dùng
export const userApi = {
  login: async (email, password) => {
    const res = await axios.get(USER_API, {
      params: { email, password }
    });
    return res.data[0]; // chỉ lấy user đầu tiên khớp
  },

  getAllUsers: async () => {
    const res = await axios.get(USER_API);
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${USER_API}/${id}`);
    return res.data;
  },

  create: async (user) => {
    const res = await axios.post(USER_API, user);
    return res.data;
  }
};
