document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  try {
    console.log("Sending login request...", { email, password, role });

    const response = await axios.post("http://localhost:3000/api/login", {
      email,
      password,
      role,
    });

    console.log("Login response:", response);

    if (response && response.data && response.data.token && response.data.role) {
      console.log("Token received:", response.data.token);
      console.log("Role received from backend:", response.data.role);

    
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userRole", response.data.role.toLowerCase());

      
      let attempts = 0;
      const checkStorage = setInterval(() => {
        const storedRole = localStorage.getItem("userRole");
        console.log("Checking stored role:", storedRole);

        if (storedRole) {
          clearInterval(checkStorage);
          console.log("Stored role in localStorage:", storedRole);
          window.location.href = "http://localhost:3000/dashboard";
        }

        if (++attempts > 10) {
          clearInterval(checkStorage);
          alert("Login error: failed to save role to localStorage.");
        }
      }, 50);
    } else {
      alert("No token or role received. Login failed.");
    }
  } catch (error) {
    console.error("Login failed:", error.response ? error.response.data.message : error.message);
    alert("Invalid email or password");
  }
});
