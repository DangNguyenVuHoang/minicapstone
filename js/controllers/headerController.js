// js/components/headerController.js
import { authService } from "../services/authService.js";
console.error("WRONG Path: js");
const user = authService.getCurrentUser();
const authLinks = document.getElementById("authLinks");
const adminLinkContainer = document.getElementById("adminLinkContainer");

if (authLinks && adminLinkContainer) {
  if (user) {
    if (user.role === "admin") {
      adminLinkContainer.innerHTML = `<a href="admin.html" class="text-white me-3">Admin Page</a>`;
    }

    authLinks.innerHTML = `
      👤 ${user.name || user.email}
      <a href="#" class="text-white ms-2" id="logoutLink">Logout</a>
    `;
  } else {
    authLinks.innerHTML = `
      <a href="login.html" class="text-white ms-2">Login</a> |
      <a href="#" class="text-white ms-2">Register</a>
    `;
  }

  // Xử lý logout
  document.addEventListener("click", (e) => {
    if (e.target.id === "logoutLink") {
      e.preventDefault();
      authService.logout();
      location.href = "index.html";
    }
  });
}
