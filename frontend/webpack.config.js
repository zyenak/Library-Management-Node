module.exports = {
    entry: './src/index.tsx',
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },

   
    // other configuration options...
  };
  