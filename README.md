# ilp-plugin-stripe
Interledger plugin based on https://github.com/interledgerjs/ilp-plugin-btp and https://stripe.com/docs/api

Save this as test.js:
```js
const Plugin = require('.')
const plugin = new Plugin({
  stripe: {
     api_key: 'sk_test_sgmhnulE2YhvqafcHj5IMnhR',
     currency: 'EUR',
     source: 'tok_visa',
     scale: 2,
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

Create a Stripe account, and read your test (sandbox) api key from
Edit test.js to use your test (sandbox) api key on line 4.

Then run:
```sh
npm install
DEBUG=* node test.js
```

Once that succeeds, open https://dashboard.stripe.com/test/payments/ to see the payment in the history.
