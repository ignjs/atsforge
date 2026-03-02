module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'Arial', 'sans-serif'],
    },
    colors: {
      white: '#FFFFFF',
      black: '#000000',
      gray: {
        900: '#333333',
        700: '#666666',
        100: '#F5F5F5',
      },
    },
    extend: {},
  },
  plugins: [],
};
