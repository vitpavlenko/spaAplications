const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const HapiBoomDecorators = require('hapi-boom-decorators');
const HapiAuthJwt = require('hapi-auth-jwt2');

const Pack = require('../package.json');
const { compact } = require('lodash');

module.exports = compact([{
  plugin: HapiSwagger,
  options: {
    info: {
      title: Pack.name,
      description: Pack.description,
      version: Pack.version
    },
    basePath: '/',
    pathPrefixSize: 2,
    jsonPath: '/docs/swagger.json',
    sortPaths: 'path-method',
    lang: 'en',
    tags: [
      { name: 'api' }
    ],
    expanded: 'none',
    documentationPath: '/docs',
    securityDefinitions: {
      'token': {
        'type': 'apiKey',
        'name': 'authorization',
        'in': 'header'
      }
    }
  }
},
Inert,
Vision,
HapiBoomDecorators,
HapiAuthJwt
]);
