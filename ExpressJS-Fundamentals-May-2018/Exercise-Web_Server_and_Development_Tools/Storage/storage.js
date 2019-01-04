let fs = require('fs');
let dbPath = './storage.json';
let storage = {};

function put(key, value) {
    checkForStringKey(key);
    if (storage.hasOwnProperty(key)) {
        throw new Error("Key exist!");
    }

    storage[key] = value;
}

function get(key) {
    checkForStringKey(key);
    checkKeyExist(key);

    return storage[key];
}

function getAll() {
    if (Object.entries(storage).length === 0) {
        return "Empty storage!";
    }

    return storage;
}

function update(key, newValue) {
    checkForStringKey(key);
    checkKeyExist(key);

    storage[key] = newValue;
}

function deleteKey(key) {
    checkForStringKey(key);
    checkKeyExist(key);

    delete storage[key];
}

function clear() {
    storage = {};
}

function save() {
    return new Promise((resolve, reject) => {
        let dataAsString = JSON.stringify(storage);

        fs.writeFile(dbPath, dataAsString, err => {
            if (err) {
                reject();
                return;
            }

            resolve();
        });
    })
}

function load() {
    return new Promise((resolve, reject) => {
        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                reject();
                return;
            }

            storage = JSON.parse(data);
            resolve();
        });
    })
}

function checkForStringKey(key) {
    if (typeof key !== "string") {
        throw new Error("Key is not a string!");
    }
}

function checkKeyExist(key) {
    if (!storage.hasOwnProperty(key)) {
        throw new Error("Key not exist!");
    }
}

module.exports = { put, get, getAll, update, delete: deleteKey, clear, save, load };