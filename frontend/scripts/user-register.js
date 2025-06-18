const roleSelect = document.getElementById("role");
const managerEmailDiv = document.getElementById("managerEmailDiv");

roleSelect.addEventListener("change", function () {
  if (roleSelect.value === "staff") {
    managerEmailDiv.style.display = "block";
  } else {
    managerEmailDiv.style.display = "none";
  }
});

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();
    const role =
      document.getElementById("role").value === "manager" ? "Manager" : "Staff";
    const phone = document.getElementById("phone").value.trim();
    const department = document.getElementById("department").value;
    const managerEmail = document.getElementById("managerEmail").value.trim();

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !role ||
      !phone ||
      !department
    ) {
      alert("Please fill all fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (role === "Staff" && !managerEmail) {
      alert("Please enter your manager's email!");
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
        managerEmail: role === "Staff" ? managerEmail : undefined
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
