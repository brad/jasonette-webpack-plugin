import assert from 'assert'
import fs from 'fs'
import path from 'path'
import timekeeper from 'timekeeper'
import webpack from 'webpack'

import JasonettePlugin from '../src'


const options = {
  entry: path.resolve(__dirname, 'files', 'source.default.js'),
  output: {
    path: path.resolve(__dirname, 'files'),
    filename: 'build.json'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
            plugins: []
          }
        }
      }
    ]
  },

  plugins: [
    new JasonettePlugin()
  ]
}


describe('JasonettePlugin', () => {
  describe('apply()', () => {
    it('should output minimal JSON by default', (done) => {
      timekeeper.freeze(new Date(1492404081284))
      webpack(options, (err, stats) => {
        if (err) {
          return done(err)
        } else if (stats.hasErrors()) {
          return done(stats.toString())
        }
        fs.readFile(path.resolve(__dirname, 'files', 'build.json'), (err, data) => {
          if (err) {
            return done(err)
          }
          const json_data = JSON.parse(data)
          const items = json_data.$jason.head.templates.body.sections[0].items.map((item) => item.text)

          assert.equal('{ ˃̵̑ᴥ˂̵̑}', json_data.$jason.head.title)
          assert.equal('$render', json_data.$jason.head.actions.$load.success.type)
          assert.equal('Hello, { ˃̵̑ᴥ˂̵̑}!', json_data.$jason.head.templates.body.header.text)
          assert(items.indexOf('{{ function text(){return\"Hello pretty functions!\"};return text() }}') > -1)
          assert(items.indexOf('regular string') > -1)
          assert(items.indexOf('5') > -1)
          assert(items.indexOf('2017-04-17T04:41:21.284Z') > -1)
          assert.equal(-1, data.indexOf('\n'))
          assert.equal(-1, data.indexOf('}\n'))
          assert.equal(-1, data.indexOf(']\n'))
          assert.equal(-1, data.indexOf(',\n'))
          done()
        })
      })
    })

    it('should output pretty JSON when asked politely', (done) => {
      const new_options = {plugins: [new JasonettePlugin({space: '  '})]}
      webpack(Object.assign(Object.assign({}, options), new_options), (err, stats) => {
        if (err) {
          return done(err)
        } else if (stats.hasErrors()) {
          return done(stats.toString())
        }
        fs.readFile(path.resolve(__dirname, 'files', 'build.json'), (err, data) => {
          if (err) {
            return done(err)
          }
          const json_data = JSON.parse(data)

          assert.equal('{ ˃̵̑ᴥ˂̵̑}', json_data.$jason.head.title)
          assert.equal(1, data.indexOf('\n'))
          assert.equal(2, data.indexOf('  '))
          done()
        })
      })
    })

    it('should handle export as jasonette', (done) => {
      const new_options = {
        entry: path.resolve(__dirname, 'files', 'source.jasonette.js'),
      }
      webpack(Object.assign(Object.assign({}, options), new_options), (err, stats) => {
        if (err) {
          return done(err)
        } else if (stats.hasErrors()) {
          return done(stats.toString())
        }
        fs.readFile(path.resolve(__dirname, 'files', 'build.json'), (err, data) => {
          if (err) {
            return done(err)
          }
          const json_data = JSON.parse(data)

          assert.equal('{ ˃̵̑ᴥ˂̵̑}', json_data.$jason.head.title)

          fs.readFile(path.resolve(__dirname, 'files', 'actions.json'), (err, data) => {
            if (err) {
              return done(err)
            }
            const json_data = JSON.parse(data)

            assert.equal('$render', json_data.$load.success.type)

            fs.readFile(path.resolve(__dirname, 'files', 'templates.json'), (err, data) => {
              if (err) {
                return done(err)
              }
              const json_data = JSON.parse(data)

              assert.equal('Hello, { ˃̵̑ᴥ˂̵̑}!', json_data.body.header.text)
              done()
            })
          })
        })
      })
    })
  })
})
