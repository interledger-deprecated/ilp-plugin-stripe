# ilp-plugin-stripe
Interledger plugin based on https://github.com/interledgerjs/ilp-plugin-btp and https://stripe.com/docs/api

Save this as test.js:
```js
const Plugin = require('.')
const plugin = new Plugin({
  stripe: {
     api_key: 'sk_test_sgmhnulE2YhvqafcHj5IMnhR',
     assetCode: 'EUR',
     assetScale: 2, // notice scale is always 0 or 2, as per https://stripe.com/docs/currencies#zero-decimal
     customer: 'cus_CEmxWWOoW2SVqh',
     description: 'Interledger settlement'
  },
  server: 'btp+wss://:token@amundsen.ilpdemo.org:1801'
})
console.log('connecting')
plugin.connect().then(async () => {
  console.log('connected')
  await plugin.sendMoney(123)
  console.log('sent')
  plugin.disconnect()
})
```

Create a Stripe account, and on https://dashboard.stripe.com/test/customers
create a customer. To this customer, add a creditcard (you can use http://www.easy400.net/js2/regexp/ccnums.html).
Take the ID of the customer you just created, and use it for `customer` on line 7 of test.js.
On https://dashboard.stripe.com/account/apikeys click 'Reveal test key token' and use it for `api_key` on line 4 of test.js.
Optionally pick a different description and asset code (but keep in mind some currencies use asset scale 0 instead of 2, see
https://stripe.com/docs/currencies#presentment-currencies).

Then run:
```sh
npm install
DEBUG=* node test.js
```

Once that succeeds, open https://dashboard.stripe.com/test/payments/ to see the payment in the history.
