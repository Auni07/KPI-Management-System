


console.log("Logging out...");
localStorage.removeItem("authToken");
localStorage.removeItem("userRole");


setTimeout(() => {
  window.location.href = "/pages/user-login.html";
}, 1000);
