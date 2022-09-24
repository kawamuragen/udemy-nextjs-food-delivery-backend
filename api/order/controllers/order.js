"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

// module.exports = {};
// 元は上の１行があっただけだが、下のように修正した。

// ここからコピー
// https://stripe.com/docs/api/charges/create?lang=node
const stripe = require("stripe")("sk_test_xxx");

module.exports = {
  // 注文を作成する。
  create: async (ctx) => {
    // フォームに入力された内容を取得
    const { address, amount, dishes, token } = JSON.parse(ctx.request.body);
    // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
    const charge = await stripe.charges.create({
      amount: amount,
      currency: "jpy",
      source: token,
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
    });

    // StrapiのOrderフィールドにも保存する
    const order = await strapi.services.order.create({
      user: ctx.state.user._id,
      charge_id: charge.id,
      amount: amount,
      address,
      dishes,
    });
    return order;
  },
};
