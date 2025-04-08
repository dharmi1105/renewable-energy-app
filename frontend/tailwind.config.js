/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        
        'primary-dark': '#1a1a1a',      
        'secondary-dark': '#2a2a2a',    
        'tertiary-dark': '#3a3a3a',     
        'accent-teal': '#4fd1c5',       
      },
      fontSize: {
        'xs': '0.75rem',      
        'sm': '0.875rem',     
        'base': '1rem',       
        'lg': '1.125rem',     
        'xl': '1.25rem',      
        '2xl': '1.5rem',      
        '3xl': '1.875rem',    
        '4xl': '2.25rem',     
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
      },
      maxHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'custom-md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}