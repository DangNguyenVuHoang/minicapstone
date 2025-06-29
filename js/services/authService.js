import { userApi } from "./api.js";

export const authService = {
  async login(email, password) {
    const user = await userApi.login(email, password);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    } else {
      throw new Error("Tài khoản hoặc mật khẩu không đúng");
    }
  },

  logout() {
    localStorage.removeItem("currentUser");
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === "admin";
  }
};
