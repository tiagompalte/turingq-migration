//@ts-ignore
import Event from '@ioc:Adonis/Core/Event'

Event.on('question:arrival', 'Question.onNewQuestion')
Event.on('answer:arrival', 'Answer.onNewAnswer')
