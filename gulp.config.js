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
        css: client + 'styles/',
        index: 'index.html',
        images: client + 'images/**/*.*',
        temp: temp,

        // Browser-sync
        bsCss: build + 'styles/**/*.css',
        bsJs: build + 'scripts/**/*.css',
        bsIndex: build + 'index.html'
    };

    return config;
};
