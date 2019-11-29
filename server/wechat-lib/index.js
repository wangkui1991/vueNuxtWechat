import request from 'request-promise'
import fs from 'fs'

import _ from 'lodash'
import { sign } from './util'

const base = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
  accessToken: base + 'token?grant_type=client_credential',
  /* 素材接口 */
  temporary: {
    upload: base + 'media/upload?',
    fetch: base + 'media/get?'
  },
  permanent: {
    upload: base + 'material/add_material?',
    uploadNews: base + 'material/add_news?',
    uploadNewsPic: base + 'material/uploadimg?',
    fetch: base + 'material/get_material?',
    del: base + 'material/del_material?',
    update: base + 'material/update_news?',
    count: base + 'material/get_materialcount?',
    batch: base + 'material/batchget_material?'
  },
  /* 标签 */
  tag: {
    create: base + 'tags/create?',
    fetch: base + 'tags/get?',
    update: base + 'tags/update?',
    del: base + 'tags/delete?',
    fetchUsers: base + 'user/tag/get?', // 获取标签下粉丝列表
    batchTag: base + 'tags/members/batchtagging?',  // 批量打标签
    batchUnTag: base + 'tags/members/batchuntagging?',  // 批量取消标签
    getTagList: base + 'tag/getidlist?'  // 标签列表
  },
  /* 用户 */
  user: {
    remark: base + 'user/info/updateremark?',  // 设置用户备注名
    info: base + 'user/info?',  // 获取用户信息
    batchInfo: base + 'user/info/batchget?',  // 批量获取用户信息
    fetchUserList: base + 'user/get?', // 获取用户列表
    getBlackList: base + 'tags/members/getblacklist?', // 获取黑名单列表
    batchBlackUsers: base + 'tags/members/batchblacklist?',  // 拉黑用户
    batchUnblackUsers: base + 'tags/members/batchunblacklist?'  // 取消拉黑
  },
  /** 菜单管理 */
  menu: {
    create: base + 'menu/create?',  // 创建菜单
    get: base + 'menu/get?',  // 拿到菜单
    del: base + 'menu/delete?',  // 删除菜单
    addCondition: base + 'menu/addconditional?',  // 创建个性化菜单
    delCondition: base + 'menu/delconditional?',  // 删除个性化菜单
    getInfo: base + 'get_current_selfmenu_info?'  // 获取自定义菜单的配置
  },
  /** 网页授权ticket */
  ticket: {
    get: base + 'ticket/getticket?'
  }
}

function statFile (filepath) {
  return new Promise((resolve, reject) => {
    fs.stat(filepath, (err, stat) => {
      if (err) reject(err)
      else resolve(stat)
    })
  })
}

export default class Wechat {
  constructor (opts) {
    this.opts = Object.assign({}, opts)
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.getTicket = opts.getTicket
    this.saveTicket = opts.saveTicket

    this.fetchAccessToken()
  }

  async request (options) {
    options = Object.assign({}, options, { json: true })
    try {
      console.log(132)
      const res = await request(options)
      console.log('res', res)
      return res
    } catch (error) {
      console.error(error)
    }
  }

  async fetchAccessToken () {
    let data = await this.getAccessToken()
    if (!this.isValidToken(data, 'access_token')) {
      data = await this.updateAccessToken()
    }
    await this.saveAccessToken(data)
    return data
  }
  async updateAccessToken () {
    const url =
      api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret
    const data = await this.request({
      url: url
    })
    const now = new Date().getTime()
    const expiresIn = now + (data.expires_in - 20) * 1000
    data.expires_in = expiresIn
    return data
  }

  async fetchTicket (token) {
    let data = await this.getTicket()

    if (!this.isValidToken(data, 'ticket')) {
      data = await this.updateTicket(token)
    }

    await this.saveTicket(data)

    return data
  }

  async updateTicket (token) {
    const url = api.ticket.get + '&access_token=' + token + '&type=jsapi'

    let data = await this.request({url: url})
    const now = (new Date().getTime())
    const expiresIn = now + (data.expires_in - 20) * 1000

    data.expires_in = expiresIn

    return data
  }
  isValidToken (data, name) {
    if (!data || !data[name] || !data.expires_in) {
      return false
    }

    const expiresIn = data.expires_in
    const now = (new Date().getTime())

    if (now < expiresIn) {
      return true
    } else {
      return false
    }
  }
  // 总控方法
  async handle (operation, ...args) {
    const tokenData = await this.fetchAccessToken()
    const options = await this[operation](tokenData.access_token, ...args)
    console.log('3', options)
    const data = await this.request(options)
    console.log('data', data)
    return data
  }
  // 新增素材
  async uploadMaterial (token, type, material, permanent) {
    let form = {}
    let url = api.temporary.upload

    if (permanent) {
      url = api.permanent.upload

      _.extend(form, permanent)
    }

    if (type === 'pic') {
      url = api.permanent.uploadNewsPic
    }

    if (type === 'news') {
      url = api.permanent.uploadNews
      form = material
    } else {
      form.media = fs.createReadStream(material)
    }
    let uploadUrl = url + 'access_token=' + token

    if (!permanent) {
      uploadUrl += '&type=' + type
    } else {
      form.access_token = token
    }

    const options = {
      method: 'POST',
      url: uploadUrl,
      json: true
    }

    if (type === 'news') {
      options.body = form
    } else {
      options.formData = form
    }

    return options
  }
  // 获取素材
  fetchMaterial (token, mediaId, type, permanent) {
    let form = {}
    let fetchUrl = api.temporary.fetch
    if (permanent) {
      fetchUrl = api.permanent.fetch
    }
    let url = fetchUrl + 'access_token' + token
    let options = {method: 'POST', url: url}

    if (permanent) {
      form.media_id = mediaId
      form.access_token = token
      options.body = form
    } else {
      if (type === 'video') {
        url = url.replace('https://', 'http://')
      }
      url += '&media_id=' + mediaId
    }
    return options
  }
  // 删除素材
  deleteMaterial (token, mediaId) {
    const form = {
      media_id: mediaId

    }
    const url = api.permanent.del + 'access_token=' + token + '&media_id=' + mediaId

    return {method: 'POST', url: url, body: form}
  }
  // 更新素材
  updateMaterial (token, mediaId, news) {
    const form = {
      media_id: mediaId
    }
    _.extend(form, news)

    const url = api.permanent.update + 'access_token=' + token + '&media_id=' + mediaId

    return {method: 'POST', url: url, body: form}
  }
  // 获取素材总数
  countMaterial (token) {
    const url = api.permanent.count + 'access_token=' + token

    return {method: 'POST', url: url}
  }

  // 获取素材列表
  batchMaterial (token, options) {
    options.type = options.type || 'image'
    options.offset = options.offset || 0
    options.count = options.count || 10

    const url = api.permanent.batch + 'access_token=' + token
    return {method: 'POST', url: url, body: options}
  }
  /* 标签管理 */

  createTag (token, name) {
    const form = {
      tag: {
        name: name
      }
    }
    const url = api.tag.create + 'access_token=' + token
    return {method: 'POST', url: url, body: form}
  }
  fetchTags (token) {
    const url = api.tag.fetch + 'access_token=' + token
    return {url: url}
  }
  updateTag (token, tagId, name) {
    const form = {
      tag: {
        id: tagId,
        name: name
      }
    }
    const url = api.tag.update + 'access_token=' + token
    return {method: 'POST', url: url, body: form}
  }
  delTag (token, tagId) {
    const form = {
      tag: {
        id: tagId
      }
    }
    const url = api.tag.del + 'access_token=' + token
    return {method: 'POST', url: url, body: form}
  }
  fetchTagUsers (token, tagId, openId) {
    const form = {
      tagid: tagId,
      next_openid: openId || ''
    }
    const url = api.tag.fetchUsers + 'access_token=' + token
    return {method: 'POST', url: url, body: form}
  }
  batchTag (token, openIdList, tagId, unTag) {
    const form = {
      openid_list: openIdList,
      tagid: tagId
    }
    let url = api.tag.batchTag
    if (unTag) {
      url = api.tag.batchUnTag
    }
    url += 'access_token=' + token
    return {method: 'POST', url: url, body: form}
  }
  getTagList (token, openId) {
    const form = {
      openid: openId
    }
    const url = api.tag.getTagList + 'access_token=' + token
    return {methodL: 'POST', url: url, body: form}
  }

  /* 用户管理 */

  remarkUser (token, openId, remark) {
    const form = {
      openid: openId,
      remark: remark
    }
    const url = api.user.remark + 'access_token=' + token
    return {method: 'POST', url: url, body: form}
  }
  getUserInfo (token, openId, lang) {
    const url = `${api.user.info}access_token=${token}&openid=${openId}&lang=${lang || 'zh_CN'}`
    return {url: url}
  }
  batchUserInfo (token, userList) {
    // userList = [ {openid: 'opotB5jxm_CC4Dpy_jlPSfPlqTgM', lang: 'zh_CN'}]
    const url = api.user.batchInfo + 'access_token=' + token
    const form = {
      user_list: userList
    }
    return {method: 'POST', url: url, body: form}
  }
  fetchUserList (token, openId) {
    const url = `${api.user.fetchUserList}access_token=${token}&next_openid=${openId || ''}`
    return {url: url}
  }

  /** 黑名单暂时用不到，实现方式一样 */

  /** 菜单管理 */
  createMenu (token, menu) {
    const url = api.menu.create + 'access_token=' + token

    return {method: 'POST', url: url, body: menu}
  }

  getMenu (token) {
    const url = api.menu.get + 'access_token=' + token

    return {url: url}
  }

  delMenu (token) {
    const url = api.menu.del + 'access_token=' + token

    return {url: url}
  }

  addConditionMenu (token, menu, rule) {
    const url = api.menu.addCondition + 'access_token=' + token
    const form = {
      button: menu,
      matchrule: rule
    }

    return {method: 'POST', url: url, body: form}
  }

  delConditionMenu (token, menuId) {
    const url = api.menu.delCondition + 'access_token=' + token
    const form = {
      menuid: menuId
    }

    return {method: 'POST', url: url, body: form}
  }

  getCurrentMenuInfo (token) {
    const url = api.menu.getInfo + 'access_token=' + token

    return {url: url}
  }

  sign (ticket, url) {
    return sign(ticket, url)
  }
}
