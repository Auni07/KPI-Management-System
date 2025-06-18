fetch('/api/notifications', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
  }
})
  .then(res => res.json())
  .then(data => {
    const notifications = data.notifications || [];
    const role = data.role;
    const commonDiv = document.getElementById('common-notifications');
    const staffDiv = document.getElementById('staff-notifications');
    const managerDiv = document.getElementById('manager-notifications');

    if (role === 'Staff') {
      staffDiv.style.display = 'block';
      managerDiv.style.display = 'none';
    } else if (role === 'Manager') {
      staffDiv.style.display = 'none';
      managerDiv.style.display = 'block';
    } else {
      staffDiv.style.display = 'none';
      managerDiv.style.display = 'none';
    }

    commonDiv.innerHTML = '';
    staffDiv.innerHTML = '';
    managerDiv.innerHTML = '';

    const deadlines = notifications.filter(n => n.type === 'deadline');
    if (deadlines.length) {
      commonDiv.innerHTML += `<h2 class="status-title mt-4 mb-4">Upcoming Deadlines</h2>`;
      deadlines.forEach(n => {
        commonDiv.innerHTML += `
          <p class="card-text notification-item">
            <span style="color: teal; font-weight: 600;">
              ${n.kpiTitle || ''}
            </span>
            is due on 
            <strong>
              ${new Date(n.dueDate).toLocaleDateString()}
            </strong>.
          </p>
        `;
      });
    }

    // Staff
    const assigned = notifications.filter(n => n.type === 'assigned');
    const comments = notifications.filter(n => n.type === 'comment');
    if (assigned.length || comments.length) {
      staffDiv.style.display = '';
      if (assigned.length) {
        staffDiv.innerHTML += `<h2 class="status-title mb-4">New KPI Assignments</h2>`;
        assigned.forEach(n => {
          staffDiv.innerHTML += `
            <p class="card-text notification-item">
              You’ve been assigned <span style="color: teal; font-weight: 600;">${n.kpiTitle || ''}</span>.
            </p>
          `;
        });
      }
      if (comments.length) {
        staffDiv.innerHTML += `<h2 class="status-title mb-4">New Comments</h2>`;
        comments.forEach(n => {
          staffDiv.innerHTML += `
            <p class="card-text notification-item">
              You have new comments on <span style="color: teal; font-weight: 600;">${n.kpiTitle || ''}</span>
            </p>
          `;
        });
      }
    }

    // Manager
    const evidences = notifications.filter(n => n.type === 'evidence');
    if (evidences.length) {
      managerDiv.style.display = '';
      managerDiv.innerHTML += `<h2 class="status-title">Evidence Submissions</h2>`;
      evidences.forEach(n => {
        managerDiv.innerHTML += `
          <p class="card-text notification-item">
            <strong>${n.staff || ''}</strong> submitted evidence for
            <span style="color: teal; font-weight: 600;">${n.kpiTitle || ''}</span> on <strong>${new Date(n.dueDate).toLocaleDateString()}</strong>.
          </p>
        `;
      });
    }
  });