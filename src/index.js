import axis from 'axis.js'
import uglify from 'uglify-js'
import vm from 'vm'


function JasonettePlugin(options) {
  this.replacer = (key, value) => {
    if(axis.isFunction(value)) {
      const uglified = uglify.minify(`${String(value)}`, {fromString: true})
      const cleaned = uglified.code.replace('{{', '{ {').replace('}}', '} }')
      return `{{ ${cleaned};return ${value.name}() }}`
    } else if(axis.isObject(value) || axis.isArray(value)) {
      return value
    }
    return String(value)
  }
  const defaultOptions = {
    'replacer': this.replacer,
    'space': ''
  }

  this.options = Object.assign(defaultOptions, options)
}

JasonettePlugin.prototype.apply = function(compiler) {
  const options = this.options

  compiler.plugin("emit", (compilation, callback) => {
    Object.keys(compilation.assets).forEach((asset) => {
      const compiled = vm.runInThisContext(compilation.assets[asset].source())
      var source = JSON.stringify(
        compiled.default || compiled.jasonette,
        options.replacer,
        options.space
      )
      compilation.assets[asset] = {
        source: () => source,
        size: () => source.length
      }
    })

    callback()
  })
}

export default JasonettePlugin
