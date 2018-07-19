/**
 * Token decoder
 */
import jwt from "jsonwebtoken";

async function generateTokens(userId, userModel, tokenModel, tokenSecret, refreshTokenSecret, tokenExpire, refreshTokenExpire) {
    const user = await userModel.findOne({ where: { id: userId } }, { raw: true });
    if (user) {
        const userToken = {
            token: jwt.sign({ id: userId }, tokenSecret, { expiresIn: tokenExpire }),
            refreshToken: jwt.sign({ id: userId }, refreshTokenSecret + user.password, { expiresIn: refreshTokenExpire })
        };
        const storedToken = tokenModel.create({
            user_id: userId,
            refresh_token: userToken.refreshToken
        });
        return userToken;
    } else {
        return {};
    }
}

async function getNewTokens(refreshToken, userModel, tokenModel, tokenSecret, refreshTokenSecret, tokenExpire, refreshTokenExpire) {
    let userId = -1;
    try {
        const { id } = jwt.decode(refreshToken);
        userId = id;
    } catch (err) {
        return {};
    }

    if (!userId) return {};

    const user = await userModel.findOne({ where: { id: userId } });
    if (!user) return {};

    const refreshKey = refreshTokenSecret + user.password;
    try {
        jwt.verify(refreshToken, refreshKey);
    } catch (err) {
        return {};
    }

    const newTokens = await generateTokens(userId, userModel, tokenModel, tokenSecret, refreshTokenSecret, tokenExpire, refreshTokenExpire);
    newTokens.user = user;
    return newTokens;
}

export default (opts) => {
    const { tokenSecret, refreshTokenSecret, userModel, tokenModel, tokenExpire, refreshTokenExpire } = opts;

    return async (req, res, next) => {

        /**
         * Attach helper function to req object
         */
        req.generateUserToken = async (userId) => {
            const userToken = await generateTokens(userId, userModel, tokenModel, tokenSecret, refreshTokenSecret, tokenExpire, refreshTokenExpire);
            return userToken;
        }
    
        req.invalidateAllToken = async (me) => {
            const oldTokenPromises = [];
            const tokens = await me.getTokens();
            if(tokens) {
                tokens.forEach((tk) => {
                    oldTokenPromises.push(tk.update({ used: 1 }));
                });
            }
            return await Promise.all(oldTokenPromises);
        }

        /**
         * Get headers data
         */
        const token = req.headers["x-access-token"];
        const refreshToken = req.headers["x-refresh-token"];

        if (token) {
            try {
                const { id } = jwt.verify(token, tokenSecret);
                const user = await userModel.findOne({ where: { id } });
                user.password = undefined;
                req.user = user;
            } catch (err) {
                if (err.name === "TokenExpiredError") {
                    const dbToken = await tokenModel.findOne({ where: { refresh_token: refreshToken } }, { raw: true });
                    if (dbToken) {
                        if (!dbToken.used) {
                            const newTokens = await getNewTokens(refreshToken, userModel, tokenModel, tokenSecret, refreshTokenSecret, tokenExpire, refreshTokenExpire);
                            if (newTokens.token && newTokens.refreshToken) {
                                res.set("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
                                res.set("x-access-token", newTokens.token);
                                res.set("x-refresh-token", newTokens.refreshToken);
                                newTokens.user.password = undefined;
                                req.user = newTokens.user;
                                dbToken.update({ used: 1 });
                            }
                        }
                    }
                }
            }
        }
        next();

    }

}