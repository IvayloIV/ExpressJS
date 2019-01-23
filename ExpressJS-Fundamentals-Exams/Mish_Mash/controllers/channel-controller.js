const apiChannel = require('../api/channel');
const apiUser = require('../api/user');

module.exports = {
    all: async (req, res) => {
        let message = req.session.message;
        req.session.message = '';
        let user = await apiUser.getById(req.user.id);
        let followedChannels = user.followedChannels;
        let followTags = [];
        let followIds = [];
        for (let channel of followedChannels) {
            channel.followersCount = channel.followers.length;
            channel.isFollow = true;
            followIds.push(channel._id);
            for (let tag of channel.tags) {
                followTags.push(tag);
            }
        }

        let channels = await apiChannel.all();
        let suggestedChannel = [];
        let seeOther = [];
        for (let channel of channels) {
            channel.followersCount = channel.followers.length;
            let repeatedId = followIds.filter(a => a.equals(channel._id));
            if (repeatedId.length > 0) {
                continue;
            }

            let matchedTags = channel.tags.filter(a => followTags.indexOf(a) > -1);
            if (matchedTags.length > 0) {
                suggestedChannel.push(channel);
            } else {
                seeOther.push(channel);
            }
        }

        res.render('channel/all', {
            message,
            followedChannel: followedChannels,
            suggestedChannel,
            seeOther
        });
    },
    createGet: (req, res) => {
        let message = req.session.message;
        req.session.message = '';
        res.render('channel/create', { message });
    },
    createPost: async (req, res) => {
        try {
            await apiChannel.create(req.body);
            req.session.message = 'Successful created!';
            res.redirect('/');
        } catch (err) {
            res.render('channel/create', { message: err.message, channel: req.body });
        }
    },
    details: async (req, res) => {
        try {
            let id = req.params.id;
            let channel = await apiChannel.getById(id);
            channel.followersCount = channel.followers.length;
            channel.allTags = channel.tags.join(', ');
            res.render('channel/details', channel);
        } catch (err) {
            console.log(err);
        }
    },
    follow: async (req, res) => {
        try {
            let id = req.params.id;
            await apiUser.addChannel(req.user, id);
            await apiChannel.addFollower(id, req.user.id);
            req.session.message = 'Follow successful.';
            res.redirect('/');
        } catch (err) {
            console.log(err);
        }
    },
    myChannels: async (req, res) => {
        try {
            let user = await apiUser.getById(req.user.id);
            let counter = 1;
            for(let channel of user.followedChannels) {
                channel.index = counter++;
                channel.followedCount = channel.followers.length;
            }
            res.render('channel/myChannels', {channels: user.followedChannels});
        } catch (err) {
            console.log(err);
        }
    },
    unfollow: async (req, res) => {
        try {
            let id = req.params.id;
            await apiUser.removeChannel(req.user, id);
            await apiChannel.removeFollower(id, req.user.id);
            req.session.message = 'Successful removed channel.';
            res.redirect('/');
        } catch (err) {
            console.log(err);
        }
    }
};