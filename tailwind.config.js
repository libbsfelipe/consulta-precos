module.exports = {
    purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {},
      backgroundColor: theme => ({
        ...theme('colors'),
        'primary': '#0052a4',
        'secondary': '#80c342',
        'danger': '#e3342f',
       })
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }