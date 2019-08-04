'use strict'

const pick = require('lodash/fp/pick')
const loadRoutesByPath = require('./load-files')
const registerRoutes = require('./register-router')
const displayRoutes = require('./display-routes')
const registerService = require('./register-service')

const pickPluginOptions = pick([
  'path',
  'showTable',
  'useService'
])

/**
 * @method registerRouter
 * @param  {Object}    server
 * @param  {Object}    options
 * @param  {Function}    next
 */
function registerRouter (server, options, next) {
  const opts = pickPluginOptions(options)
  const dirname = opts.path
  const showTable = opts.showTable || false
  const useService = opts.useService || false

  if (!dirname) {
    return next(new Error('`path` parameter is required to load files'))
  }
  const routes = loadRoutesByPath(dirname, options)

  routes.forEach(route => registerRoutes(server, route))

  if (useService) {
    registerService(server, routes)
  }

  if (showTable) {
    displayRoutes(routes)
  }
}

module.exports = registerRouter
