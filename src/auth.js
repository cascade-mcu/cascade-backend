const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Context, getUserId, APP_SECRET } = require('./utils')

const InvalidPasswordError = require('./errors/InvalidPasswordError');
const InvalidEmailError = require('./errors/InvalidEmailError');

// resolve the `AuthPayload` type
const AuthPayload = {
  user: async ({ user: { id } }, args, ctx, info) => {
    return ctx.db.query.user({ where: { id } }, info)
  },
}

// query the currently logged in user
function me(parent, args, ctx, info) {
  const id = getUserId(ctx)
  return ctx.db.query.user({ where: { id } }, info)
}

// register a new user
async function signup(parent, args, ctx, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await ctx.db.mutation.createUser({
    data: { ...args, password },
  })

  const homeLocation = await ctx.db.mutation.createLocation({
    data: {
      isDefault: true,
      name: 'Home',
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  await ctx.db.mutation.createPlace({
    data: {
      isDefault: true,
      name: 'My Room',
      location: {
        connect: {
          id: homeLocation.id,
        },
      },
    },
  });

  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user,
  }
}

// log in an existing user
async function login(parent, { email, password }, ctx, info) {
  const user = await ctx.db.query.user({ where: { email } })
  if (!user) {
    throw new InvalidEmailError();
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new InvalidPasswordError();
  }

  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user,
  }
}

module.exports = { me, signup, login, AuthPayload }
