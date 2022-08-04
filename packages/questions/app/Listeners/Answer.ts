import { EventsList } from '@ioc:Adonis/Core/Event'

import AmqpListener from './AmqpListener'

export default class Answer extends AmqpListener {
  public async onNewAnswer(answerModel: EventsList['new:answer']) {
    await answerModel.load('question')
    await answerModel.load('author')
    const answer = answerModel.toJSON()
    this.alertSubscriptions(answer, answer.question, answer.author)
  }

  private alertSubscriptions(answer: Record<string, unknown>, question: Record<string, unknown>, author: Record<string, unknown>) {
    const messageContent = {
      question: {
        id: question.id,
        authorId: question.author_id,
        title: question.title,
      },
      answer: {
        id: answer.id,
        body: answer.body,
        authorId: author.id,
        authorName: author.name,
        authorEmail: author.email
      },
    }

    this.publishMessage('new:answer', messageContent)
  }
}
