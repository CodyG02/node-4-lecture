const bcrypt = require('bcryptjs')

module.exports ={
    register: async (req, res) => {
        console.log(req.body)
        const db = req.app.get('db')

        const {email, password} = req.body

        const exisitingUser = await db.get_user_by_email([email])

        if(exisitingUser[0]){
            return res.status(409).send('User Already Exists')
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)


        const newUser = await db.create_user([email, hash])

        delete newUser[0].hash

        req.session.user = newUser[0]

        res.status(200).send(req.session.user)
    },

    login: async (req, res) => {
        const db = req.app.get('db')

        const {email,  password} = req.body

        const exisitingUser = await db.get_user_by_email([email])

        if(!exisitingUser[0]){
           return res.status(404).send('user not found')
        }

        const authenticated = bcrypt.compareSync(password, exisitingUser[0].hash)

        if(authenticated){
            delete exisitingUser[0].hash

            req.sessionuser = exisitingUser[0]

            res.status(200).send(req.session.user)

        } else {
            res.status(401).send('Incorrect email or password')
        }
    },

    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}