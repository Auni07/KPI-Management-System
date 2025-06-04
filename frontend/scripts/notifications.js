import { getUserRole } from "../scripts/auth.js";

    const role = getUserRole();
    if (role === "staff") {
      document.getElementById("staff-notifications").style.display = "block";
    } else if (role === "manager") {
      document.getElementById("manager-notifications").style.display = "block";
    }
    // common-section is for both staff and manager