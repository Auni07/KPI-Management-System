
    // Check if the 'progressUpdated' flag is set in localStorage
    if (localStorage.getItem('progressUpdated') === 'true') {
        // Show the modal
        var myModal = new bootstrap.Modal(document.getElementById('progressUpdatedModal'));
        myModal.show();

        // Remove the flag from localStorage after showing the message
        localStorage.removeItem('progressUpdated');
    }
