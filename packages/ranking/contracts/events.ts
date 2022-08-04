declare module '@ioc:Adonis/Core/Event' {
  interface EventsList {
    'answer:arrival': {
      answer: {
        authorId: string
        authorName: string,
        authorEmail: string
      }
    }

    'question:arrival': {
      subscriber: {
        id: string
        name: string
        email: string
      }
    }
  }
}
