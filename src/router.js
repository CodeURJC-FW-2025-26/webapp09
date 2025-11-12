import express from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';

import * as board from './board.js';

const router = express.Router();
export default router;

const upload = multer({ dest: board.UPLOADS_FOLDER })

router.get('/', async (req, res) => {

    let clothes = await board.getClothes();

    res.render('index', { clothes });
});

router.post('/clothe/new', upload.single('image'), async (req, res) => {

    let clothe = {
        user: req.body.user,
        title: req.body.title,
        text: req.body.text,
        imageFilename: req.file?.filename
    };

    await board.addClothe(clothe);

    res.render('saved_clothe', { _id: clothe._id.toString() });

});

router.get('/clothe/:id', async (req, res) => {

    let clothe = await board.getClothe(req.params.id);

    res.render('show_clothe', { clothe });
});

router.get('/clothe/:id/delete', async (req, res) => {

    let clothe = await board.deleteClothe(req.params.id);

    if (clothe && clothe.imageFilename) {
        await fs.rm(board.UPLOADS_FOLDER + '/' + clothe.imageFilename);
    }

    res.render('deleted_clothe');
});

router.get('/clothe/:id/image', async (req, res) => {

    let clothe = await board.getClothe(req.params.id);

    res.download(board.UPLOADS_FOLDER + '/' + clothe.imageFilename);

});

