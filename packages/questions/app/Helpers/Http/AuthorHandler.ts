import Author from 'App/Models/Author'

class AuthorHandler {
  public async processAuthor(authenticatedUser: Author): Promise<void> {
    // Procuramos pelo autor no banco de dados:
    let author = await Author.find(authenticatedUser.id)

    // Se o autor não existir, criamos um novo:
    if (!author) {
      author = new Author()
      author.id = authenticatedUser.id
    }

    // Se e-mail e/ou nome são diferentes dos dados
    // presentes no objeto representando o usuário
    // autenticado (se o usuário foi criado mais acima,
    // email e nome estarão ambos vazios, mas o usuário
    // autenticado deve ter pelo menos um deles definido),
    // estes dados são atualizados e o usuário é salvo no
    // banco de dados:
    if (author.email !== authenticatedUser.email || author.name !== authenticatedUser.name) {
      author.email = authenticatedUser.email
      author.name = authenticatedUser.name

      await author.save()
    }
  }
}

export default new AuthorHandler()
