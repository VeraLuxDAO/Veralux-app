// lib/design-system.ts
// Centralized design system based on the Social page aesthetic

export const DesignSystem = {
  colors: {
    // Backgrounds
    background: "rgba(8, 14, 17, 0.4)", // Glassmorphic container background
    backgroundDarker: "rgba(8, 14, 17, 0.6)", // Notification panel, deeper containers
    backgroundLighter: "rgba(8, 14, 17, 0.2)", // Subtle backgrounds

    // Borders
    border: "rgba(255, 255, 255, 0.08)", // Subtle white border
    borderStrong: "rgba(255, 255, 255, 0.12)", // Stronger borders for emphasis
    divider: "rgba(255, 255, 255, 0.1)", // Divider line color
    verticalDivider: "rgba(255, 255, 255, 0.2)", // Vertical divider color

    // Text
    textPrimary: "white",
    textSecondary: "#9BB6CC", // Muted blue-gray
    textTertiary: "#6B7C8C", // Even more muted

    // Active/Selected States
    activeBackground: "rgba(229, 247, 253, 0.2)", // Active tab/element background
    activeBackgroundSubtle: "rgba(229, 247, 253, 0.06)", // Subtle active state
    hoverBackground: "rgba(255, 255, 255, 0.05)", // Hover background

    // Special Backgrounds
    categoryContainerBackground: "rgba(229, 247, 253, 0.04)", // Category tabs container background
    timeBadgeBackground: "rgba(155, 182, 204, 0.1)", // Time badge background
    cardGradient:
      "linear-gradient(0deg, rgba(229, 247, 253, 0.04) 0%, rgba(229, 247, 253, 0) 100%)",
  },

  borderRadius: {
    xs: "8px",
    sm: "10px",
    md: "12px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "22px",
    "3xl": "24px",

    // Specific use cases
    container: "18px",
    large: "24px",
    medium: "16px",
    tabsContainer: "22px",
    tabButton: "18px",
    button: "10px",
    signInButton: "20px",
  },

  spacing: {
    // Standard gaps
    gap8: "8px",
    gap12: "12px",
    gap16: "16px",
    gap20: "20px",
    gap24: "24px",
    gap26: "26px",
    gap32: "32px",

    // Padding
    padding4: "4px",
    padding8: "8px",
    padding12: "12px",
    padding16: "16px",
    padding20: "20px",
    padding24: "24px",
    padding32: "32px",

    // Specific use cases
    standardGap: "24px",
    topBarGap: "5.5rem",
    rightEdge: "1.5rem",
    sidebarEdge: "14px",
  },

  filters: {
    backdropBlur: "blur(20px)",
    backdropBlurLight: "blur(10px)",
    backdropBlurHeavy: "blur(30px)",
  },

  shadows: {
    signInButton: "0px 4px 12px rgba(255, 255, 255, 0.25)",
    card: "0px 4px 24px rgba(0, 0, 0, 0.1)",
    cardHover: "0px 8px 32px rgba(0, 0, 0, 0.15)",
    glow: "0px 0px 24px rgba(229, 247, 253, 0.3)",
  },

  typography: {
    fontSans:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontMono: "'Courier New', Courier, monospace",

    sizes: {
      xs: "0.625rem", // 10px
      sm: "0.75rem", // 12px
      base: "0.875rem", // 14px
      md: "0.9375rem", // 15px
      lg: "1rem", // 16px
      xl: "1.125rem", // 18px
      "2xl": "1.25rem", // 20px
      "3xl": "1.5rem", // 24px
    },
  },

  transitions: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
    slower: "400ms",
  },
};

// Helper functions for common patterns
export const glassmorphicStyle = (opacity: number = 0.4) => ({
  background: `rgba(8, 14, 17, ${opacity})`,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
});

export const cardStyle = () => ({
  background: DesignSystem.colors.cardGradient,
  borderRadius: DesignSystem.borderRadius.base,
});

export const buttonStyle = (
  variant: "primary" | "secondary" | "ghost" = "primary"
) => {
  const variants = {
    primary: {
      background: "white",
      color: "black",
      boxShadow: DesignSystem.shadows.signInButton,
    },
    secondary: {
      background: DesignSystem.colors.activeBackgroundSubtle,
      color: DesignSystem.colors.textPrimary,
    },
    ghost: {
      background: "transparent",
      color: DesignSystem.colors.textSecondary,
    },
  };

  return {
    ...variants[variant],
    borderRadius: DesignSystem.borderRadius.button,
    transition: `all ${DesignSystem.transitions.base}`,
  };
};
