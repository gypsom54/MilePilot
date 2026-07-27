/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ra: {
          primary: "var(--ra-primary)",
          ink: "var(--ra-ink)",
          "primary-fg": "var(--ra-primary-fg)",
          "primary-hover": "var(--ra-primary-hover)",
          "ink-soft": "var(--ra-ink-soft)",
          muted: "var(--ra-muted)",
          placeholder: "var(--ra-placeholder)",
          canvas: "var(--ra-canvas)",
          surface: "var(--ra-surface)",
          "surface-subtle": "var(--ra-surface-subtle)",
          border: "var(--ra-border)",
          "border-strong": "var(--ra-border-strong)",
          "border-accent": "var(--ra-border-accent)",
          accent: "var(--ra-accent)",
          "accent-soft": "var(--ra-accent-soft)",
          focus: "var(--ra-focus)",
          success: "var(--ra-success)",
          "success-soft": "var(--ra-success-soft)",
          "success-border": "var(--ra-success-border)",
          warning: "var(--ra-warning)",
          "warning-soft": "var(--ra-warning-soft)",
          "warning-border": "var(--ra-warning-border)",
          info: "var(--ra-info)",
          "info-soft": "var(--ra-info-soft)",
          "info-border": "var(--ra-info-border)",
          neutral: "var(--ra-neutral)",
          "neutral-soft": "var(--ra-neutral-soft)",
          "disabled-bg": "var(--ra-disabled-bg)",
          "disabled-fg": "var(--ra-disabled-fg)",
        },
      },
      borderRadius: {
        "ra-sm": "var(--ra-radius-sm)",
        "ra-md": "var(--ra-radius-md)",
        "ra-lg": "var(--ra-radius-lg)",
        "ra-xl": "var(--ra-radius-xl)",
      },
      boxShadow: {
        ra: "var(--ra-shadow)",
        "ra-focus": "var(--ra-shadow-focus)",
      },
      height: {
        "ra-control": "var(--ra-control-h)",
      },
      minHeight: {
        "ra-control": "var(--ra-control-h)",
      },
      minWidth: {
        "ra-ask": "5.5rem",
      },
    },
  },
  plugins: [],
};
