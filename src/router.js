import express from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';

import * as board from './board.js';

const router = express.Router();
export default router;

const upload = multer({ dest: board.UPLOADS_FOLDER })

router.get('/', async (req, res) => {
    let { page = 1, search = "", category = "" } = req.query;
    page = parseInt(page);

    const perPage = 6;

    let allClothes = await board.getClothes();

    if (search) {
        const searchLower = search.toLowerCase();
        allClothes = allClothes.filter(c =>
            c.name.toLowerCase().includes(searchLower)
        );
    }

    if (category) {
        allClothes = allClothes.filter(c => c.category === category);
    }

    const totalPages = Math.ceil(allClothes.length / perPage);
    const start = (page - 1) * perPage;
    const clothes = allClothes.slice(start, start + perPage);


    const pages = Array.from({ length: totalPages }, (_, i) => ({
        number: i + 1,
        isCurrent: (i + 1) === page
    }));

    res.render('index', {
        clothes,
        currentPage: page,
        totalPages,
        pages,
        search,
        category,
        hasPrev: page > 1,
        hasNext: page < totalPages,
        prevPage: page - 1,
        nextPage: page + 1
    });
});


// Old post
// router.post('/clothe/new', upload.single('image'), async (req, res) => {

//     let clothe = {
//         name: req.body.name,
//         description: req.body.description,
//         price: req.body.price,
//         size: req.body.size,
//         category: req.body.category,
//         reviews: [
//         ]
//     };

//     await board.addClothe(clothe);

//     res.render('saved_clothe', { _id: clothe._id.toString() });

// });


router.post('/clothe/new', upload.single('image'), async (req, res) => {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    try {
        const { name, description, price, size, category } = req.body;

        if (description.length < 10 || description.length > 250) {
            return res.status(400).render('error', {
                mensaje: 'La descripción debe tener entre 10 y 250 caracteres.',
                urlBoton: '/Formulario2',
                textoBoton: 'Corregir descripción'
            });
        }

        // Empty info
        if (!name || !description || !price || !size || !category) {
            // Delete items image if exists (idk)
            // if (req.file) await fs.rm(req.file.path);

            return res.status(400).render('error', {
                mensaje: 'Debes completar todos los campos obligatorios.',
                urlBoton: '/',
                textoBoton: 'Volver al formulario'
            });
        }


        // 2. Incorrect price (not numeric or below 0)
        const priceNumber = Number(price);
        //Nan = not a number
        if (Number.isNaN(priceNumber) || priceNumber <= 0) {
            // if (req.file) await fs.rm(req.file.path);

            return res.status(400).render('error', {
                mensaje: 'El precio debe ser un número mayor que 0.',
                urlBoton: '/Formulario2',
                textoBoton: 'Corregir datos'
            });
        }

        // 3. Duplicate name
        // we use board.getClothes() and we search for name
        const clothes = await board.getClothes();
        const alreadyExists = clothes.find(c => c.name === name);

        if (alreadyExists) {
            // if (req.file) await fs.rm(req.file.path);

            return res.status(400).render('error', {
                mensaje: 'Ya existe una prenda con ese nombre. Elige otro diferente.',
                urlBoton: '/Formulario2',
                textoBoton: 'Volver al formulario'
            });
        }

        // 4. If its everything ok, we create the clothe in the bd
        let clothe = {
            name,
            description,
            price: priceNumber,
            size,
            category,
            reviews: []
        };

        // Idk if i need to save the clothe and img name
        if (req.file) {
            clothe.imageFilename = req.file.filename;
        }

        await board.addClothe(clothe);
        //It was saved_clothe before
        res.render('saved_post', { _id: clothe._id.toString() });

    } catch (err) {
        console.error('Error al crear la prenda:', err);

        // Generic error (for instance, error de BD)
        return res.status(500).render('error', {
            mensaje: 'Ha ocurrido un error al guardar la prenda. Inténtalo de nuevo más tarde.',
            urlBoton: '/',
            textoBoton: 'Volver a la tienda'
        });
    }
});

router.get('/clothe/:id', async (req, res) => {
    let clothe = await board.getClothe(req.params.id);
    console.log("CLOTHE: ", clothe);
    console.log("ID recibido: ", req.params.id);
    res.render('product_detail', { clothe });
});

router.get('/clothe/:id/delete', async (req, res) => {

    let clothe = await board.deleteClothe(req.params.id);

    if (clothe && clothe.imageFilename) {
        await fs.rm(board.UPLOADS_FOLDER + '/' + clothe.imageFilename);
    }

    res.render('deleted_clothe');
});

router.get('/Formulario2', (req, res) => {
    res.render('Formulario2');
    // Express buscará views/Formulario2.html
});

router.get('/clothe/:id/image', async (req, res) => {

    let clothe = await board.getClothe(req.params.id);


    res.download(board.UPLOADS_FOLDER + '/' + clothe.imageFilename);

});

