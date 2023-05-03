const plugin = require('tailwindcss/plugin');

const textShadowPlugin = plugin(function({
  addUtilities,
  matchUtilities,
  theme
}) {
  const sizes = theme('spacing');
  matchUtilities(
    {
      'text-shadow': (value) => {
        return {
          'text-shadow': `-${value} 0 var(--tw-shadow-color), 0 ${value} var(--tw-shadow-color), ${value} 0 var(--tw-shadow-color), 0 -${value} var(--tw-shadow-color)`
        }
      }
    },
    {
      values: sizes,
    }
  )
});

module.exports = {
  textShadowPlugin
};