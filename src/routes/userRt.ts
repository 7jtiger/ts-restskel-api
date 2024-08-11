import { Router } from "express";
import * as userCtl from '../controllers/userCtl';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/v01/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', userCtl.login);
router.get('/user/content', authenticateToken, userCtl.login);
// 다른 사용자 관련 라우트 추가

export default router;