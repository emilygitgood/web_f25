    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });
    const filterCheckbox = document.getElementById('filter-events');
    const resources = document.getElementById('resource-list');
    const events = document.getElementById('event-list');

    filterCheckbox.addEventListener('change', () => {
      if (filterCheckbox.checked) {
        resources.style.display = 'none';
      } else {
        resources.style.display = 'block';
      }
    });
    document.querySelectorAll('#event-list li').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('highlight');
      });
    });