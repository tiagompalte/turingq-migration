import { EventsList } from '@ioc:Adonis/Core/Event'

export default class Answer {
  public async onNewAnswer(answerModel: EventsList['new:answer']) {

  }
}
