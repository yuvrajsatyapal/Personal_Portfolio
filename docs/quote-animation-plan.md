# Footer quote animation

Implement the approved Quiet highlight prototype for the quote stored in portfolio.ts. Keep the entire quote visible; highlight and underline each word in sequence with a subtle white glow. Preserve existing footer dimensions and responsive font sizes. Build spans from the configured quote rather than duplicating its text.

Use CSS animation with a two-second offset per word. Expose one uninterrupted quote to screen readers and hide the decorative word spans from accessibility APIs. Disable animation and underlines for reduced motion. Validate the accessible text first with a failing test, then implement the footer markup and CSS, run the test and production build, and review the local preview.
