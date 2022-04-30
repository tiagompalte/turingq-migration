import { column, hasMany, HasMany, BaseModel } from '@ioc:Adonis/Lucid/Orm'

import Answer from 'App/Models/Answer'
import Question from 'App/Models/Question'

export default class Author extends BaseModel {
  // Requerido pelo AdonisJS para permitir que usemos UUID
  // ao invés de IDs numéricos:
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public email: string

  @hasMany(() => Question, { foreignKey: 'authorId' })
  public questions: HasMany<typeof Question>

  @hasMany(() => Answer, { foreignKey: 'authorId' })
  public answers: HasMany<typeof Answer>
}
