import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Rankings extends BaseSchema {
  protected tableName = 'rankings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('user_id').notNullable().unique().index()
      table.string('user_name').notNullable()
      table.string('user_email').notNullable()
      table.integer('points').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
