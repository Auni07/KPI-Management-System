
export function getUserRole() {
  return localStorage.getItem("userRole");
}
// 设置用户角色
export function setUserRole(role) {
  localStorage.setItem("userRole", role);
}
