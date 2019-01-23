const Edit = require('../models/Edit');

async function create(content, articleId, authorId) {
    return await Edit.create({ 
        content, 
        article: articleId,
        author: authorId
    });
}

async function getByArticleId(id) {
    let articles = await Edit.find({'article': id})
        .populate('article')
        .populate('author');
    
    for(let article of articles) {
        article.date = article.dateCreation.toLocaleString();
    }

    return articles;
}

module.exports = {
    create,
    getByArticleId
};