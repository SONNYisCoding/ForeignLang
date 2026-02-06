/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: { 500: '#667eea', 600: '#5a67d8', 700: '#4c51bf', 800: '#434190' },
                accent: { 500: '#764ba2' }
            }
        },
    },
    plugins: [],
}
