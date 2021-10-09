import glob from 'glob'
import PurgeCSSPlugin from 'purgecss-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import AndConfig from '../src/Utilities/and-config'
import CommonConfig from './webpack.common'


class ProductionConfig extends AndConfig {
  get common() {
    return false
  }
  
  get mode() {
    return 'production'
  }
  
  get config(): AndConfig.WebpackConfiguration {
    return {
      mode: 'production',
      plugins: [
        new PurgeCSSPlugin({
          paths: glob.sync(this.paths.src.join('/**/*{.ts,.js,.pug}').path, {nodir: true})
        })
      ],
      optimization: {
        minimizer: [
          new TerserPlugin({
            extractComments: false
          })
        ]
      }
    }
  }
  
  public get pathDef() {
    return CommonConfig.pathDef
  }
  
  protected static _instance: ProductionConfig
  static get instance() {
    if (!this._instance)
      this._instance = new ProductionConfig()
    return this._instance
  }
}

ProductionConfig.instance

export default ProductionConfig

