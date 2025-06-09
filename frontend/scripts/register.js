document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // 阻止默认的表单提交行为
  
    // 获取表单数据
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const role = document.getElementById("role").value;
    const phone = document.getElementById("phone").value.trim();
    const department = document.getElementById("department").value;
    const managerId = document.getElementById("managerId").value.trim();
  
    // 检查必填字段
    if (!email || !password || !confirmPassword || !role || !phone || !department) {
      alert("Please fill all fields!");
      return;
    }
  
    // 确认密码匹配
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    // 如果角色是 "staff"，则需要输入经理ID
    if (role === "staff" && !managerId) {
      alert("Please enter your Manager ID!");
      return;
    }
  
    // 发送注册请求到后端
    try {
      const response = await axios.post("http://localhost:3000/api/register", {
        email,
        password,
        role,
        phone,
        department,
        managerId: role === "staff" ? managerId : null // 如果是 staff，附带经理ID
      });
  
      // 成功响应后的处理
      console.log("User registered:", response.data);
      alert("Registration successful! Please login.");
      window.location.href = "index.html"; // 注册成功后跳转到登录页面
  
    } catch (error) {
      // 错误处理
      console.error("Registration failed:", error.response ? error.response.data.message : error.message);
      alert("Error: " + (error.response ? error.response.data.message : error.message));
    }
  });
  