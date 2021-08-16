import express from 'express';
import auth from './auth';
import profile from './profile';
import messaging from './messaging';

const router = express.Router();

/**
 * @openapi
 * definitions:
 *  BadRequestResponse:
 *    type: object
 *    properties:
 *      message:
 *        type: string
 * tags:
 *  - name: Authentication
 *    description: All routes concerning auth.
 *  - name: Messaging
 *    description: All routes concerning messaging
 */

router.use('/auth', auth);
router.use('/profile', profile);
router.use('/message', messaging);

export default router;