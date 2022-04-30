import Event from '@ioc:Adonis/Core/Event'

Event.on('subscription:create', 'Registration.onSubscriptionRequest')
Event.on('answer:arrival', 'Answer.onNewAnswer')
