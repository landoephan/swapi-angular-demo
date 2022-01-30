/* eslint-disable arrow-body-style */
// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

const browserify = require('@cypress/browserify-preprocessor')
const cucumber = require('cypress-cucumber-preprocessor').default
const path = require('path')

export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): Cypress.PluginConfigOptions => {
	// code coverage plugin
	require('@cypress/code-coverage/task')(on, config)

	// cucumber plugin
	const options = {
		...browserify.defaultOptions,
		typescript: path.resolve('node_modules/typescript'),
	}

	on('file:preprocessor', cucumber(options))

	return config
}
