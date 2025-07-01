module.exports = {
    // ostale opcije
    resolve: {
        fallback: {
            crypto: require.resolve("crypto-browserify"),
        },
    },
};
