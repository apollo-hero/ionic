// New copy task for font files
module.exports = {
  copyFontAwesome: {
    src: ['{{ROOT}}/node_modules/font-awesome/fonts/**/*'],
    dest: '{{WWW}}/assets/fonts'
  },
  copyimages: {
    src: ['{{ROOT}}/assets/img/**/*'],
    dest: '{{WWW}}/build/assets/img'
  }
};
