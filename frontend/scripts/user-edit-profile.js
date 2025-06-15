// scripts/user-edit-profile.js
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("No login found.");
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
  
      if (!response.ok) throw new Error("Failed to load profile.");
  
      const data = await response.json();
      document.getElementById("name").value = data.name;
      document.getElementById("email").value = data.email;
    } catch (error) {
      console.error("Load error:", error);
      alert("Error loading profile");
    }
  
    // Handle form submission
    const form = document.getElementById("editProfileForm");
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
  
      try {
        const updateRes = await fetch("http://localhost:3000/api/profile", {

          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ name, email })
        });
  
        if (!updateRes.ok) throw new Error("Update failed.");
  
        alert("Profile updated successfully.");
        window.location.href = "/pages/user-profile.html";
      } catch (error) {
        console.error("Update error:", error);
        alert("Error: " + error.message);
      }
    });
  });
  