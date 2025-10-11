 // Initialize Lucide Icons
        lucide.createIcons();

        // 1. Mobile Menu Toggle
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                document.getElementById('mobile-menu').classList.add('hidden');
            });
        });

        // 2. Simple Contact Form Handling (to prevent actual submission and show success message)
        const form = document.getElementById('contact-form');
        const messageDisplay = document.getElementById('form-message');

        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop standard form submission

            // Simple validation check
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const msg = document.getElementById('message').value;

            if (name && email && msg) {
                // Simulate form submission success
                console.log('Form data sent:', { name, email, msg });

                messageDisplay.textContent = 'Message Sent Successfully! Suman will respond soon.';
                messageDisplay.classList.remove('hidden', 'text-red-400');
                messageDisplay.classList.add('text-green-400');
                
                // Reset form fields
                form.reset();

                // Hide message after 5 seconds
                setTimeout(() => {
                    messageDisplay.classList.add('hidden');
                }, 5000);

            } else {
                messageDisplay.textContent = 'Error: Please fill in all required fields.';
                messageDisplay.classList.remove('hidden', 'text-green-400');
                messageDisplay.classList.add('text-red-400');
            }
        });
