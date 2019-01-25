const apiUser = require('../api/user');
const apiThread = require('../api/thread');
const apiMessage = require('../api/message');

module.exports = {
    all: async (req, res) => {
        let message = req.session.message;
        req.session.message = '';
        try {
            let threads = await apiThread.getAll(req.user.id);
            res.render('home/index', { threads, message });
        } catch (err) {
            console.log(err);
        }
    },
    search: async (req, res) => {
        try {
            let username = req.body.username;
            let user = await apiUser.getByName(username);

            if (user === null) {
                req.session.message = 'Username not exist!';
                res.redirect('/');
                return;
            }

            if (user._id.equals(req.user.id)) {
                req.session.message = 'You cannot send message to yourself!';
                res.redirect('/');
                return;
            }
            let currentUserThread = await apiThread.getAll(req.user.id);
            let connection;

            for (let thread of currentUserThread) {
                if (thread.connectedThread.userCreator._id.equals(user._id)) {
                    connection = thread.connectedThread;
                    break;
                }
            }

            if (!connection) {
                let firstThread = await apiThread.create(req.user.id);
                let secondThread = await apiThread.create(user._id);
                await apiThread.connect(firstThread, secondThread._id);
                await apiThread.connect(secondThread, firstThread._id);

                connection = firstThread;
            }

            let messages = [];
            let connectionThread = await apiThread.getById(connection.connectedThread);

            let connectionMessages = await apiMessage.getByIds(connection.messages);
            addMessages(messages, connectionMessages, false, connectionThread._id);
            addMessages(messages, connectionThread.messages, true, connectionThread._id);

            messages = messages.sort((a, b) => a['dateCreation'] - b['dateCreation']);

            res.render('thread/messages', { 
                messages, 
                threadId: connection._id,
                isBlocked: connectionThread.isBlock
            });
        } catch (err) {
            console.log(err);
        }
    },
    searchById: async (req, res) => {
        try {
            let threadId = req.params.id;
            let thread = await apiThread.getById(threadId);
            let messageInfo = req.session.message;
            req.session.message = '';
            let messageText = req.session.messageText;
            req.session.messageText = '';

            let messages = [];
            let connectionThread = await apiThread.getById(thread.connectedThread);

            addMessages(messages, connectionThread.messages, false, threadId);
            addMessages(messages, thread.messages, true, threadId);

            messages = messages.sort((a, b) => a['dateCreation'] - b['dateCreation']);
            res.render('thread/messages', { 
                messages, 
                threadId, 
                message: messageInfo,
                isBlocked: thread.isBlock,
                messageText
            });
        } catch (err) {
            console.log(err);
        }
    },
    block: async (req, res) => {
        try {
            let id = req.params.id;
            await apiThread.block(id);
            req.session.message = 'Blocked successful!';
            res.redirect('/');
        } catch (err) {
            console.log(err);
        }
    },
    unblock: async (req, res) => {
        try {
            let id = req.params.id;
            await apiThread.unblock(id);
            req.session.message = 'Unblocked successful!';
            res.redirect('/');
        } catch (err) {
            console.log(err);
        }
    }
};

function addMessages(messages, threadMessages, isOwner, threadId) {
    for(let currentMessage of threadMessages) {
        let newMessage = {
            isOwner,
            message: currentMessage.message,
            _id: currentMessage._id,
            dateCreation: currentMessage.dateCreation,
            isLiked: currentMessage.isLiked,
            threadId
        };

        if (currentMessage.message.endsWith('jpg')
            || currentMessage.message.endsWith('jpeg')
            || currentMessage.message.endsWith('png')) {
            newMessage['image'] = true;
        } else if (currentMessage.message.startsWith('http') 
            || currentMessage.message.startsWith('https')) {
            newMessage['link'] = true;
        }
         
        messages.push(newMessage);
    }
}