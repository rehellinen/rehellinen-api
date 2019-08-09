/**
 *  Server.js
 *  Create By rehellinen
 *  Create On 2019/3/19 22:39
 */
import Koa from 'koa'
import R from 'ramda'
import chalk from 'chalk'
import { config } from '../config'
import { r } from '../utils'

const middlewares = ['exception', 'router']
// 是否使用CORS
if (config.ALLOW_CORS) middlewares.splice(1, 0, 'cors')
// 设置全局变量$config
if (config.GLOBAL_CONF) global.$config = config

export class Server {
  constructor () {
    this.app = new Koa()
    this.host = process.env.HOST || config.HOST || '127.0.0.1'
    this.port = process.env.PORT || config.PORT || 3000
  }

  start () {
    // 使用中间件
    this.useMiddlewares()(middlewares)
    // 设置监听
    this.app.listen(this.port, this.host)
    console.log(chalk.blue(`Server listens on ${this.host}:${this.port}`))
  }

  useMiddlewares () {
    return R.map(R.pipe(
      item => `${r('./core/middleware')}/${item}`,
      require,
      R.map(item => item(this.app))
    ))
  }
}