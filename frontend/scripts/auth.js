export function getUserRole() {
  return localStorage.getItem("userRole");
}

export function setUserRole(role) {
  localStorage.setItem("userRole", role);
}
