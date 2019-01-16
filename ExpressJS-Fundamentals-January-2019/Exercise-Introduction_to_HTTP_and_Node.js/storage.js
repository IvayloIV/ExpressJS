const fs = require('fs');
const filePath = 'storage.json';
let storage = {};

module.exports = {
    put: (key, value) => {
        checkKeyForString(key);
        if (storage.hasOwnProperty(key)) {
            throw new Error('Key already exist!');
        }

        storage[key] = value; 
    },
    get: (key) => {
        checkKeyForString(key);
        checkExistKey(key);
        return storage[key];
    },
    getAll: () => {
        if (Object.keys(storage).length === 0) {
            return 'There are no items in the storage!';
        }

        return storage;
    },
    update: (key, newValue) => {
        checkKeyForString(key);
        checkExistKey(key);
        storage[key] = newValue;
    },
    delete: (key) => {
        checkKeyForString(key);
        checkExistKey(key);
        delete storage[key];
    },
    clear: () => {
        storage = {};
    },
    save: () => {
        let data = JSON.stringify(storage);
        fs.writeFileSync(filePath, data);
    },
    load: () => {
        if (!fs.existsSync(filePath)) {
            return;
        }

        let data = fs.readFileSync(filePath, 'utf8');
        storage = JSON.parse(data);
    },
    saveAsync: () => {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, JSON.stringify(storage), (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    },
    loadAsync: () => {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                storage = JSON.parse(data);
                resolve();
            });
        });
    }
};

function checkKeyForString(key) {
    if (typeof key !== 'string') {
        throw new Error('Key is not a string!');
    }
}

function checkExistKey(key) {
    if (!storage.hasOwnProperty(key)) {
        throw new Error('Key not exist!');
    }
}