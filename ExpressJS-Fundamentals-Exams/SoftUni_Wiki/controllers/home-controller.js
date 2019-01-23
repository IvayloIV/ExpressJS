const apiArticle = require('../api/article');

module.exports = {
    index: async (req, res) => {
        let message = req.session.message;
        req.session.message = '';
        
        try {
            const articles = await apiArticle.all();
            let title = 'Empty';
            let content = 'Empty';
            let id = '';
            let recentlyArticles = [];
            if (articles.length > 0) {
                recentlyArticles = articles
                    .sort((a ,b) => b['dateCreation'] - a['dateCreation']);
                
                let lastArticle = recentlyArticles[recentlyArticles.length - 1];
                title = lastArticle.title;
                id = lastArticle._id;
                content = lastArticle.edits
                    .sort((a, b) => b['dateCreation'] - a['dateCreation'])[0].content
                    .split(' ')
                    .filter(a => a !== '')
                    .slice(0, 50);
                content = content.join(' ') + '...';
            }
            res.render('home/index', { 
                message,
                articles: recentlyArticles.slice(0, 3),
                title,
                content,
                _id: id
            });
        }
        catch (e) {
            console.log(e);
        }
    }
};