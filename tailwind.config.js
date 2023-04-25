// /** @type {import('tailwindcss').Config} */
// module.exports = {
// 	content: [
// 		"./app/**/*.{js,ts,jsx,tsx}",
// 		"./pages/**/*.{js,ts,jsx,tsx}",
// 		"./components/**/*.{js,ts,jsx,tsx}",

// 		// Or if using `src` directory:
// 		"./src/**/*.{js,ts,jsx,tsx}",
// 	],
// 	theme: {
// 		extend: {},
// 	},
// 	plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: ["corporate", "business"],
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  darkMode: "class",
};
