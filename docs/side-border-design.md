# Portfolio side borders

Reference: https://www.vikrantkadam.me/. The reference uses two full-height 24px rails with thin borders and a 315-degree diagonal repeating pattern in a 10px tile. Rails are hidden below the 768px breakpoint.

Place this same decoration immediately outside the existing centered 700px content column, spanning the entire site including navigation and footer on every route. Use subdued gray #292c2e in dark mode and #d6d9dc in light mode. Keep the current content width and spacing. Implement as noninteractive root pseudo-elements, with no added accessible content or layout footprint. Verify desktop positioning and mobile overflow, then build.
