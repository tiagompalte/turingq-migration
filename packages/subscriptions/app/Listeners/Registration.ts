import { EventsList } from '@ioc:Adonis/Core/Event'

import Subscription from 'App/Models/Subscription'

export default class Registration {
  public async onSubscriptionRequest(messageContent: EventsList['subscription:create']) {
    this.subscribe(
      messageContent.question.id,
      messageContent.subscriber.id,
      messageContent.subscriber.email
    )
  }

  private async subscribe(questionId: string, subscriberId: string, subscriberEmail: string) {
    const subscription = new Subscription()
    subscription.subscriberId = subscriberId
    subscription.questionId = questionId
    subscription.subscriberEmail = subscriberEmail

    await subscription.save()
  }
}
