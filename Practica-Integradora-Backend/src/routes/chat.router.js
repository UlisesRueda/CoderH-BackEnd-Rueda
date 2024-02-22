import Express from "express";

const router = Express.Router();

router.get('/chat', (req, res) => {
    res.render('chat' , {
        style: '/css/style.css'
    })
})

export default router