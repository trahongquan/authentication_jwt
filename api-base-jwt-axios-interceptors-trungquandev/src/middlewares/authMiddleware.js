import { StatusCodes } from 'http-status-codes';
import { ACCESS_TOKEN_SECRET_SIGNATURE, JwtProvider } from '~/providers/JwtProvider';

// Author: TrungQuanDev: https://youtube.com/@trungquandev
const isAuthorized = async (req, res, next) => {
    const accessTokenFromCookie = req.cookies?.accessToken
    console.log('accessTokenFromCookie: ', accessTokenFromCookie)
    console.log('------------------')

    if(!accessTokenFromCookie) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Unauthorized! (Token not found)'})
        return
    }

    const accessTokenFromHeader = req.headers.authorization
    console.log('accessTokenFromHeader: ' + accessTokenFromHeader)
    console.log('------------------')

    if(!accessTokenFromHeader) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Unauthorized! (Token not found)'})
        return
    }

    try {
        const accessTokenDecode = await JwtProvider.verifyToken(
            // accessTokenFromCookie,
            accessTokenFromHeader.substring('Bearer '.length),
            ACCESS_TOKEN_SECRET_SIGNATURE
        )

        req.jwtDecoded = accessTokenDecode

        console.log(accessTokenDecode);
        
        next()
    } catch (error) {
        console.log('Error from middleware', error.message);
        
        if(error.message?.includes('jwt expired')){
            // dùng mã GONE mã 410 để FE biết cần gọi api refresh Token
            res.status(StatusCodes.GONE).json({message: 'Need to refresh token'})
            return
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Unauthorized! (Please login!)'})
    }
}

export const authMiddleware = {
    isAuthorized
}