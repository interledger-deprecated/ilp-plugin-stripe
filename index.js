'use strict'

const PluginBtp = require('ilp-plugin-btp')
const Stripe = require("stripe")
const debug = require('debug')('ilp-plugin-stripe')

const ZERO_SCALE_CURR = ['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'VND', 'VUV', 'XAF', 'XOF', 'XPF']

// Options:
// {
//   stripe: {
//     api_key: 'sk_test_sgmhnulE2YhvqafcHj5IMnhR',
//     assetCode: 'EUR',
//     assetScale: 2, // notice scale is always 2, we don't support https://stripe.com/docs/currencies#zero-decimal
//     customer: 'cus_CEmxWWOoW2SVqh',
//     description: 'Interledger settlement'
//   }
// }
class StripePlugin extends PluginBtp {
  constructor (options) {
    super(options)
    this.options = options
    this.stripe = Stripe(this.options.stripe.api_key)
    if (!options.stripe) { throw new Error('Missing options.stripe - try {}') }
    if (!options.stripe.api_key) { throw new Error('Missing options.stripe.api_key - try "sk_test_sgmhnulE2YhvqafcHj5IMnhR"') }
    if (!options.stripe.customer) { throw new Error('Missing options.stripe.customer - try "cus_CEmxWWOoW2SVqh"') }
    if (!options.stripe.assetCode) { throw new Error('Missing options.stripe.assetCode - try "EUR" (and assetScale 0 or 2)') }
    const expectedScale = (ZERO_SCALE_CURR.indexOf(options.stripe.assetCode) === -1 ? 2 : 0)
    if (options.stripe.assetScale !== expectedScale) { throw new Error('The options.stripe.assetScale must equal 0 or 2, see https://stripe.com/docs/currencies#zero-decimal') }
    if (!options.stripe.description) { throw new Error('Missing options.stripe.description - try "Interledger settlement"') }
  }
  async handleMoney (from, {requestId, data }) {
    await new Promise((resolve, reject) => {
      debug('charge started')
      this.stripe.charges.create({
        amount: parseInt(data.amount),
        currency: this.options.stripe.assetCode,
        customer: this.options.stripe.customer,
        description: this.options.stripe.description + ' ' + new Date().toISOString()
      }, function(err, charge) {
        debug('charge completed', err, charge)
        if (err) {
          reject(err)
        } else {
          resolve([])
        }
      })
    })
  }
}

module.exports = StripePlugin
