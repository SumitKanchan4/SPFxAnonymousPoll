'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

const fs = require('fs');

// create a task
build.task('createPackage', {
    execute: (config) => {
        return new Promise((resolve, reject) => {

            //Read the package-solution file to get the curren versions
            var json = JSON.parse(fs.readFileSync('./config/package-solution.json'));
            var versions = json.solution.version.split('.');

            // if (config.args['ship']) {
            //     versions[3] = parseInt(versions[3]) + 1;
            // }
            // else {
                var versionLength = versions.length;
                versions[versionLength - 1] = parseInt(versions[versionLength - 1]) + 1;
            // }

            json.solution.version = versions.join('.');
            fs.writeFileSync('./config/package-solution.json', JSON.stringify(json));
            resolve();
        }).then(() => {

            if (config.args['ship']) {
            
                gulp.start('bundle', () => {
                    gulp.start('package-solution', () => {
                        console.log('ALL TASKS COMPLETED');
                    });
                });                
            }
            else {
                gulp.start('serve');
            }
        });
    }
});

build.initialize(gulp);
