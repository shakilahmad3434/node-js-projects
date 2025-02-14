const User = require('../models/user.model');
const bcrypt = require('bcrypt');

async function handleSignupPage(req, res){
    res.render('signup');
}

async function handleSignupForm(req, res) {
    try {
        const { name, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const findUser = await User.findOne({ email });
        if (findUser) {
            return res.redirect('/user/login');
        } else {
            const user = await User.create({
                name: name,
                email: email,
                password: hashedPassword,
            });
            console.log(user);
            req.session.userId = user._id;
            return res.redirect('/');
        }
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).send('Internal Server Error');
    }
}

async function handleLoginPage(req, res){
    res.render('login');
}

async function handleLoginForm(req, res){
    const {email, password} = req.body;

    const findUser = await User.findOne({email});
    if(findUser){
        const isMatch = await bcrypt.compare(password, findUser.password);
        if(isMatch){
            req.session.userId = findUser._id;
            setTimeout(() => {
                res.redirect('/');
            }, 1000);
        } else {
            res.redirect('/user/login');
        }
    } else {
        res.redirect('/user/signup');
    }
}

module.exports = {
    handleSignupPage,
    handleSignupForm,
    handleLoginPage,
    handleLoginForm
}