const express = require('express');
const app = express();
const db = require('./db');
//const sequelize = require('sequelize');
//const pg = require('pg');

app.use(express.urlencoded({ extended: false })); // set up middleware to use body.parser on the POST request (last part of Phase Four)

app.use((req, res, next) => {
    if(req.method === 'POST' && req.query._method){
        req.method = req.query._method;
    }
    next();
});

app.get('/', (req, res) => res.redirect('/bookmarks')); // redirect automatically to /bookmarks as the main page

app.post('/bookmarks', async (req, res, next) => { // Phase Four (Create a Bookmark)
    try {
        const bookmark = await db.Bookmarks.create(req.body);
        res.redirect(`/categories/${bookmark.category}`);
    }
    catch(error){
        next(error);
    }
})
// Phase Four: User can create a bookmark is placed within the main page (app.get(/bookmarks)) 

app.get('/bookmarks', async (req, res, next) => { // main page lists the sites + their categories, with a link to each category
    try{
        const bookmarks = await db.Bookmarks.findAll();
        //const bookmark = bookmarks.map(bookmark => `${bookmark.name} for ${bookmark.category}`); // could do this but meh
        const html = `
        <html>
            <body>
                <h1>ACME Bookmarks</h1>
                ${ bookmarks.map(bookmark => { 
                    return `<div> ${bookmark.name} for <a href='/categories/${bookmark.category}'>${bookmark.category} </a></div>` })
                    .join('')
                } 
                <p>
                <form method='POST'>
                    <input name='name' placeholder='name' />
                    <input name='category' placeholder='category' />
                    <button> Create New Bookmark </button>
                </form>
                </p>
            </body>
        </html>
        `;
        res.send(html)
    }
    catch(error){
        next(error);
    }
})

app.delete('/bookmarks/:id', async (req, res, next) => {
    try {
        const bookmark = await db.Bookmarks.findByPk(req.params.id);
        await bookmark.destroy();
        res.redirect(`/categories/${bookmark.category}`);
    }
    catch(error){
        next(error);
    }
});

app.get('/categories/:category', async (req, res, next) => { // each category page lists the sites that are in it, plus delete box
    try{
        const category = req.params.category;
        const bookmarks = await db.Bookmarks.findAll({ where: { category }});
        //const bookmark = bookmarks.map(bookmark => `${bookmark.name} for ${bookmark.category}`);
        const html = `
        <html>
            <body>
                <h1>ACME Bookmarks: ${category}</h1>
                <div>
                ${ bookmarks.map(bookmark => { 
                    return `<div> ${bookmark.name}: <a href='/categories/${bookmark.category}'>${bookmark.category} </a>
                    <form method='POST' action='/bookmarks/${bookmark.id}?_method=delete'>
                        <button>x</button>
                    </form>
                </div>
                `;
                 }).join('')
                } 
                <p><a href='/bookmarks'> << Back to Bookmarks </a></p>
            </body>
        </html>
        `;
        res.send(html)
    }
    catch(error){
        next(error);
    }
})



const setup = async() => {
    try{ 
        await db.sequelize.sync({force: true });
        await db.Bookmarks.create({ name: 'linkedin.com', category: 'Jobs'})
        await db.Bookmarks.create({ name: 'indeed.com', category: 'Jobs'})
        await db.Bookmarks.create({ name: 'msdn.com', category: 'Code'})
        await db.Bookmarks.create({ name: 'stackoverflow.com', category: 'Code'})
        await db.Bookmarks.create({ name: 'amazon.com', category: 'Shopping'})

        const port = process.env.PORT || 3000;  
        app.listen(port, () => {
            console.log(`Listening on port ${port}`)
        });
    }
    catch(error){
    console.log(error)
    }
}

setup();