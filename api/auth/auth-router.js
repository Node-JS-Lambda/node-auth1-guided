const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { add, findBy } = require('../users/users-model')

const validatePayload = (req, res, next) => {next()}

router.post('/register',validatePayload, async (req, res, next) => {
    try {
        const { username, password } = req.body
        const hash = bcrypt.hashSync(password, 8)
        const user = { username, password: hash}
        const createdUser = await add(user)
        res.status(201).json(createdUser)
    } catch (error) {
        next(error)
    }
})


router.post('/login',validatePayload, async (req, res, next) => {
    try {
        const { username, password} = req.body
        const [ user ] = await findBy({username})
        const isCorrectPassword = bcrypt.compareSync(password, user.password)

        if (user && isCorrectPassword) {
            console.log(user)
        } else {
            next({ status: 401,message: 'Bad credentials' })
        }

    } catch (error) {
        next(error)
    }
})


router.get('/logout', async (req, res, next) => {
    res.json('Logout Wired!')
})


module.exports = router