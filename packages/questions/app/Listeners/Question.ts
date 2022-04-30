import { EventsList } from '@ioc:Adonis/Core/Event'

export default class Answer {
  public async onNewQuestion(questionModel: EventsList['new:question']) {

  }
}
