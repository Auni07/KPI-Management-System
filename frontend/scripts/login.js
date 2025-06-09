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

    console.log("Login response:", response);  // 打印完整的响应对象

    // 确保 response.data 存在并且包含 token
    if (response && response.data && response.data.token) {
      console.log("Token received:", response.data.token);  // 打印收到的 token
      localStorage.setItem("authToken", response.data.token);
      window.location.href = "/dashboard";  // 跳转到 Dashboard 页面
    } else {
      alert("No token received or login failed.");
    }
  } catch (error) {
    console.error("Login failed:", error.response ? error.response.data.message : error.message);
    alert("Invalid email or password");
  }
});
