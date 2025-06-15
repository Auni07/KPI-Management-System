// scripts/user-change-password.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("changePasswordForm");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Not logged in.");
        window.location.href = "/pages/login.html";
        return;
      }
  
      const currentPassword = document.getElementById("currentPassword").value.trim();
      const newPassword = document.getElementById("newPassword").value.trim();
      const confirmNewPassword = document.getElementById("confirmNewPassword").value.trim();
  
      if (newPassword !== confirmNewPassword) {
        alert("New passwords do not match!");
        return;
      }
  
      try {
        const res = await fetch("http://localhost:3000/api/change-password", {

          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ currentPassword, newPassword })
        });

        if (!res.ok) {
            const contentType = res.headers.get("content-type") || "";
            let msg;
          
            if (contentType.includes("application/json")) {
              const errorData = await res.json();
              msg = errorData.message || "Unknown server error.";
            } else {
              msg = await res.text(); 
            }
          
            throw new Error(msg);
          }
          
  
        alert("Password changed successfully!");
        window.location.href = "/pages/user-profile.html";
      } catch (err) {
        alert("Error: " + err.message);
      }
    });
  });
  