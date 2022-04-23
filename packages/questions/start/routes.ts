import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('questions', 'QuestionsController').apiOnly().middleware({
    store: 'keycloak',
    update: 'keycloak',
    destroy: 'keycloak',
  })

  Route.resource('questions.answers', 'AnswersController').apiOnly().middleware({
    store: 'keycloak',
    update: 'keycloak',
    destroy: 'keycloak',
  })
}).prefix('/api')
