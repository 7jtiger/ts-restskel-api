import { Router } from "express";
import * as createCtl from '../controllers/createCtl';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 생성 관련 라우트 추가
// router.post('/some-create-route', authenticateToken, createCtl.someCreateFunction);
/**
 * @swagger
 * /api/v01/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/users', authenticateToken, createCtl.createUser);


router.post('/content', authenticateToken, createCtl.createContent);

export default router;