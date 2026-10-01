# Narrow header and shortcut search

Updated brief: align the header with the existing 700px portfolio column. Remove initials and More; show only Home, Projects, Analytics, search and theme controls on desktop and mobile. Preserve all page destinations in the Command/Ctrl+K search.

Reference observed at https://www.vikrantkadam.me/: the header contracts from 768px to 640px on scroll, sits 12px below the top edge, gains a 40px border radius, backdrop blur and subtle shadow. Adapt to this portfolio by starting at 700px and contracting to 640px after 50px of scroll. Use a 300ms transition, disabled for reduced motion. On mobile keep all five controls and 12px exterior space in the floating state.

Plan: verify the simplified navigation and scrolled state with a failing test, remove initials/menu logic, implement the narrow layout and scroll listener, and verify top/scrolled layouts at desktop and 320px. Run search and portfolio tests plus production build.
