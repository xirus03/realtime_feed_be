import { Router } from 'express';
import { 
    getall,
    getbyid,
    create,
    update,
    deleteuser,
    profile,
    findbyusernameoremail,
} from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/profile', authMiddleware, profile);
router.get('/search', authMiddleware, findbyusernameoremail); // example: /users/search?username=johndoe
router.get('/:id', getbyid);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteuser);
router.get('/', getall);

export default router;