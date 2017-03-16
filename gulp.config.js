module.exports = function () {
    // Location of build files
    const build = 'build/';

    // Location of client source files
    const client = './src/';
    const clientApp = './src/';
    const temp = './.tmp/';

    const config = {

        // File Paths
        build: build,
        client: client,
        css: client + 'css/',
        index: client + 'index.html',
        images: client + 'images/**/*.*',
        temp: temp,
    };

    return config;
};
