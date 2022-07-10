import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import Ranking from '../../Models/Ranking'
import PaginationValidator from '../../Validators/PaginationValidator'

export default class RankingController {
  public async index({ request }: HttpContextContract) {
    const pagination = await request.validate(PaginationValidator)

    const page = pagination.page || 1
    const limit = pagination.limit || Env.get('PAGINATION_LIMIT')

    const ranking = await Ranking.query().orderBy('points', 'desc').paginate(page, limit)

    return ranking.toJSON()
  }
}
