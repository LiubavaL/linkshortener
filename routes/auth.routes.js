const {Router} = require('express')
const router = Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

router.post(
    '/register', 
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Min len of passowrd is 6 symbols').isLength({min: 6})
    ],
    async (req, res) => {
    try {
        console.log('----req.body', req.body)

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect registration data'
            })
        }
        const {email, password} = req.body
        const candidate = await User.findOne({email});

        if(candidate){
            return res.status(400).json({message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email, password: hashedPassword})
        console.log('trying to save user ', user)
        await user.save()

        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )
        return res.status(201).json({token, userId: user.id})
        // res.status(201).json({message: 'User created succesfly!'})
    } catch(e) {
        res.status(500).json({message: e.message})
    }
})

router.post(
    '/login', 
    [
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password', 'Enter passsword').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect signin data'
            })
        }

        const {email, password} = req.body
        // const hashedPassword = await bcrypt.hash(password, 12)
        // console.log('hashedPassword', hashedPassword)
        
        const user = await User.findOne({email})
        console.log('user', user)
        if(user){
            const isValidPassword = await bcrypt.compare(password, user.password)
            console.log('isValidPassword', isValidPassword)

            if (isValidPassword){
                const token = jwt.sign(
                    {userId: user.id},
                    config.get('jwtSecret'),
                    {expiresIn: '1h'}
                )
                return res.json({token, userId: user.id})
            }
        }
        console.log('SENDING ANOTHER RES')
        res.status(400).json({message: 'Incorrect email or password '})
       
    } catch(e) {
        console.log(e)
        res.status(500).json({message: e.message})
    }
})

module.exports = router
