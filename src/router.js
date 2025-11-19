import express from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';

import * as board from './board.js';

const router = express.Router();
export default router;

const upload = multer({ dest: board.UPLOADS_FOLDER })

// Old main page filter and pagination

// router.get('/', async (req, res) => {
    // let page = req.query.page || 1;
    // page = Numer(page);

    // let search = req.query.search || "";
    // let category = req.query.category || "";

    // const perPage = 6;

    // let allClothes = await.board.getClothes();

    // if (search !== "") {
        // let searchLower = search.toLowerCase();

        // let filtered = [];
        // for (let c of allClothes) {
            // if (c.name.toLowerCase().indexOf(searchLower) !== -1) {
                // filtered.push(c);
            // }
        // }
        // allClothes = filtered;
    // }

    // if (category !== "") {
        // let filtered = [];
        // for (let c of allClothes) {
            // if (c.category === category) {
                // filtered.push(c);
            // }
        // }
        // allClothes = filtered;
    // }

    // let totalPages = allClothes.lenght / perPage;
    // if (totalPages % 1 !== 0) {                              // If it's not integer
        // totalPages = (totalPages - (totalPages $ 1)) + 1;    // Round upwards
    // }

    // let clothes = [];
    // let start = (page - 1) * perPage;
    // let end = start + perPage;

    // for (let i = start; i < end && i < allClothes.lenght; i++) {
        // clothes.push(allClothes[i]);
    // }

    // let pages = [];
    // for (let i = 1; i <= totalPages; i++) {
        // pages.push({
            // number: i,
            // isCurrent: (i === page)
        // })
    // }

    // res.render('index', {
        // clothes,
        // currentPage = page,
        // totalPages,
        // pages,
        // search,
        // category,
        // hasPrev: page > 1,
        // hasNext: page < totalPages,
        // prevPage: page - 1,
        // nextPage: page + 1
    // })

// });

// Main page filter and pagination
router.get('/', async (req, res) => {
    
    let { page = 1, search = "", category = "" } = req.query; // Read GET filters
    page = parseInt(page);

    const perPage = 6;

    let allClothes = await board.getClothes(); // Obtain all clothes

    if (search) {                                           // Text filter
        const searchLower = search.toLowerCase();
        allClothes = allClothes.filter(c =>
            c.name.toLowerCase().includes(searchLower)
        );
    }

    if (category) {                                                     // Category filter
        allClothes = allClothes.filter(c => c.category === category);
    }

    const totalPages = Math.ceil(allClothes.length / perPage);          // Pages count rounded to the nearest integer
    const start = (page - 1) * perPage;
    const clothes = allClothes.slice(start, start + perPage);           // Array with clothes per page

    // Pagination buttoms with all pages
    const pages = Array.from({ length: totalPages }, (_, i) => ({       // Array with totalPages elems
        number: i + 1,                                                  // Pages start on 1
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
    // console.log('BODY:', req.body);
    // console.log('FILE:', req.file);
    try {
        const { name, description, price, size, category } = req.body;
<<<<<<< HEAD
        // Validate the size depending on the category
=======
        // Validar tallas según categoría
>>>>>>> 27ddcbd35066ddcf411176041d468e2e78987219
        const sizeZapatilla = req.body.sizeZapatilla;
        if (category === "sneakers") {
        if (!sizeZapatilla || sizeZapatilla.trim() === "") {
        return res.status(400).render('error', {
            mensaje: 'Si el producto es una zapatilla, debes indicar la talla numérica.',
            urlBoton: '/new_clothe_form',
            textoBoton: 'Volver al formulario'
                });
         }
        }
<<<<<<< HEAD
        // If its not a shoe → normal size
=======
        // Si NO es zapato → size normal obligatoria
>>>>>>> 27ddcbd35066ddcf411176041d468e2e78987219
        if (category !== "sneakers") {
        if (!size || size.trim() === "") {
        return res.status(400).render('error', {
            mensaje: 'Debes seleccionar una talla de camiseta/vestido/pantalón.',
            urlBoton: '/new_clothe_form',
            textoBoton: 'Volver al formulario'
                });
            }
        }
        if (description.length < 10 || description.length > 250) {
            return res.status(400).render('error', {
                mensaje: 'La descripción debe tener entre 10 y 250 caracteres.',
                urlBoton: '/new_clothe_form',
                textoBoton: 'Corregir descripción'
            });
        }


        if (description.length < 10 || description.length > 250) {
            return res.status(400).render('error', {
                mensaje: 'La descripción debe tener entre 10 y 250 caracteres.',
                urlBoton: '/new_clothe_form',
                textoBoton: 'Corregir descripción'
            });
        }

        // Empty info
        if (!name || !description || !price || !category) {
            return res.status(400).render('error', {
             mensaje: 'Debes completar todos los campos obligatorios.',
            urlBoton: '/',
            textoBoton: 'Volver al formulario'
        });
}
            // Delete items image if exists (idk)
            // if (req.file) await fs.rm(req.file.path);


        // 2. Incorrect price (not numeric or below 0)
        const priceNumber = Number(price);
        //Nan = not a number
        if (Number.isNaN(priceNumber) || priceNumber <= 0) {
            // if (req.file) await fs.rm(req.file.path);

            return res.status(400).render('error', {
                mensaje: 'El precio debe ser un número mayor que 0.',
                urlBoton: '/new_clothe_form',
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
                urlBoton: '/new_clothe_form',
                textoBoton: 'Volver al formulario'
            });
        }

        // 4. If its everything ok, we create the clothe in the bd
        let clothe = {
            name,
            description,
            price: priceNumber,
            size: category === "sneakers" ? sizeZapatilla : size,
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

<<<<<<< HEAD
// Route to show the edition form
router.get('/clothe/:id/edit', async (req, res) => {
    try {
        let clothe = await board.getClothe(req.params.id);
        if (!clothe) {
            return res.status(404).render('error', {
                mensaje: 'Prenda no encontrada.',
                urlBoton: '/',
                textoBoton: 'Volver a la tienda'
            });
        }
        
        // Prepare the data for the radio buttons
        clothe[clothe.category] = true; // to mark the correct radio button
        clothe[clothe.size] = true; // to mark the radio button for the correct size
        
        res.render('new_clothe_form', { clothe });
    } catch (err) {
        console.error('Error al cargar prenda para editar:', err);
        return res.status(500).render('error', {
            mensaje: 'Error al cargar la prenda para editar.',
            urlBoton: '/',
            textoBoton: 'Volver a la tienda'
        });
    }
});

// Route to process the edition of the piece of cloathing
router.post('/clothe/:id/edit', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, size, category } = req.body;
        const sizeZapatilla = req.body.sizeZapatilla;
        const id = req.params.id;

        // Validations (The sames as in crear)
        if (category === "sneakers") {
            if (!sizeZapatilla || sizeZapatilla.trim() === "") {
                return res.status(400).render('error', {
                    mensaje: 'Si el producto es una zapatilla, debes indicar la talla numérica.',
                    urlBoton: `/clothe/${id}/edit`,
                    textoBoton: 'Volver al formulario'
                });
            }
        }

        if (category !== "sneakers") {
            if (!size || size.trim() === "") {
                return res.status(400).render('error', {
                    mensaje: 'Debes seleccionar una talla de camiseta/vestido/pantalón.',
                    urlBoton: `/clothe/${id}/edit`,
                    textoBoton: 'Volver al formulario'
                });
            }
        }

        if (description.length < 10 || description.length > 250) {
            return res.status(400).render('error', {
                mensaje: 'La descripción debe tener entre 10 y 250 caracteres.',
                urlBoton: `/clothe/${id}/edit`,
                textoBoton: 'Corregir descripción'
            });
        }

        if (!name || !description || !price || !category) {
            return res.status(400).render('error', {
                mensaje: 'Debes completar todos los campos obligatorios.',
                urlBoton: `/clothe/${id}/edit`,
                textoBoton: 'Volver al formulario'
            });
        }

        const priceNumber = Number(price);
        if (Number.isNaN(priceNumber) || priceNumber <= 0) {
            return res.status(400).render('error', {
                mensaje: 'El precio debe ser un número mayor que 0.',
                urlBoton: `/clothe/${id}/edit`,
                textoBoton: 'Corregir datos'
            });
        }

        // Verify duplicates (excluding the actual piece of cloathing)
        const clothes = await board.getClothes();
        const alreadyExists = clothes.find(c => c.name === name && c._id.toString() !== id);

        if (alreadyExists) {
            return res.status(400).render('error', {
                mensaje: 'Ya existe otra prenda con ese nombre. Elige otro diferente.',
                urlBoton: `/clothe/${id}/edit`,
                textoBoton: 'Volver al formulario'
            });
        }

        // Prepare the data to update
        const updateData = {
            name,
            description,
            price: priceNumber,
            size: category === "sneakers" ? sizeZapatilla : size,
            category
        };

        // if there is a new image, update filename
        if (req.file) {
            // Delete previous image if it exist
            const existingClothe = await board.getClothe(id);
            if (existingClothe && existingClothe.imageFilename) {
                await fs.rm(board.UPLOADS_FOLDER + '/' + existingClothe.imageFilename);
            }
            updateData.imageFilename = req.file.filename;
        }

        // update the database
        await board.updateClothe(id, updateData);

        res.redirect(`/clothe/${id}`);

    } catch (err) {
        console.error('Error al editar la prenda:', err);
        return res.status(500).render('error', {
            mensaje: 'Ha ocurrido un error al editar la prenda. Inténtalo de nuevo más tarde.',
            urlBoton: '/',
            textoBoton: 'Volver a la tienda'
        });
    }
});

=======
>>>>>>> 27ddcbd35066ddcf411176041d468e2e78987219
router.get('/clothe/:id', async (req, res) => {
    let clothe = await board.getClothe(req.params.id);
    // console.log("CLOTHE: ", clothe);
    // console.log("ID recibido: ", req.params.id);
    res.render('product_detail', { clothe });
});

router.get('/clothe/:id/delete', async (req, res) => {

    let clothe = await board.deleteClothe(req.params.id);

    if (clothe && clothe.imageFilename) {
        await fs.rm(board.UPLOADS_FOLDER + '/' + clothe.imageFilename);
    }

    return res.redirect('/');
});

router.get('/new_clothe_form', (req, res) => {
    res.render('new_clothe_form');
<<<<<<< HEAD
    // Express will search views/Formulario2.html
=======
    // Express buscará views/Formulario2.html
>>>>>>> 27ddcbd35066ddcf411176041d468e2e78987219
});

router.get('/clothe/:id/image', async (req, res) => {

    let clothe = await board.getClothe(req.params.id);


    res.download(board.UPLOADS_FOLDER + '/' + clothe.imageFilename);

});

router.get('/clothe/:id/review/:idReview/delete', async (req, res) => {
    await board.deleteReview(req.params.id, Number(req.params.idReview));
    console.log('review eliminada')
    res.redirect(req.get("Referer") || '/');
})

router.post('/clothe/:id/review/new', async (req,res) =>{
    await board.addReview(req.body.user, req.body.title, req.body.review, req.params.id, req.body.reviewId); 
    console.log('Review añadida, usuario:',req.body.user, 'titulo', req.body.titulo);
    return res.redirect('/clothe/' + req.params.id);
})

router.get('/clothe/:id/review/:idReview/edit', async (req,res) => {
    let clothe = await board.getClothe(req.params.id);
    
    let review = clothe.reviews.find(r => r.id === Number(req.params.idReview) )
    return res.render('edit_review', {clothe, review})
})