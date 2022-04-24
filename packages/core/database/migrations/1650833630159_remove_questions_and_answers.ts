import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RemoveQuestionsAndAnswers extends BaseSchema {
  protected tableNameQuestions = 'questions'
  protected tableNameAnswers = 'answers'
  protected tableNameSubscriptions = 'subscriptions'

  // Ao executar a migration, remove as tabelas que não
  // são mais necessárias:
  public async up() {
    this.schema.dropTable(this.tableNameSubscriptions)
    this.schema.dropTable(this.tableNameAnswers)
    this.schema.dropTable(this.tableNameQuestions)
  }

  // Recria as tabelas tal como nas migrations originais
  // caso você reverta a migração. Note que esta migration
  // não recupera dados que foram removidos com a remoção
  // executada no método "up":
  public async down() {
    this.schema.createTable(this.tableNameQuestions, (table) => {
      table.string('id').primary()
      table.string('title', 150).notNullable()
      table.text('body').notNullable()
      table.integer('views').defaultTo(0)
      table.string('author_id').notNullable().unsigned().references('users.id').onDelete('CASCADE')

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.schema.createTable(this.tableNameAnswers, (table) => {
      table.string('id').primary()
      table.text('body').notNullable()
      table
        .string('question_id')
        .notNullable()
        .unsigned()
        .references(`${this.tableNameQuestions}.id`)
        .onDelete('CASCADE')

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.schema.createTable(this.tableNameSubscriptions, (table) => {
      table.increments('id').primary()
      table.string('user_id').notNullable().unsigned().references('users.id').onDelete('CASCADE')
      table
        .string('question_id')
        .notNullable()
        .unsigned()
        .references('questions.id')
        .onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
    })
  }
}
