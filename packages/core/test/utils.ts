import * as faker from 'faker'

import User from 'App/Models/User'

export class Utils {
  public static createUser() {
    const user = new User()
    user.name = `${faker.name.firstName()} ${faker.name.lastName()}`
    user.email = faker.internet.email()
    user.password = faker.internet.password()

    return user
  }
}
