import express from 'express';
import authentication from '../../auth/authentication';

const router = express.Router();

router.use(authentication);

router.get('/', (req, res) => {
  console.log(req);
  res.json({text: 'hello'})
})

export default router;