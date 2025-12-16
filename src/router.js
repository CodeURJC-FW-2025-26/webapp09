import express from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';

import * as shop from './shop.js';

const router = express.Router();
export default router;

const upload = multer({ dest: shop.UPLOADS_FOLDER })

// main page

router.get('/', async (req, res) => {
    let { search = "", category = "" } = req.query;     // receives the parameters of the URL

    const perPage = 6;

    let allClothes = await shop.getClothes();   // charges the products

    if (search) {
        const s = search.toLowerCase();
        allClothes = allClothes.filter(c => c.name.toLowerCase().includes(s));
    }

    if (category) {
        allClothes = allClothes.filter(c => c.category === category);
    }

    const clothes = allClothes.slice(0, perPage);   // the first 6 products

    res.render('index', {
        clothes,
        search,
        category
    });
});

// Infinite scroll
router.get('/loadMoreClothes', async (req, res) => {

    let { from, to, search = "", category = "" } = req.query;

    from = parseInt(from);      // Converts the values from string to number
    to = parseInt(to);

    let allClothes = await shop.getClothes();   // fetches the products

    if (search) {
        const s = search.toLowerCase();
        allClothes = allClothes.filter(c => c.name.toLowerCase().includes(s));
    }

    if (category) {
        allClothes = allClothes.filter(c => c.category === category);
    }

    const clothes = allClothes.slice(from, to);     // the next "block" of clothes

    if (clothes.length === 0) {
        return res.send("");
    }

    res.render('clothes', { clothes });

});


router.post('/clothe/new', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, size, category } = req.body;
    const sizeSneakers = req.body.sizeSneakers;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Debes completar todos los campos obligatorios." });
    }

    if (category === "sneakers") {
      if (!sizeSneakers || sizeSneakers.trim() === "") {
        return res.status(400).json({ message: "Si el producto es una zapatilla, debes indicar la talla numérica." });
      }

      if (size && size.trim() !== "") {
        return res.status(400).json({ message: "Las zapatillas no pueden tener talla de camiseta/vestido/pantalón." });
      }
    } else {
      if (!size || size.trim() === "") {
        return res.status(400).json({ message: "Debes seleccionar una talla de camiseta/vestido/pantalón." });
      }

      if (sizeSneakers && sizeSneakers.trim() !== "") {
        return res.status(400).json({ message: "Este tipo de producto no puede tener talla numérica." });
      }
    }

    if (description.length < 10 || description.length > 250) {
      return res.status(400).json({ message: "La descripción debe tener entre 10 y 250 caracteres." });
    }

    const priceNumber = Number(price);
    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      return res.status(400).json({ message: "El precio debe ser un número mayor que 0." });
    }

    const clothes = await shop.getClothes();
    const alreadyExists = clothes.find(c => c.name === name);

    if (alreadyExists) {
      return res.status(400).json({ field: "name", message: "Ya existe una prenda con ese nombre. Elige otro diferente." });
    }

    if (!req.file) {
        return res.status(400).json({ message: "Debes subir una imagen."});
    }

    let clothe = {
      name,
      description,
      price: priceNumber,
      size: category === "sneakers" ? sizeSneakers : size,
      category,
      reviewsCount: 0,
      reviews: []
    };

    if (req.file) {
      clothe.imageFilename = req.file.filename;
    }

    await shop.addClothe(clothe);

    res.json({
      ok: true,
      id: clothe._id.toString()
    });

  } catch (err) {
    console.error('Error al crear la prenda:', err);
    return res.status(500).json({ message: "Ha ocurrido un error al guardar la prenda. Inténtalo de nuevo más tarde." });
  }
});

// Route to show the edition form
router.get('/clothe/:id/edit', async (req, res) => {
    try {
        let clothe = await shop.getClothe(req.params.id);
        if (!clothe) {
            return res.status(404).json({ message: "Prenda no encontrada." })
        }
        
        // Prepare the data for the radio buttons
        clothe[clothe.category] = true; // to mark the correct radio button
        clothe[clothe.size] = true; // to mark the radio button for the correct size
        
        res.render('new_clothe_form', { clothe });
    } catch (err) {
        console.error('Error al cargar prenda para editar:', err);
        return res.status(500).json({ message: "Error al cargar la prenda para editar." })
    }
});

// Route to process the edition of the piece of cloathing
router.post('/clothe/:id/edit', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, size, category } = req.body;
        const sizeSneakers = req.body.sizeSneakers;
        const id = req.params.id;
        const removeImage = req.body.removeImage === "true";
        if (category === "sneakers") {
            if (!sizeSneakers || sizeSneakers.trim() === "") {
                return res.status(400).json({ message: "Si el producto es una zapatilla, debes indicar la talla numérica." });
            }

            if (size && size.trim() !== "") {
                return res.status(400).json({ message: "Las zapatillas no pueden tener talla de camiseta/vestido/pantalón." });
            }
        } else {
            if (!size || size.trim() === "") {
                return res.status(400).json({ message: "Debes seleccionar una talla de camiseta/vestido/pantalón." });
            }

            if (sizeSneakers && sizeSneakers.trim() !== "") {
                return res.status(400).json({ message: "Este tipo de producto no puede tener talla numérica." });
            }
        }

        if (description.length < 10 || description.length > 250) {
            return res.status(400).json({ message: "La descripción debe tener entre 10 y 250 caracteres." });
        }

        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: "Debes completar todos los campos obligatorios." });
        }

        const priceNumber = Number(price);
        if (Number.isNaN(priceNumber) || priceNumber <= 0) {
            return res.status(400).json({ message: "El precio debe ser un número mayor que 0."});
        }

        const clothes = await shop.getClothes();
        const alreadyExists = clothes.find(c => c.name === name && c._id.toString() !== id);

        if (alreadyExists) {
            return res.status(400).json({ field: "name", message: "Ya existe otra prenda con ese nombre. Elige otro diferente." });
        }

        const updateData = {
            name,
            description,
            price: priceNumber,
            size: category === "sneakers" ? sizeSneakers : size,
            category
        };
        const existingClothe = await shop.getClothe(id);

        if (removeImage && existingClothe && existingClothe.imageFilename) {
            await fs.rm(shop.UPLOADS_FOLDER + '/' + existingClothe.imageFilename);
            updateData.imageFilename = null;
        }
        if (req.file) {
            const existingClothe = await shop.getClothe(id);
            if (existingClothe && existingClothe.imageFilename) {
                await fs.rm(shop.UPLOADS_FOLDER + '/' + existingClothe.imageFilename);
            }
            updateData.imageFilename = req.file.filename;
        }

        await shop.updateClothe(id, updateData);

        res.json({
            ok: true,
            id: id
        });

    } catch (err) {
        console.error('Error al editar la prenda:', err);
        return res.status(500).json({ message: "Ha ocurrido un error al editar la prenda. Inténtalo de nuevo más tarde." });
    }
});


router.get('/clothe/:id', async (req, res) => {
    let clothe = null;
    if (!req.params.id || typeof req.params.id !== "string" || req.params.id.length !== 24) {
        console.warn(`Trying to fetch a clothe with a wrong formatted ID: ${req.params.id}`);
    } else {
        clothe = await shop.getClothe(req.params.id);
    }
    res.render('product_detail', { clothe });
});

// Show the confirm delete view
router.get('/clothe/:id/confirm-delete', async (req, res) => {
    let clothe = await shop.getClothe(req.params.id);

    if (!clothe) {
        return res.status(404).json({ message: "No se encontró la prenda." });
    }

    res.render('confirm_delete', { clothe });
});

// Delete clothe (after confirm)
router.post('/clothe/:id/delete', async (req, res) => {

    let clothe = await shop.deleteClothe(req.params.id);

    if (clothe && clothe.value && clothe.value.imageFilename) {
        await fs.rm(shop.UPLOADS_FOLDER + '/' + clothe.value.imageFilename);
    }

    res.redirect('/');
});

router.get('/new_clothe_form', (req, res) => {
    res.render('new_clothe_form');
});

router.get('/clothe/:id/image', async (req, res) => {
    let clothe = await shop.getClothe(req.params.id);
    res.download(shop.UPLOADS_FOLDER + '/' + clothe.imageFilename);
});

router.post('/clothe/:id/review/:idReview/delete', async (req, res) => {
    await shop.deleteReview(req.params.id, Number(req.params.idReview));
    res.status(200).json({
        id:req.params.idReview
    })

    console.log('review eliminada')
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
        return res.redirect(`/clothe/${clotheId}`);

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

router.get('/validateName', async (req,res) => {
    return res.json({ exists: false });
})