const pxtorem = require("postcss-pxtorem");
module.exports = {
  productionSourceMap: false,
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            require("autoprefixer")(),
            pxtorem({
              rootValue: 37.5,
              propList: ["*"],
            }),
          ],
        },
      },
    },
  },
};
