import { EventsList } from '@ioc:Adonis/Core/Event'

import Ranking from 'App/Models/Ranking'

export default class Answer {
  private readonly POINTS_ANSWER = 5

  public async onNewAnswer(messageContent: EventsList['answer:arrival']) {
    const { answer } = messageContent
    await Ranking.upsertUser(this.POINTS_ANSWER, answer.authorId, answer.authorName, answer.authorEmail)
  }
}
