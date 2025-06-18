function getUserRole() {
  return localStorage.getItem("userRole")?.toLowerCase() || null;
}

document.addEventListener("DOMContentLoaded", () => {
  const userRole = getUserRole();

  const sidebarLinks = document.getElementById("sidebarLinks");
  const sidebar = document.getElementById("sidebarMenu");
  const toggleBtn = document.getElementById("sidebarToggle");
  const overlay = document.getElementById("sidebarOverlay");

  const currentPage = window.location.pathname.split("/").pop(); // e.g. 'dashboard.html'
  const isManagerKpiPage = [
    "manager-view-assigned-kpi.html",
    "manager-assign-kpi.html",
    "manager-view-evidence.html",
  ].includes(currentPage);
  const isStaffKpiPage = [
    "staff-view-kpi.html",
    "staff-kpi-detail.html",
  ].includes(currentPage);
  const isProfilePage = [
    "user-profile.html",
    "user-edit-profile.html",
    "user-change-password.html",
    "user-deactivate-account.html",
  ].includes(currentPage);

  if (sidebarLinks) {
    sidebarLinks.innerHTML = `
      <li class="nav-item">
       <a id="dashboard-link" class="nav-link ${currentPage === "dashboard.html" ? "active" : ""}" href="/dashboard">

          <i class="fas fa-home"></i> <span class="menu-text">Dashboard</span>
        </a>
      </li>
      ${userRole === "manager"
        ? `
        <li class="nav-item">
          <a class="nav-link ${isManagerKpiPage ? "active" : ""}" href="/pages/manager-view-assigned-kpi.html">
            <i class="fas fa-book"></i> <span class="menu-text">KPI Management</span>
          </a>
        </li>
      `
        : `
        <li class="nav-item">
          <a class="nav-link ${isStaffKpiPage ? "active" : ""}" href="/pages/staff-view-kpi.html">
            <i class="fas fa-tasks"></i> <span class="menu-text">My KPI</span>
          </a>
        </li>
      `
      }
      <li class="nav-item">
        <a class="nav-link ${currentPage === "notifications.html" ? "active" : ""}" href="/pages/notifications.html">
          <i class="fas fa-comments"></i> <span class="menu-text">Notifications</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link ${isProfilePage ? "active" : ""}" href="/pages/user-profile.html">
          <i class="fas fa-user"></i> <span class="menu-text">Profile</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/pages/user-logout.html">
          <i class="fas fa-sign-out-alt"></i> <span class="menu-text">Logout</span>
        </a>
      </li>
    `;
  }

  if (toggleBtn && sidebar && overlay) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.add("active");
      overlay.classList.add("active");
    });

    overlay.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });

    document.addEventListener("click", (e) => {
      const isClickInside =
        sidebar.contains(e.target) || toggleBtn.contains(e.target);
      if (!isClickInside) {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
      }
    });
  }
  
  const dashboardLink = document.getElementById("dashboard-link");
  if (dashboardLink) {
    dashboardLink.addEventListener("click", function (e) {
      e.preventDefault(); // 阻止默认行为
      window.location.href = "/dashboard"; // 强制刷新页面
    });
  }


});
