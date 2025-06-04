import { getUserRole } from './auth.js';

document.addEventListener("DOMContentLoaded", () => {
  const role = getUserRole();
  const extraInfo = document.getElementById("roleDetails");
  const deactivateBtn = document.getElementById("deactivate-btn");

  if (!role) {
    extraInfo.innerHTML = "<p><strong>Role:</strong> Unknown</p>";
    return;
  }

  if (role === "manager") {
    extraInfo.innerHTML = `
      <p><strong>Role:</strong> Manager</p>
      <p><strong>Manager ID:</strong> MGR-2024</p>
      <p><strong>Staff List:</strong> Alice, Bob, Charlie</p>
    `;
    deactivateBtn.style.display = "inline-block";
  } else if (role === "staff") {
    extraInfo.innerHTML = `
      <p><strong>Role:</strong> Staff</p>
      <p><strong>Manager:</strong> Wonbin Park</p>
      <p><strong>Department:</strong> Marketing</p>
    `;
    deactivateBtn.style.display = "none";
  }
});
