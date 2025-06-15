document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const companyId = document.getElementById("companyId").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const role = document.getElementById("role").value === "manager" ? "Manager" : "Staff";
  const phone = document.getElementById("phone").value.trim();
  const department = document.getElementById("department").value;
  

  if (!name || !companyId || !email || !password || !confirmPassword || !role || !phone || !department) {
    alert("Please fill all fields!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }



  try {
    const response = await axios.post("http://localhost:3000/api/register", {
      name,
      email,
      password,
      role,
      phone,
      department,
      companyId,
    
    });

    console.log("User registered:", response.data);
    alert("Registration successful! Please login.");
    window.location.href = "/pages/user-login.html";
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    console.error("Registration failed:", message);
    alert("Error: " + message);
  }
});
