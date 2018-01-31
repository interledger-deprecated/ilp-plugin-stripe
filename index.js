'use strict'

const PluginBtp = require('ilp-plugin-btp')
const Stripe = require("stripe")
const debug = require('debug')('ilp-plugin-stripe')

// Options:
// {
//   stripe: {
//     api_key: 'sk_test_sgmhnulE2YhvqafcHj5IMnhR',
//     currency: 'EUR', // notice scale is always 2 except for https://stripe.com/docs/currencies#zero-decimal
//     source: 'tok_visa',
//     description: 'Interledger settlement'
//   }
// }
class StripePlugin extends PluginBtp {
  constructor (options) {
    super(options)
    this.options = options
    this.stripe = Stripe(this.options.stripe.api_key)
  }
  async sendMoney (amount) {
    await new Promise((resolve, reject) => {
      debug('charge started')
      this.stripe.charges.create({
        amount: parseInt(amount),
        currency: (this.options.stripe.currency || 'EUR'),
        source: (this.options.stripe.source || 'tok_visa'),
        description: (this.options.stripe.description || 'Interledger settlement') + ' ' + new Date().toISOString()
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
