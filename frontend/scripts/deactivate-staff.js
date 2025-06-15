document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("deactivateEmployeeForm");
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("employeeEmail").value.trim();
      const token = localStorage.getItem("authToken");
  
      if (!token) {
        alert("Login required");
        window.location.href = "/pages/login.html";
        return;
      }
  
      if (!email) return alert("Please enter an email.");
  
      if (!confirm(`Are you sure you want to deactivate ${email}?`)) return;
  
      try {
       // Step 1: get user by email
       const res = await fetch(`http://localhost:3000/api/users/email/${encodeURIComponent(email)}`, {
       headers: { Authorization: `Bearer ${token}` }
       });
  
        if (!res.ok) {
       const err = await res.json();
       throw new Error(err.message || "Staff not found.");
       }
  
        const user = await res.json(); // 
  
         // Step 2: delete by _id
         const deleteRes = await fetch(`http://localhost:3000/api/delete-staff/${user._id}`, {
            method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
         });
  
  
        if (!deleteRes.ok) {
          const err = await deleteRes.json();
          throw new Error(err.message || "Failed to delete staff.");
        }
  
        document.getElementById("deactivateResult").innerHTML =
          `<span class="text-success">Successfully deleted <b>${email}</b>.</span>`;
        form.reset();
      } catch (err) {
        console.error(err);
        document.getElementById("deactivateResult").innerHTML =
          `<span class="text-danger">Error: ${err.message}</span>`;
      }
    });
  });
  