import { stripe, PRICING, CustomerData, SubscriptionStatus } from '../config/stripe';
import { supabaseAdmin } from '../config/supabase';
import { CustomError } from '../middleware/errorHandler';

// Stripeカスタマーを作成
export const createStripeCustomer = async (
  userId: string,
  email: string,
  name?: string
): Promise<string> => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        user_id: userId,
      },
    });

    // SupabaseにStripe顧客IDを保存
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return customer.id;
  } catch (error: any) {
    const billingError: CustomError = new Error('顧客の作成に失敗しました');
    billingError.statusCode = 500;
    throw billingError;
  }
};

// チェックアウトセッションを作成
export const createCheckoutSession = async (
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return session.url || '';
  } catch (error: any) {
    const billingError: CustomError = new Error('チェックアウトセッションの作成に失敗しました');
    billingError.statusCode = 500;
    throw billingError;
  }
};

// サブスクリプションのキャンセル
export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } catch (error: any) {
    const billingError: CustomError = new Error('サブスクリプションのキャンセルに失敗しました');
    billingError.statusCode = 500;
    throw billingError;
  }
};

// サブスクリプションの再開
export const resumeSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
  } catch (error: any) {
    const billingError: CustomError = new Error('サブスクリプションの再開に失敗しました');
    billingError.statusCode = 500;
    throw billingError;
  }
};

// 顧客のサブスクリプション情報を取得
export const getCustomerSubscription = async (customerId: string): Promise<{
  status: SubscriptionStatus | null;
  subscriptionId: string | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}> => {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return {
        status: null,
        subscriptionId: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    const subscription = subscriptions.data[0];
    return {
      status: subscription.status as SubscriptionStatus,
      subscriptionId: subscription.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };
  } catch (error: any) {
    const billingError: CustomError = new Error('サブスクリプション情報の取得に失敗しました');
    billingError.statusCode = 500;
    throw billingError;
  }
};

// カスタマーポータルセッションを作成
export const createPortalSession = async (
  customerId: string,
  returnUrl: string
): Promise<string> => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  } catch (error: any) {
    const billingError: CustomError = new Error('顧客ポータルセッションの作成に失敗しました');
    billingError.statusCode = 500;
    throw billingError;
  }
};