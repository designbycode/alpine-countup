import type { Alpine as AlpineType } from 'alpinejs';

type EasingType = 'linear' | 'ease-out' | 'ease-in' | 'ease-in-out';

type CountUpOptions = {
    start?: number;
    end: number;
    duration?: number; // in ms
    tolerance?: number; // in px
    easing?: EasingType;
};

export default function CountUp(Alpine: AlpineType) {
    Alpine.directive('countup', (el, { expression }, { evaluate }) => {
        const options = evaluate(expression) as CountUpOptions;

        const start = options.start ?? 0;
        const end = options.end ?? 0;
        const duration = options.duration ?? 2000;
        const tolerance = options.tolerance ?? 0;
        const easingType: EasingType = options.easing ?? 'linear';

        let observer: IntersectionObserver | null = null;
        let hasAnimated = false;

        // Easing functions
        const easingFunctions: Record<EasingType, (t: number) => number> = {
            linear: t => t,
            'ease-out': t => 1 - Math.pow(1 - t, 3), // cubic ease-out
            'ease-in': t => t * t * t, // cubic ease-in
            'ease-in-out': t =>
                t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2 // cubic ease-in-out
        };

        const easeFn = easingFunctions[easingType] || easingFunctions.linear;

        const animate = () => {
            if (hasAnimated) return;
            hasAnimated = true;

            const startTime = performance.now();

            const update = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const rawProgress = Math.min(elapsed / duration, 1);
                const easedProgress = easeFn(rawProgress);

                const value = Math.floor(start + (end - start) * easedProgress);
                el.textContent = value.toString();

                if (rawProgress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = end.toString();
                }
            };

            requestAnimationFrame(update);
        };

        observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                    if (observer) observer.disconnect();
                }
            });
        }, {
            rootMargin: `0px 0px -${tolerance}px 0px`,
            threshold: 0
        });

        observer.observe(el);
    });
}
