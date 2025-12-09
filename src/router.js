import express from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';

import * as shop from './shop.js';

const router = express.Router();
export default router;

const upload = multer({ dest: shop.UPLOADS_FOLDER })

// Main page filter and pagination
router.get('/', async (req, res) => {
    
    let { page = 1, search = "", category = "" } = req.query; // Read GET filters
    page = parseInt(page);

    const perPage = 6;

    let allClothes = await shop.getClothes(); // Obtain all clothes

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

router.post('/clothe/new', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, size, category } = req.body;
        // Validate the size depending on the category
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
        // If its not a shoe → normal size
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

        // Empty info
        if (!name || !description || !price || !category) {
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
            return res.status(400).render('error', {
                mensaje: 'El precio debe ser un número mayor que 0.',
                urlBoton: '/new_clothe_form',
                textoBoton: 'Corregir datos'
            });
        }

        // 3. Duplicate name
        const clothes = await shop.getClothes();
        const alreadyExists = clothes.find(c => c.name === name);

        if (alreadyExists) {
            return res.status(400).render('error', {
                mensaje: 'Ya existe una prenda con ese nombre. Elige otro diferente.',
                urlBoton: '/new_clothe_form',
                textoBoton: 'Volver al formulario'
            });
        }
n
        let clothe = {
            name,
            description,
            price: priceNumber,
            size: category === "sneakers" ? sizeZapatilla : size,
            category,
            reviewsCount: 0,
            reviews: []
        };

        if (req.file) {
            clothe.imageFilename = req.file.filename;
        }

        return res.render('confirm_new_clothe', { clothe });

    } catch (err) {
        console.error('Error al crear la prenda:', err);

        return res.status(500).render('error', {
            mensaje: 'Ha ocurrido un error al guardar la prenda. Inténtalo de nuevo más tarde.',
            urlBoton: '/',
            textoBoton: 'Volver a la tienda'
        });
    }
});

router.post('/clothe/new/confirm', async (req, res) => {
    try {
        const { name, description, price, size, category, imageFilename } = req.body;

        const priceNumber = Number(price);

        let clothe = {
            name,
            description,
            price: priceNumber,
            size,
            category,
            reviewsCount: 0,
            reviews: []
        };

        if (imageFilename) {
            clothe.imageFilename = imageFilename;
        }

        await shop.addClothe(clothe);

        return res.render('saved_post', { _id: clothe._id.toString() });

    } catch (err) {
        console.error('Error al confirmar la prenda:', err);
        return res.status(500).render('error', {
            mensaje: 'Ha ocurrido un error al guardar la prenda. Inténtalo de nuevo más tarde.',
            urlBoton: '/',
            textoBoton: 'Volver a la tienda'
        });
    }
});

// Route to show the edition form
router.get('/clothe/:id/edit', async (req, res) => {
    try {
        let clothe = await shop.getClothe(req.params.id);
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
        const clothes = await shop.getClothes();
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
            const existingClothe = await shop.getClothe(id);
            if (existingClothe && existingClothe.imageFilename) {
                await fs.rm(shop.UPLOADS_FOLDER + '/' + existingClothe.imageFilename);
            }
            updateData.imageFilename = req.file.filename;
        }

        // update the database
        await shop.updateClothe(id, updateData);

        res.render('saved_edit', { _id: id });

    } catch (err) {
        console.error('Error al editar la prenda:', err);
        return res.status(500).render('error', {
            mensaje: 'Ha ocurrido un error al editar la prenda. Inténtalo de nuevo más tarde.',
            urlBoton: '/',
            textoBoton: 'Volver a la tienda'
        });
    }
});

router.get('/clothe/:id', async (req, res) => {
    let clothe = await shop.getClothe(req.params.id);
    res.render('product_detail', { clothe });
});

// Show the confirm delete view
router.get('/clothe/:id/confirm-delete', async (req, res) => {
    let clothe = await shop.getClothe(req.params.id);

    if (!clothe) {
        return res.status(404).render('error', {
            mensaje: 'No se encontró la prenda.',
            urlBoton: '/',
            textoBoton: 'Volver al inicio'
        });
    }

    res.render('confirm_delete', { clothe });
});

// Delete clothe (after confirm)
router.post('/clothe/:id/delete', async (req, res) => {

    let clothe = await shop.deleteClothe(req.params.id);

    if (clothe && clothe.value && clothe.value.imageFilename) {
        await fs.rm(shop.UPLOADS_FOLDER + '/' + clothe.value.imageFilename);
    }

    return res.redirect('/');
});

router.get('/new_clothe_form', (req, res) => {
    res.render('new_clothe_form');
});

router.get('/clothe/:id/image', async (req, res) => {
    let clothe = await shop.getClothe(req.params.id);
    res.download(shop.UPLOADS_FOLDER + '/' + clothe.imageFilename);
});

router.get('/clothe/:id/review/:idReview/delete', async (req, res) => {
    await shop.deleteReview(req.params.id, Number(req.params.idReview));
    console.log('review eliminada')
    res.redirect(req.get("Referer") || '/');
})

router.post('/clothe/:id/review/new', async (req, res) => {
    try {
        const { user, title, review, reviewId, formSource } = req.body;
        const clotheId = req.params.id;

        
        //Choose where to come back if it fails
        let backUrl = `/clothe/${clotheId}`;
        if (formSource === 'edit_review' && reviewId) {
            backUrl = `/clothe/${clotheId}/review/${reviewId}/edit`;
        }

        // VALIDATIONS
        if (!user || !title || !review) {
            return res.status(400).render('error', {
                mensaje: 'Todos los campos de la reseña son obligatorios (usuario, título y texto).',
                urlBoton: backUrl,
                textoBoton: 'Volver al formulario'
            });
        }

        if (user.length < 3 || user.length > 50) {
            return res.status(400).render('error', {
                mensaje: 'El nombre de usuario debe tener entre 3 y 50 caracteres.',
                urlBoton: backUrl,
                textoBoton: 'Corregir usuario'
            });
        }

        if (title.length < 3 || title.length > 100) {
            return res.status(400).render('error', {
                mensaje: 'El título debe tener entre 3 y 100 caracteres.',
                urlBoton: backUrl,
                textoBoton: 'Corregir título'
            });
        }

        if (review.length < 10 || review.length > 500) {
            return res.status(400).render('error', {
                mensaje: 'La reseña debe tener entre 10 y 500 caracteres.',
                urlBoton: backUrl,
                textoBoton: 'Corregir reseña'
            });
        }

        //If everythings ok we create/change the review
        await shop.addReview(user, title, review, clotheId, reviewId);

        console.log('Review añadida/actualizada, usuario:', user, 'titulo:', title);
        return res.redirect('/clothe/' + clotheId);

    } catch (err) {
        console.error('Error al guardar la reseña:', err);
        return res.status(500).render('error', {
            mensaje: 'Ha ocurrido un error al guardar la reseña. Inténtalo de nuevo más tarde.',
            urlBoton: '/clothe/' + req.params.id,
            textoBoton: 'Volver al producto'
        });
    }
});

router.get('/clothe/:id/review/:idReview/edit', async (req,res) => {
    let clothe = await shop.getClothe(req.params.id);
    
    let review = clothe.reviews.find(r => r.id === Number(req.params.idReview) )
    return res.render('edit_review', {clothe, review})
})
