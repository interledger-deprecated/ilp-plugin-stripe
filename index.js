'use strict'

const PluginBtp = require('ilp-plugin-btp')
const Stripe = require("stripe")
const debug = require('debug')('ilp-plugin-stripe')

// Options:
// {
//   stripe: {
//     api_key: 'sk_test_sgmhnulE2YhvqafcHj5IMnhR',
//     currency: 'EUR',
//     source: 'tok_visa',
//     scale: 2,
//     description: 'Interledger settlement'
//   }
// }
class StripePlugin extends PluginBtp {
  constructor ({ stripe }) {
    super()
    this.options = stripe
    this.stripe = Stripe(this.options.api_key)
  }
  async sendMoney (amount) {
    await new Promise(resolve => {
      debug('charge started', err, charge)
      this.stripe.charges.create({
        amount: parseInt(amount) / Math.pow(10, (this.options.scale || 0)),
        currency: (this.options.currency || 'EUR'),
        source: (this.options.source || 'tok_visa'),
        description: (this.options.description || 'Interledger settlement') + ' ' + new Date().toISOString()
      }, function(err, charge) {
        debug('charge completed', err, charge)
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

module.exports = StripePlugin
