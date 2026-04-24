// Lightweight form submission handler with inline validation
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    // Basic validation
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if(!name || !email || !message){
      status.textContent = 'Please complete all fields.';
      status.style.color = '#f87171';
      return;
    }
    // Simulated success (no backend)
    status.textContent = 'Thank you, your message has been prepared. I will respond to ' + email + ' shortly.';
    status.style.color = '#34d399';
    form.reset();
  });
});
