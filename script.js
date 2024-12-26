const typewriterElement = document.querySelector('.typewriter');
        const texts = ["Software Engineer", "Full-Stack Developer", "Graduate-Student"];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentText = texts[textIndex];
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            typewriterElement.textContent = currentText.slice(0, charIndex);

            if (!isDeleting && charIndex === currentText.length) {
                setTimeout(() => isDeleting = true, 1500);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }

            const typingSpeed = isDeleting ? 100 : 200;
            setTimeout(type, typingSpeed);
        }

        type();