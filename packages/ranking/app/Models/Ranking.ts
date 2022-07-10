import { column } from '@ioc:Adonis/Lucid/Orm'

import IdentifiableModel from 'App/Helpers/Orm/IdentifiableModel'

export default class Ranking extends IdentifiableModel {
  @column()
  public userId: string

  @column()
  public points: number

  public static async upsertUser(userId: string, pointsSum: number): Promise<void> {
    let ranking = await Ranking.findBy('user_id', userId)

    if (!ranking) {
      ranking = new Ranking()
      ranking.points = pointsSum
      ranking.userId = userId
    } else {
      ranking.points += pointsSum
    }

    await ranking.save()
  }
}
