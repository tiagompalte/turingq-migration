import Env from '@ioc:Adonis/Core/Env'
import Event from '@ioc:Adonis/Core/Event'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { string } from '@ioc:Adonis/Core/Helpers'

import QuestionValidator from 'App/Validators/QuestionValidator'
import PaginationValidator from 'App/Validators/PaginationValidator'
import Question from 'App/Models/Question'
import AuthorHandler from 'App/Helpers/Http/AuthorHandler'

// TODO: add missing tests
export default class QuestionsController {
  public async index({ request }: HttpContextContract) {
    const pagination = await request.validate(PaginationValidator)

    const page = pagination.page || 1
    const limit = pagination.limit || Env.get('PAGINATION_LIMIT')

    const questions = await Question.query()
      .preload('author')
      .preload('answers')
      .paginate(page, limit)

    return questions.toJSON()
  }

  public async show({ params }: HttpContextContract) {
    const question = await Question.findOrFail(params.id)
    question.computeView()
    await question.save()

    await question.load((loader) => {
      loader.load('author').load('answers', (answers) => {
        answers.preload('author')
      })
    })

    return question.toJSON()
  }

  public async store({ request, response }: HttpContextContract) {
    const user = request['user']
    await AuthorHandler.processAuthor(user)
    const question = await this.save(request, user.id)
    Event.emit('new:question', question)
    return response.created(question.toJSON())
  }

  public async update({ request, response }: HttpContextContract) {
    const user = request['user']
    await AuthorHandler.processAuthor(user)
    let questionInDb = await Question.find(request.param('id'))
    let responseMethod = 'ok'

    if (questionInDb === null) {
      responseMethod = 'created'
    } else if (questionInDb.authorId !== user.id) {
      return response.unauthorized({ error: 'You cannot update a question from another author' })
    }

    const question = await this.save(request, user.id, questionInDb)
    return response[responseMethod](question.toJSON())
  }

  public async destroy({ params, request, response }: HttpContextContract) {
    const user = request['user']
    const question = await Question.findOrFail(params.id)
    if (question.authorId !== user.id) {
      return response.unauthorized({ error: 'You cannot remove a question from another author' })
    }
    await question.delete()
    return response.noContent()
  }

  private async save(request: RequestContract, authorId: string, questionToSave?: Question | null) {
    const payload = await request.validate(QuestionValidator)
    if (!questionToSave) {
      questionToSave = new Question()
      questionToSave.authorId = authorId
    }

    questionToSave.title = string.escapeHTML(payload.title)
    questionToSave.body = string.escapeHTML(payload.body)

    return questionToSave.save()
  }
}
