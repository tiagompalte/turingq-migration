import { column } from '@ioc:Adonis/Lucid/Orm'

import IdentifiableModel from 'App/Helpers/Orm/IdentifiableModel'
import { DateTime } from 'luxon'

export default class Ranking extends IdentifiableModel {
  @column()
  public userId: string

  @column()
  public userName: string

  @column()
  public userEmail: string

  @column()
  public points: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static async upsertUser(pointsSum: number, userId: string, userName: string, userEmail: string): Promise<void> {
    let ranking = await Ranking.findBy('user_id', userId)

    if (!ranking) {
      ranking = new Ranking()
      ranking.userName = userName
      ranking.userEmail = userEmail
      ranking.points = pointsSum
      ranking.userId = userId
    } else {
      ranking.points += pointsSum
    }

    await ranking.save()
  }
}
