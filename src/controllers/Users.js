const bcrypt = require('bcryptjs')

const { User } = require('../models')

module.exports = {
  CreateUser: async (req, res) => {
    let { name, birthdate, email, password } = req.body
    password = await bcrypt.hash(password, await bcrypt.genSalt())
    const data = {
      name,
      birthdate,
      email,
      password
    }
    const results = await User.create(data)
    res.send({
      success: true,
      message: 'User created successfully',
      results
    })
  },
  getUsers: async (req, res) => {
    const results = await User.findAll({
      offset: 0,
      limit: 1,
      attributes: {
        exclude: ['password']
      }
    })
    res.send({
      success: true,
      message: 'List of All User',
      results
    })
  },
  getUserById: async (req, res) => {
    const { id } = req.params
    const results = await User.findByPk(id)
    if (results) {
      res.send({
        success: true,
        message: `Detail of user with id ${id}`,
        results
      })
    }
    res.send({
      success: false,
      message: 'User not found'
    })
  },
  updateUser: async (req, res) => {
    const { id } = req.params
    let { name, birthdate, email, password } = req.body
    const results = await User.findByPk(id)
    if (results) {
      if (!password) {
        const data = {
          name,
          birthdate,
          email
        }
        console.log(data)
        results.update(data)
        res.send({
          success: true,
          message: 'User updated successfully',
          results
        })
      }
      password = await bcrypt.hash(password, await bcrypt.genSalt())
      const data = {
        name,
        birthdate,
        email,
        password
      }
      results.update(data)
      res.send({
        success: true,
        message: 'User updated successfully',
        results
      })
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params
    const results = await User.findByPk(id)
    if (results) {
      await results.destroy()
      res.send({
        success: true,
        message: 'User deleted successfully'
      })
    }
    res.send({
      success: false,
      message: 'User not found'
    })
  }
}
