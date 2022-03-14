module.exports = {
	"env": {
		"es2021": true,
		"node": true,
		"jest/globals": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"quotes": ["error", "double", { "allowTemplateLiterals": true }],
		"no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
	},
	"plugins": ["jest"]
}
