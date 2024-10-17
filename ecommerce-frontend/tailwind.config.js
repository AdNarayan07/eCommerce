/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Specify files to scan for class names
  theme: {
    extend: {
      margin: {
        "1/4": "25%", // Add a custom margin value of 25%
      },
    },
  },
  plugins: [], // No plugins are being used
  safelist: [
    // Safelist for specific utility classes to ensure they are included in the final build
    'bg-red-50', 'bg-red-600', 'text-red-950', 'border-red-950',
    'bg-green-50', 'bg-green-600', 'text-green-950', 'border-green-950',
    'bg-yellow-50', 'bg-yellow-600', 'text-yellow-950', 'border-yellow-950',
    'bg-gray-50', 'bg-gray-600', 'text-gray-950', 'border-gray-950',
    'bg-blue-50', 'bg-blue-600', 'text-blue-950', 'border-blue-950',
  ],
};
