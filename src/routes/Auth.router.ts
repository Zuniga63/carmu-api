import { Router } from 'express';
import { isAuthenticated, signin, signup, updatePassword } from 'src/controllers/Auth.controller';
import userAuth from 'src/middleware/UserAuth';
import * as userController from 'src/controllers/User.controller';
import adminAuth from 'src/middleware/AdminAuth';

const router = Router();

/**
 * Route for register new user in local
 * @openapi
 * /auth/local/signup:
 *  post:
 *    tags:
 *      - Auth
 *    summary: "Register new user"
 *    description: This end point register a new user in local database
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/registerUser"
 *      required: true
 *    responses:
 *      '201':
 *        description: User data was store sucessfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/authResponse'
 *      '400':
 *        description: Las contraseñas no coinciden
 *      '422':
 *        description: Invalid Input
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/validationError'
 *
 */
router.route('/local/signup').post(signup);
/**
 * Route for auth user
 * @openapi
 * /auth/local/signin:
 *  post:
 *    tags:
 *      - Auth
 *    summary: "Login the user with token"
 *    description: This end point create a token for auth platform
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/loginUser"
 *      required: true
 *    responses:
 *      '200':
 *        description: User was login sucessfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/authResponse'
 *      '401':
 *        description: Credenciales invalidas
 */
router.route('/local/signin').post(signin);
/**
 * Get all categories sort by name
 * @openapi
 * /auth/local/is-authenticated:
 *  get:
 *    tags:
 *      - Auth
 *    summary: Get basic user data if the user is authenticated
 *    description: Get basic user data if the user is authenticated
 *    responses:
 *      '200':
 *        description: User is authenticated
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                ok:
 *                  type: boolean
 *                  example: true
 *                user:
 *                  $ref: '#/components/schemas/user'
 *      '401':
 *        description: only users authenticated can use this end point
 *    security:
 *      - bearerAuth: []
 */
router.route('/local/is-authenticated').get(userAuth, isAuthenticated);

/**
 * Route for auth user
 * @openapi
 * /auth/local/update-password:
 *  put:
 *    tags:
 *      - Auth
 *    summary: Update the user password
 *    description: This end point update the password of user.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/updatePassword"
 *      required: true
 *    responses:
 *      200:
 *        description: The password was updated succesfully
 *      400:
 *        description: The current password is wrong
 *      401:
 *        description: The user is not authenticated
 *      404:
 *        description: The user is not authenticated
 *      422:
 *        description: Validation error for new password o confirm password
 *    security:
 *      - bearerAuth: []
 */
router.route('/local/update-password').put(userAuth, updatePassword);

// --------------------------------------------------------------------------------------------------------------------
// ROUTES FOR ADMIN USERS
// --------------------------------------------------------------------------------------------------------------------
/**
 * @openapi
 * /auth/local/users:
 *  get:
 *    tags:
 *      - Auth
 *    summary: List of all users
 *    description: This end point return a list of all user register en the databse
 *    responses:
 *      200:
 *        description: List of all users sort by name
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                users:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/user'
 *      401:
 *        description: only admin users can acces this information
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/local/users').get(adminAuth, userController.list);

export default router;
