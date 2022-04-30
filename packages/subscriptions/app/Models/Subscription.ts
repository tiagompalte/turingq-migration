import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'

import IdentifiableModel from 'App/Helpers/Orm/IdentifiableModel'

export default class Subscription extends IdentifiableModel {
  @column()
  public subscriberId: string

  @column()
  public questionId: string

  @column()
  public subscriberEmail: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
