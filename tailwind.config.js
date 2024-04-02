module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // Enable dark mode using class strategy
  variants: {
    extend: {
      backgroundImage: ["before"], // Enable 'before' variant for backgroundImage
      gradientColorStops: ["before"], // Enable 'before' variant for gradientColorStops
      // Add other utilities as needed
    },
  },
  theme: {
    extend: {
      colors: {
        darkgold: "#B8860B",
        gold: "#DAA520",
      },
      container: {
        sm: "640px", // Set the small container max-width as you need
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  //,
  variants: {
    extend: {},
  },
  plugins: [],
};
