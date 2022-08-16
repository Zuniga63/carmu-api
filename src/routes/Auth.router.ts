import { Router } from 'express';
import { signin, signup } from 'src/controllers/Auth.controller';

const router = Router();

/**
 * Route for register new user in local
 * @openapi
 * /auth/local/signup:
 *  post:
 *    tags:
 *      - Auth
 *    sumary: "Register new user"
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
 *    sumary: "Login the user with token"
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

export default router;
