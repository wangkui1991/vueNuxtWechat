const mongoose = require('mongoose')

// 设置模型
const TicketSchema = new mongoose.Schema({
  name: String,
  ticket: String,
  expires_in: Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})
// 每次保存前更新时间
TicketSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})
// 设置模型静态方法
TicketSchema.statics = {
  // 拿到ticket
  async getTicket () {
    const ticket = await this.findOne({
      name: 'ticket'
    }).exec()

    return ticket
  },
  //   保存ticket，如果有就更新，如果没有就新增
  async saveTicket (data) {
    let ticket = await this.findOne({
      name: 'ticket'
    }).exec()

    if (ticket) {
      ticket.ticket = data.ticket
      ticket.expires_in = data.expires_in
    } else {
      ticket = new Ticket({
        name: 'ticket',
        expires_in: data.expires_in,
        ticket: data.ticket
      })
    }

    try {
      await ticket.save()
    } catch (e) {
      console.log('存储失败')
      console.log(e)
    }

    return data
  }
}

const Ticket = mongoose.model('Ticket', TicketSchema)
