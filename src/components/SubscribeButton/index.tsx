import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps{
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const {data: session} = useSession();

  async function handleSubscribe(){
    console.log('passou 1')

    if(!session){
      signIn('github')

      return;
    }

    console.log('passou 2')

    try {
      const response = await api.post('/subscribe');
      const { sessionId } = response.data;
      const stripe = await getStripeJs();

      console.log('passou')

      await stripe.redirectToCheckout({sessionId});

    } catch (err){
      alert(err.message);
    }

  }

  return (
    <button type="button" className={ styles.subscribeButton }
    onClick={handleSubscribe}> Subscribe Now </button>

  );
}