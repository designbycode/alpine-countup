import type { Alpine as AlpineType } from 'alpinejs';

type EasingType = 'linear' | 'ease-out' | 'ease-in' | 'ease-in-out';

type CountUpOptions = {
    start?: number;
    end: number;
    duration?: number; // in ms
    tolerance?: number; // in px
    easing?: EasingType;
    decimals?: number; // Number of decimal places to show
    prefix?: string;   // String to prepend (e.g., "$")
    suffix?: string;   // String to append (e.g., "k")
};

export default function CountUp(Alpine: AlpineType) {
    Alpine.directive('countup', (el, { expression }, { evaluate }) => {
        const options = evaluate(expression) as CountUpOptions;

        const start = options.start ?? 0;
        const end = options.end ?? 0;
        const duration = options.duration ?? 2000;
        const tolerance = options.tolerance ?? 0;
        const easingType: EasingType = options.easing ?? 'linear';
        const decimals = options.decimals ?? 0;
        const prefix = options.prefix ?? '';
        const suffix = options.suffix ?? '';

        let observer: IntersectionObserver | null = null;
        let hasAnimated = false;

        // Easing functions (cubic approximations)
        const easingFunctions: Record<EasingType, (t: number) => number> = {
            linear: t => t,
            'ease-out': t => 1 - Math.pow(1 - t, 3),
            'ease-in': t => t * t * t,
            'ease-in-out': t =>
                t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2
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

                // Interpolate value (keep as float for decimal support)
                const value = start + (end - start) * easedProgress;

                // Format with fixed decimals, and apply prefix/suffix
                el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;

                if (rawProgress < 1) {
                    requestAnimationFrame(update);
                } else {
                    // Final value (ensures it lands exactly on `end`)
                    el.textContent = `${prefix}${end.toFixed(decimals)}${suffix}`;
                }
            };

            requestAnimationFrame(update);
        };

        // Observe element visibility
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animate();
                        if (observer) observer.disconnect();
                    }
                });
            },
            {
                rootMargin: `0px 0px -${tolerance}px 0px`,
                threshold: 0,
            }
        );

        observer.observe(el);

        // Cleanup on element removal
        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    });
}
