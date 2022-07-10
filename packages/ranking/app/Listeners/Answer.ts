import { EventsList } from '@ioc:Adonis/Core/Event'

import Ranking from 'App/Models/Ranking'

export default class Answer {
  private readonly POINTS_ANSWER = 5

  public async onNewAnswer(messageContent: EventsList['answer:arrival']) {
    await Ranking.upsertUser(messageContent.question.authorId, this.POINTS_ANSWER)
  }
}
