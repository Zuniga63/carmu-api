import { Router } from 'express';
import { isAuthenticated, signin, signup } from 'src/controllers/Auth.controller';
import userAuth from 'src/middleware/UserAuth';

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

export default router;
