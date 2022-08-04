import { EventsList } from '@ioc:Adonis/Core/Event'

import Ranking from 'App/Models/Ranking'

export default class Question {
  private readonly POINTS_QUESTION = 10

  public async onNewQuestion(messageContent: EventsList['question:arrival']) {
    const {subscriber} = messageContent
    await Ranking.upsertUser(this.POINTS_QUESTION, subscriber.id, subscriber.name, subscriber.email)
  }
}
