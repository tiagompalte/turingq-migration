import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'
import { EventsList } from '@ioc:Adonis/Core/Event'

import Subscription from 'App/Models/Subscription'

export default class Answer {
  public async onNewAnswer(messageContent: EventsList['answer:arrival']) {
    this.alertSubscribed(messageContent.question, messageContent.answer)
  }

  private async alertSubscribed(question: Record<string, string>, answer: Record<string, string>) {
    const subscribedEmails = (
      await Subscription.query().select('subscriber_email').where('question_id', '=', question.id)
    ).map((subscription: Subscription) => subscription.subscriberEmail)

    for (const email of subscribedEmails) {
      await Mail.sendLater((message) => {
        message
          .from(Env.get('MAIL_FROM'))
          .to(email)
          .subject('There is a new answer for a question you are subscribed!')
          .text(`Question: ${question.title}.\n\nAnswer: ${answer.body}`)
      })
    }
  }
}
