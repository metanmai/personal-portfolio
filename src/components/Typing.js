import { gsap } from "gsap";

document.addEventListener("DOMContentLoaded", function () {
    const timeline = gsap.timeline();
    const container = document.querySelector(".typewriter");
    const text = "Thanmay";
    const letters = text.split("");

    letters.forEach((letter, index) => {
    const span = document.createElement("span");
    span.textContent = letter;
    container.appendChild(span);
    gsap.set(span, { opacity: 0 });
    timeline.to(span, {
        opacity: 1,
        duration: 0.3,
        delay: index * 0.1,
    });
    });

    timeline.play();
});
