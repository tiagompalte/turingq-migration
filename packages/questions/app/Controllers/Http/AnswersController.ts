import Env from '@ioc:Adonis/Core/Env'
import Event from '@ioc:Adonis/Core/Event'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { string } from '@ioc:Adonis/Core/Helpers'

import AnswerValidator from 'App/Validators/AnswerValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'
import Answer from 'App/Models/Answer'
import AuthorHandler from 'App/Helpers/Http/AuthorHandler'

// TODO: add missing tests
export default class AnswersController {
  public async index({ request }: HttpContextContract) {
    const questionId = request.param('question_id')

    const pagination = await request.validate(PaginationValidator)

    const page = pagination.page || 1
    const limit = pagination.limit || Env.get('PAGINATION_LIMIT')

    const answers = await Answer.query().where('question_id', questionId).paginate(page, limit)

    return answers.toJSON()
  }

  public async show({ params }: HttpContextContract) {
    const answer = await Answer.findOrFail(params.id)
    await answer.load((loader) => loader.load('author'))

    return answer.toJSON()
  }

  public async store({ request, response }: HttpContextContract) {
    const user = request['user']
    await AuthorHandler.processAuthor(user)
    const answer = await this.save(request, user.id)

    Event.emit('new:answer', answer)

    return response.created(answer.toJSON())
  }

  public async update({ request, response }: HttpContextContract) {
    const user = request['user']
    await AuthorHandler.processAuthor(user)
    const questionId = request.param('question_id')

    let answerInDb = (
      await Answer.query().where({
        id: request.param('id'),
        question_id: questionId,
      })
    )[0]

    let responseMethod = 'ok'

    if (answerInDb === null) {
      responseMethod = 'created'
    } else if (answerInDb.authorId !== user.id) {
      return response.unauthorized({ error: 'You cannot update an answer from another author' })
    }

    const question = await this.save(request, user.id, answerInDb)
    return response[responseMethod](question.toJSON())
  }

  public async destroy({ params, request, response }: HttpContextContract) {
    const user = request['user']
    const answer = await Answer.findOrFail(params.id)
    if (answer.authorId !== user.id) {
      return response.unauthorized({ error: 'You cannot remove an answer from another author' })
    }
    await answer.delete()
    return response.noContent()
  }

  private async save(request: RequestContract, authorId: string, answerToSave?: Answer | null) {
    const payload = await request.validate(AnswerValidator)
    if (!answerToSave) {
      answerToSave = new Answer()
      answerToSave.authorId = authorId
      answerToSave.questionId = request.param('question_id')
    }

    answerToSave.body = string.escapeHTML(payload.body)

    return answerToSave.save()
  }
}
