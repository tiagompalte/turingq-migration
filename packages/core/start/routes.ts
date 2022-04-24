import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // A rota de registro não precisa de nenhum middleware:
  Route.resource('registration', 'RegistrationsController').only(['store'])
}).prefix('api')
