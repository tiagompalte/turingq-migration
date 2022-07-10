import { EventsList } from '@ioc:Adonis/Core/Event'

import Ranking from 'App/Models/Ranking'

export default class Question {
  private readonly POINTS_QUESTION = 10

  public async onNewQuestion(messageContent: EventsList['question:arrival']) {
    await Ranking.upsertUser(messageContent.subscriber.id, this.POINTS_QUESTION)
  }
}
