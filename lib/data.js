/**
 * Library for storing and editing data
 */

// Dependencies
const fs = require('fs');
const path = require('path');

// Container for the module (to be exported)
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = function (dir, file, data, callback) {
    // Open the file for writing, wx switch will err if the file already exists
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
        if(!err & fileDescriptor) {
            // Convert data to string
            const stringData = JSON.stringify(data);

            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, function(err){
                if(!err){
                    fs.close(fileDescriptor, function(err){
                        if(!err){
                            // Returning a false error, means operation succeded
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback('Could not create new file, it may already exist');
        }
    });
};

// Read data from a file
lib.read = function (dir, file, callback) {
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf-8', function(err, data){
        callback(err, data);
    });
};

// Updata data inside a file
lib.update = function (dir, file, data, callback) {
    // Open the file for writing, r+ switch will err if the file doesn't exist
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+', function(err, fileDescriptor){
        if (!err && fileDescriptor) {
            // Convert data to string
            const stringData = JSON.stringify(data);
            
            // Truncate the contents of the file
            fs.truncate(fileDescriptor, function(err){
                if(!err) {
                    // Write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, function(err){
                        if (!err){
                            fs.close(fileDescriptor, function(err) {
                                if(!err){
                                    callback(false);
                                } else {
                                    callback('Error closing the existing file');
                                }
                            });
                        } else {
                            callback('Error writing to existing file');
                        }
                    });
                } else {
                    callback('Error truncating file');
                }
            });
        } else {
            callback('Could not open the file for updating, it may not exist yet');
        }
    })
};

// Delete a file
lib.delete = function(dir, file, callback) {
    // Unlink the file (removing the file from the filesystem)
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
        if(!err){
            callback(false);
        }else {
            callback('Error deleting file');
        }
    });
};

// Export the module
module.exports = lib;