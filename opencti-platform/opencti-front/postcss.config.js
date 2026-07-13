import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const stripBodylessLayers = {
  postcssPlugin: 'strip-bodyless-layers',
  Once(root) {
    root.walkAtRules('layer', (rule) => {
      if (!rule.nodes) {
        rule.remove();
      }
    });
  },
};

export default {
  plugins: [
    stripBodylessLayers,
    tailwindcss,
    autoprefixer,
  ],
};
