import BaseSchema from '@ioc:Adonis/Lucid/Schema'

// No AdonisJS, uma migration é definida por uma classe
// que estende BaseSchema:
export default class AuthorsSchema extends BaseSchema {
  protected tableName = 'authors'

  // Ao executar uma migração, o AdonisJS executa o
  // método "up":
  public async up() {
    // A estrutura da tabela abaixo segue os campos
    // definidos na entidade equivalente. "primary",
    // "notNullable", "255", e quaisquer outros são
    // termos relacionados ao banco de dados. Esperamos
    // que você tenha um conhecimento suficiente em
    // banco de dados para entender estes termos. Mas
    // deixe-nos saber em nossos fóruns se precisar de
    // alguma ajuda para compreender melhor estes
    // arquivos.
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable()
    })
  }

  // Ao executar um "rollback", o AdonisJS executa o
  // método "down". Rollbacks permitem retornar ao
  // estado anterior do banco de dados.
  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
