# Reference click feedback

Reference inspection found /audio/click.mp3 played at volume 0.3, with 12 white sparks, 12px initial length, 24px travel, 500ms duration and ease-out motion. Add matching feedback across the portfolio using a small global component. Pointer clicks use viewport coordinates; keyboard-activated controls use their center. Playback failure must not affect navigation. Render a pointer-transparent overlay with short-lived bursts and clean event listeners/timers on unmount. Respect reduced-motion by suppressing sparks. Existing image hover zoom remains removed.

Verify sound invocation, burst lifecycle, keyboard positioning, reduced motion, and existing tests/build. Download the reference's public sound asset; keep interaction settings centralized.
