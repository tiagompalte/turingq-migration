import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/ranking', 'RankingController.index')
}).prefix('/api')
