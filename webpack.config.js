//requires
const path = require('path');

module.exports = {
    entry: {
        homepage: './client/homepageClient.js',
        editor: './client/editorClient.js',
        notFound: './client/notFoundClient.js',
    },
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
    watchOptions: {
        aggregateTimeout: 200,
    }
}