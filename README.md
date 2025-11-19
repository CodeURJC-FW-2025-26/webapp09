# Clothes Catalog
---

# Website name: NOMORETRASH

## Team:
- Marcos Laorga Sagaseta de Ilurdoz | m.laorga.2024@alumnos.urjc.es | marcoslaorga and marcoslaorga2
- Ivo Hagemann Martínez | i.hagemann.2024@alumnos.urjc.es | IvoDev14
- Sergio Guindal Gómez | s.guindal.2024@alumnos.urjc.es | sguindal
- Javier Méndez Hernández | j.mendezh.2025@alumnos.urjc.es | dkode18

## Features:

### Main Entity
#### Product
#### Attributes
- ID: Unique product identifier
- Name: Product name
- Description: Product description
- Price: Product price
- Sizes: (S, M, L, XL)
- Category: (t-shirt, trouser, sneakers)

#### Secondary Entities
#### Review
#### Attributes
- review_id: unique identifier
- product_id: reference to the product
- user: user's name
- rating: product rating

# PRACTICE 1

## Main page

<img width="1919" height="1014" alt="image" src="https://github.com/user-attachments/assets/148facdd-1df8-4132-b342-b2dc3358f516" />


<img width="1919" height="1074" alt="image" src="https://github.com/user-attachments/assets/929a6d8c-f1ff-4b65-8496-79c1602c7025" />

## Product page:

<img width="1920" height="918" alt="image" src="https://github.com/user-attachments/assets/031c7a88-e55e-4af5-a9ac-67756dc4413c" />
<img width="1913" height="915" alt="image" src="https://github.com/user-attachments/assets/4acb5fdd-6e07-492e-b330-37c8634c4d33" />

## Add product page:

<img width="1917" height="910" alt="image" src="https://github.com/user-attachments/assets/7d1cd671-68de-45e8-a466-d84482e10941" />


- Marcos Laorga Sagaseta de Ilurdoz: I created the 'footer', which will be used across other pages. Additionally, I developed the 'main page', incorporating the 'header', which was created by someone else, and the 'footer' that I implemented. The search bar was implemented by Javier, while my work focused on the 'create new item' button and its associated elements. 
My five most important commits were:

  - 'footer-final': https://github.com/CodeURJC-FW-2025-26/webapp09/commit/ce5a0cb9de8c1c456cf3ffee7412ca4eb56fd62d
  - 'main_page first version': https://github.com/CodeURJC-FW-2025-26/webapp09/commit/8b518f27edb534ccc0d9db750f40c5f77cf067a6
  - 'main_page second version': https://github.com/CodeURJC-FW-2025-26/webapp09/commit/8bf26bd49dc777b48b595bdd8a86165743007d96
  - 'main_page third version': https://github.com/CodeURJC-FW-2025-26/webapp09/commit/8f3dbffcffea8549964873b87fd0026539b1e46e
  - 'main_page last version': https://github.com/CodeURJC-FW-2025-26/webapp09/commit/574e9970c203885778a61e9b702e79ba880b24b1

- Javier Méndez Hernández: I was the responsible for creating the header that had been implemented in all the pages. I helped to develope a search bar implemented in the main page. They were some mistakes made on the way, for example I had to delete the header.css and redo it all again.
  
  -  My 5 most important commits were
    -  "Implementación del header provisional": https://github.com/CodeURJC-FW-2025-26/webapp09/commit/0f25e26bb4d0ad285e6be439d86d0115169f0a0d
    -  "Header con bootstrap implementado": https://github.com/CodeURJC-FW-2025-26/webapp09/commit/63d95197b9753d8a5b2fc377c4aa98fdf7bf9ea2
    -  "Header con desplegable para moviles" https://github.com/CodeURJC-FW-2025-26/webapp09/commit/369f8757a1431a61437ce667bbe5b4f35c455b58
    -  "Implementacion final del header e implementación de barra de busqueda en main_page.html" https://github.com/CodeURJC-FW-2025-26/webapp09/commit/424b82f820ddaf1623b3f82db24482d99c9d3209
    -  "Eliminación del antiguo archivo css del header (header.css) https://github.com/CodeURJC-FW-2025-26/webapp09/commit/b1f674711e3e06c78b18cc0d10c371d32de14d7d".
    - Files I contributed:
      - header.html  
      - headerBs.css  
      - README.md  
      - main_page.html    

- Ivo Hagemann Martínez: I was responsible for creating the product page “product_detail.html” with its corresponding CSS file “product_detail.css”. On this page, I had to display in detail the main entity, Product, along with its respective attributes. In addition, I included a form to create a secondary entity, adapted from work done by another teammate. Finally, I added a section to display the secondary entities (reviews). I also included the header and footer made by two of my teammates. Due to an issue that arose in recent days, many of our latest commits seemed to be lost, and I was the one in charge of fixing it. When it happened again a few days later, I fixed it once more, created an extra branch as a backup, and investigated what had happened to prevent it from occurring again.

  - Most important commits:
    - "Añadido formulario a página de producto y reseñas además del header y el footer". Link: https://github.com/CodeURJC-FW-2025-26/webapp09/commit/42cb35a4185895d52db7a054bb8f0bf1530763a7  
    - "Actualización clothe_info añadido de fotos laterales y tallas disponibles". Link: https://github.com/CodeURJC-FW-2025-26/webapp09/commit/62bc4d10a450449b15501e61e9d592e94b9d5fcf  
    - "Cambio de la clothe page a bootstrap". Link: https://github.com/CodeURJC-FW-2025-26/webapp09/commit/3f1c3f8e2d0fb0cbb73202abf508039b47b116fc  
    - "Header añadido al clothe_info, reestructuración de clothe_info.html". Link: https://github.com/CodeURJC-FW-2025-26/webapp09/commit/f71ffbafbcefc52dfbcb3d5d927124d7e82ccefc  
    - "Imagen de zapatillas genéricas y página de producto básica". Link: https://github.com/CodeURJC-FW-2025-26/webapp09/commit/a4c6a802b1f84a00c78fe736bfa4e5ea294491dc  

  - Files I contributed:
    - product_detail.html  
    - product_detail.css  
    - README.md  
    - main_page.html  
    - formulario 1.html  

- Sergio Guindal Gómez: I was responsible for creating both of the forms that were implemented on the website. The first one is intended to be used by users to submit a resignation, and the second one is for us to add a new piece of clothing. I accidentally performed an unnecessary merge that almost cost us a lot of progress.

  - Most important commits:
    - "Añadir Formulario 1.html". Link: https://github.com/CodeURJC-FW-2025-26/webapp09/commit/a01abc66161f2470e4939c0228fea6db46051b26  
    - "Añadir Formulario 2.html". Link: https://github.com/CodeURJC-FW-2025-26/webapp09/commit/0670b8372f8f3f95f3a878203a54dc953cbed68b 
    - "añadir imagen". Link: https://github.com/CodeURJC-FW-2025-26/webapp09/commit/994a16b57067730655d2d40526f062c4588c2045  
    - "Actualizo los formularios". Link: https://github.com/CodeURJC-FW-2025-26/webapp09/commit/fd054ecb5833b71ca7543cfd04604d61921bf24a  
    - "formularios". Link: https://github.com/CodeURJC-FW-2025-26/webapp09/commit/54d0f6d1867237be6fbba9e7e5188ce3dbf3c304

  - Files I contributed: 
    - formulario 1.html
    - formulario2.html
    - README.MD

# PRACTICE 2

## Execution instructions

Requirements:
  - Node.js v22.21.0
  - MongoDB V8.2.1

To run the application, you have to go to the GitHub repository **Releases** section, and then go to 'Práctica 2' release. There, download the `.zip` file. Extract the `.zip` file to a folder of your choice. Open a terminal and go to your project folder:
$ cd ...

Install Node.js and MongoDB if you don't have them installed. You have to install Node.js in your terminal:
$ npm install

Then, run the application:
$ node src/app.js

You should read a message like this:
Web ready in `http://localhost:3000/`

Open your browser and go to `http://localhost:3000/`. The app should be running and ready to use.

## File description

  - CSS Files: These files are used to style the web application. They include header, footer and page specific styles:
    
      · `footer.css`
      · `header.css`
      · `main_page.css`
      · `product_detail.css`

  - `index.html`: This file is the main page of the web application. It provides the overall structure of the website, including the search bar, category buttons, product grid, and pagination controls. It also includes a button to add new products.

  - `confirm_delete.html`: Page to confirm deletion of an element (a product in our case). It shows the product name and image and provides two buttons: confirm delete and cancel/back.

  - `confirm_new_clothe.html`: This file confirms adding a new product. It displays all product details and ask for confirmation.

  - `deleted_post.html`: This page appears after a product has been deleted. It shows a confirmation message.

  - `edit_review.html`: It allows users to edit an existing product review. It loads the current review data into a form so the user can update it.

  - `error.html`: This page is shown whenever an error occurs. It displays an error message received from the server and a button that redirects the user back to the appropiate page.

  - `footer.html`: This file defines the footer of the website. It includes sections such as _About us_, _Help_ or _Customer Service_.

  - `header.html`: This is the header of the website. It contains the logo, navigation menu, user icon...

  - `new_clothe_form.html`: This page contains the form used to create a new product. User can write the name, price, description, category, size...

  - `product_detail.html`: This page shows users the details of a specific product: image, name, category, price, size and description. It also shows the reviews, with the options of delete or edit them.

  - `saved_post.html`: This page is shown only when a new product has been created. It confirms that the item is saved.

  - `app.js`: This file initilizes the Express server and configures the main settings.

  - `board.js`: It connects to the MongoDB server and create a reference to the clothes collection.

  - `load_data.js`: This file resets the application's data every time the server starts and then reload the initial data from `json.data`.

  - `router.js`: This file contains all the routes used by the application, like the main page pagination.
    
  - `data.json`: This file contains the initial product data loaded when the application starts. If the database is empty, the server reads this file and inserts its contents into MongoDB. Each product entry includes properties such as name, description, price, size, category, imageFilename, and an array of user reviews. The file serves as the initial data for both the main page and the product detail pages.

## Demonstration video

## Member participation

- Marcos Laorga Sagaseta de Ilurdoz: I have done everything related to the main page (`index.html`): implemented pagination, displayed database data paginated with 6 items per page, created buttons with links to go to the next and previous pages, also created the search bar, the buttons to access the categories, and participated in the implementation of Practice 1 at the beginning of Practice 2. I also created the `data.json` file and made modifications to the `main_page.css`. In the `README.md` file, I have defined the files and written the installation instructions for the program.

  These are the final commits:
  
  - 'main_page_fv': https://github.com/CodeURJC-FW-2025-26/webapp09/commit/447e7f6dedaf49ac0aa8f7e6a2257937b74a6141
  - 'Update `README.md`': https://github.com/CodeURJC-FW-2025-26/webapp09/commit/eaf93ddc6b064e00352d16170b1ceae946236766
 
  Files I contributed:

  - `data.json`
  - images folder
  - `main_page.css`
  - `app.js`
  - `board.js`
  - `load_data.js`
  - `router.js`
  - `main_page.js`
  - `index.html`
  - `README.md`

- Sergio Guindal Gomez: I have done everything related to the main form (new_clothe_form): i made the form functional so now it adds a new piece of cloathing to the data base everytime someone uses it, i have made sure that the category of the new prodcuts works correctly so when you search by category the new product is shown as well, and ive also implemented the function to edit clothes based on the same form, also created for this process the "saved_edit.html" page, i have also been responsible for the code having all the comments on english as well as making sure there wasnt any duplicated code.

  These are the final commits:
  
  - 'Un merge': https://github.com/CodeURJC-FW-2025-26/webapp09/commit/242962f971ffcac70d5b054687bfae25f428d20d
  - 'Update README.md': https://github.com/CodeURJC-FW-2025-26/webapp09/commit/eaf93ddc6b064e00352d16170b1ceae946236766
 
  Files I contributed:

  - data.json
  - board.js
  - router.js
  - new_clothe_form.html
  - saved_edit.html
  - producr_detail.html
  - README.md
 
-Javier Méndez Hernández: I've done the dinamic header and dinamic footer. I've created as well the confirmation pages for editing, deleting and creating a new element. I've modified some of the proyect's css and improved some of the views. One of the main things ive done is the managing of the errors that could happen in the form's data. The most tricky part by far was doing the confirmation pages because i had to put them between the data form and the inserts of that data in the database, those pages act kind of a "middleman" between the data input and the database management.

  These are the most important commits ive done:
  
  - "Implementacion de la pagina de confirmacion y edicion de enlaces de la pagina product_detail para acceder a dicha pagina": https://github.com/CodeURJC-FW-2025-26/webapp09/commit/a64b5e8e900434e185e5109ffc4e9fb3812e191c
  - "Edicion y mejora de las comprobaciones del router.post": https://github.com/CodeURJC-FW-2025-26/webapp09/commit/b7c08636eb27710966825470c6987c6b7c87ff28

  Files I contributed:

  - `data.json`
  - `router.js`
  - `new_clothe_form.html`
  - `saved_edit.html`
  - `confirm_delete.html`
  - `confirm_new_clothe.html`
  - `deleted_post.html`
  - `saved_post.html`
    
