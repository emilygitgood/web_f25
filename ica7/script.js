// this selects the first instance of nav toggle from the HTML
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

const form = document.getElementById('myForm');

const savedData = JSON.parse(localStorage.getItem('formData') || '{}');
for (let[name, value] of Object.entries(savedData)) {
  if (form.elements[name]){
    form.elements[name].value = value;
  }
}

form.addEventListener('input', function(e) {
  const data = JSON.parse(localStorage.getItem('formData') || '{}');

  data[e.target.name] = e.target.value;

  localStorage.setItem('formData', JSON.stringify(data));
});