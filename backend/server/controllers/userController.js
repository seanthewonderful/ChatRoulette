import { User } from "../../database/model.js"

const userHandlers = {

  register: async (req, res) => {

    const { username, password } = req.body

    if (await User.findOne({ where: { username }})) {

      res.status(409).send({
        message: "Username already exists",
        user: null
      }) 

    } else {

      const newUser = await User.create({
        username,
        password
      })

      req.session.user = newUser

      res.status(201).send({
        message: "New user account created",
        user: newUser
      })
    }
    
  },
  
  login: async (req, res) => {

    const { username, password } = req.body
    
    let user = await User.scope('withPassword').findOne({
      where: {
        username
      }
    })

    if (!user || !bcryptjs.compareSync(password, user.password)) {
      res.status(401).send({
        message: "User credentials incorrect",
        user: null
      });
      return;
    }

    user = await User.findByPk(user.userId)

    req.session.user = user

    res.status(200).send({
      message: "User saved to session",
      user: user
    })
  },

  logout: async (req, res) => {
    req.session.destroy()
    res.status(200).send({
      message: "Session terminated. User logged out."
    })
  },

  sessionCheck: async (req, res) => {

    if (req.session.user) {
      const user = await User.findByPk(req.session.user.userId)

      res.status(200).send({
        message: "User found in session",
        user: user
      })
    }
  }
}

export default userHandlers