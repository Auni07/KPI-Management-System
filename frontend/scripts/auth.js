
export function getUserRole() {
  return localStorage.getItem("userRole");
}
// Set user role in localStorage
export function setUserRole(role) {
  localStorage.setItem("userRole", role);
}
