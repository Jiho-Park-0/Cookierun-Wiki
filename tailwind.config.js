/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cookierun: ["CookieRun Regular", "sans-serif"],
        cookierunbold: ["CookieRun Bold", "sans-serif"],
        cookierunblack: ["CookieRun Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
