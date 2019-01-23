const Article = require('../models/Article');
const edit = require('./edit');

async function create(data) {
    let title = data.title;
    let content = data.content;
    let authorId = data.authorId;

    if (title === '' || content === '') {
        throw new Error('Fill all inputs!');
    }

    const newArticle = await Article.create({ title });
    const newEdit = await edit.create(content, newArticle._id, authorId);
    await addEdit(newEdit._id, newArticle);
    return newArticle;
}

async function all() {
    return await Article.find({}).sort({'title': 1}).populate('edits');
}

async function getById(id) {
    return await Article.findById(id).populate('edits');
}

async function addEdit(editId, article) {
    article.edits.push(editId);
    return await article.save();
}

async function lock(article) {
    article.isLock = true;
    return await article.save();
}

async function unlock(article) {
    article.isLock = false;
    return await article.save();
}

module.exports = {
    create,
    all,
    getById,
    addEdit,
    lock,
    unlock
};