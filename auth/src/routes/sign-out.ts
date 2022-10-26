import express from 'express';

const router = express.Router();

router.post('/api/users/sign_out', (req, res) => {
  req.session = null;

  res.send({});
});

export { router as signOutRouter };
