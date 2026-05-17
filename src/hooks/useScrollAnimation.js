import { useEffect } from "react";

export const useScrollAnimation = () => {
  useEffect(() => {
    // Create Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("scroll-animate");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(
      "[data-scroll-animate]",
    );
    elementsToAnimate.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elementsToAnimate.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);
};
