# GitHub and LeetCode calendar update

Match the supplied screenshots: seven rows grouped in Sunday-start weeks, month labels above, dashed outer card from image 1, five green intensity levels and visible numbers on active blocks from image 2. Zero days remain empty dark blocks. Maintain readable fixed-size blocks and horizontal scrolling on small screens. Use actual public GitHub contribution counts and live LeetCode submission counts, with no fabricated activity.

Implementation: shared calendar date-grid utility and Heatmap component; GitHub public-calendar parser and server endpoint; reuse live LeetCode endpoint. Add GitHub Activity before LeetCode. Keep text history for accessibility. Tests first cover week alignment, exact counts, month placement, GitHub parsing and visible numeric blocks. Verify build and mobile layout.
