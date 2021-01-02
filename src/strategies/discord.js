const passport = require('passport');
const DiscordStrategy = require('passport-discord');
const User = require('../database/schemas/User')

passport.serializeUser(( user, done ) => {
    done(null, user.discordId)
})

passport.deserializeUser(async ( discordId, done ) => {
    try { 
        const user = await User.findOne({ discordId });
        return user ? done(null,user) : done(null, null);
    }catch(err){
        console.log( err );
        done(err, null)
    }
});
passport.use(new DiscordStrategy({
    clientID: process.env.DASHBOARD_CLIENT_ID,
    clientSecret: process.env.DASHBOARD_CLIENT_SECRET,
    callbackURL: process.env.DASHBOARD_CALLBACK_URL,
    scope: ['identify', 'guilds', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
         const {
             id,
             username,
             discriminator,
             avatar,
             guilds,
             email
         } = profile;

         console.log(id, username, discriminator, avatar, guilds)
    try {
   
        const findUser = await User.findOneAndUpdate(
            {
                discordId: id,
            }, {
            discordTag: `${username}#${discriminator}`,
            avatar,
            guilds,
            email: email,
        }, {
            new: true
        });
        if (findUser) {
            console.log("User was found!");
            return done(null, findUser)
        } else {
            const newUser = await User.create({
                discordId: id,
                discordTag: `${username}#${discriminator}`,
                avatar,
                guilds,
            });
            return done(null, findUser)
        }
    } catch (err) {
        console.log(err)
        return done(err, null)
    }
}));