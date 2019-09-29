module.exports = {
  pluginOptions: {
    electronBuilder: {
      // List native deps here if they don't work
      externals: ['serialport'],
      // If you are using Yarn Workspaces, you may have multiple node_modules folders
      // List them all here so that VCP Electron Builder can find them
      mainProcessFile: 'src/background.js',
      nodeModulesPath: ['../../node_modules', './node_modules'],
    },
  },
};