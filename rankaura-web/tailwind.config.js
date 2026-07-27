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
          ink: "var(--ra-ink)",
          "ink-soft": "var(--ra-ink-soft)",
          muted: "var(--ra-muted)",
          canvas: "var(--ra-canvas)",
          surface: "var(--ra-surface)",
          border: "var(--ra-border)",
          "border-strong": "var(--ra-border-strong)",
          accent: "var(--ra-accent)",
          "accent-soft": "var(--ra-accent-soft)",
          focus: "var(--ra-focus)",
          success: "var(--ra-success)",
          "success-soft": "var(--ra-success-soft)",
          warning: "var(--ra-warning)",
          "warning-soft": "var(--ra-warning-soft)",
          info: "var(--ra-info)",
          "info-soft": "var(--ra-info-soft)",
          neutral: "var(--ra-neutral)",
          "neutral-soft": "var(--ra-neutral-soft)",
        },
      },
      borderRadius: {
        "ra-sm": "var(--ra-radius-sm)",
        "ra-md": "var(--ra-radius-md)",
        "ra-lg": "var(--ra-radius-lg)",
      },
      boxShadow: {
        ra: "var(--ra-shadow)",
      },
      height: {
        "ra-control": "var(--ra-control-h)",
      },
      minHeight: {
        "ra-control": "var(--ra-control-h)",
      },
    },
  },
  plugins: [],
};
