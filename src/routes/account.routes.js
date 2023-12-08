const router = require("express").Router();
const asyncHandler = require("../helpers/asyncHandler");
const accountController = require("../controllers/accountController");
/**
 * @swagger
 * tags:
 *   name: Account
 *   description: Account API
 * 
 * /v1/api/auth/login:
 *   post:
 *     summary: Login to system
 *     tags: 
 *       - Account
 *     description: Use to login to system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of user
 *                 example: user01@gmail.com
 *               pass:
 *                 type: string
 *                 description: Password of user
 *                 example: user01
 *     responses:
 *       '200':
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message
 *                   example: Login successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: Access token
 *                     refreshToken:
 *                       type: string
 *                       description: Refresh token
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 * 
 * /v1/api/auth/register:
 *   post:
 *     summary: Register new account
 *     tags:
 *       - Account
 *     description: Use to register new account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: Fullname of user
 *                 example: user01
 *               email:
 *                 type: string
 *                 description: Email of user
 *                 example: user01@gmail.com
 *               password:
 *                 type: string
 *                 description: Password of user
 *                 example: user01
 *     responses:
 *       '200':
 *         description: Register success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message
 *                   example: Register successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     newUser:
 *                       type: object
 *                       properties:
 *                         accountID:
 *                           type: integer
 *                           description: ID of account
 *                           example: 1
 *                         fullname:
 *                           type: string
 *                           description: Fullname of user
 *                           example: user01
 *                         email:
 *                           type: string
 *                           description: Email of user
 *                           example: user01@gmail.com
 *                         isAdmin:
 *                           type: integer
 *                           description: Is admin
 *                           example: 0
 *                         createdAt:
 *                           type: string
 *                           description: Create time
 *                           example: 2021-05-07T15:02:15.000Z
 *                         updatedAt:
 *                           type: string
 *                           description: Update time
 *                           example: 2021-05-07T15:02:15.000Z
 *                         refreshToken:
 *                           type: string
 *                           description: Refresh token
 *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                           description: Access token
 *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                         refreshToken:
 *                           type: string
 *                           description: Refresh token
 *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
//Hao ranh lam them phan nay
//TODO: add swagger for refreshToken, fix register response still have password
router.post("/login", asyncHandler(accountController.handleLogin));
router.post("/register", asyncHandler(accountController.handleRegister));
router.post(
  "/refreshToken",
  asyncHandler(accountController.refreshAccessToken)
);

module.exports = router;
