'use strict';
const Hapi = require('hapi');

const manifest = require('./manifest');
const routes = require('./routes');

const ValidateJwtAuth = require('./utils/validateJWTAuth');

const { PORT, JWT_SECRET_KEY } = process.env;

// if (process.env.NODE_ENV === 'production') {
//     bugsnag.register(BUGSNAG_API_KEY);
// }

const server = Hapi.Server({
    port: PORT || 3001,
    routes: {
        cors: {
            origin: ['*'],
            credentials: true
        }
    },
    debug: { request: ['error'] }
});


const init = async () => {

    await server.register(manifest);

    server.ext('onRequest', async (request, h) => {
        request.headers['x-forwarded-host'] = (request.headers['x-forwarded-host'] || request.info.host);
        return h.continue;
    });


    server.auth.strategy('token', 'jwt', {
        key: JWT_SECRET_KEY,
        validate: ValidateJwtAuth,
        verifyOptions: {
            algorithms: ['HS256']
        }
    });

    server.route(routes);

    await server.start();
    console.log(`server is running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log('unhandled Rejection:', err);
    process.exit(1);
});

init();

module.exports = server;