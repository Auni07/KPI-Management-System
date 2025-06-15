
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      alert("No login found. Redirecting...");
      window.location.href = "/pages/login.html";
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!response.ok) throw new Error("Failed to fetch profile");
  
      const data = await response.json();
  
      document.getElementById("profile-name").innerText = data.name;
      document.getElementById("profile-email").innerHTML = `<strong>Email:</strong> ${data.email}`;
  
      let roleHtml = `<p><strong>Role:</strong> ${data.role}</p>`;
      roleHtml += `<p><strong>Department:</strong> ${data.department}</p>`;
  
      if (data.role.toLowerCase() === "staff" && data.departmentManager) {
        roleHtml += `<p><strong>Manager:</strong> ${data.departmentManager.name}</p>`;
      }
  
      if (data.role.toLowerCase() === "manager" && data.departmentStaffList.length > 0) {
        roleHtml += `<p><strong>Staff in Department:</strong></p><ul>`;
        data.departmentStaffList.forEach(staff => {
          roleHtml += `<li>${staff.name}</li>`;
        });
        roleHtml += `</ul>`;
      }
  
      document.getElementById("roleDetails").innerHTML = roleHtml;
  
      if (data.role.toLowerCase() !== "manager") {
        const deleteBtn = document.getElementById("deactivate-btn");
        if (deleteBtn) {
          deleteBtn.style.display = "none";
        }
      }
  
    } catch (error) {
      console.error("Error loading profile:", error);
      alert("Session expired or server error. Please login again.");
      window.location.href = "/pages/login.html";
    }
  });
  