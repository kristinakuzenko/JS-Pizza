/**
 * Created by Andriy on 10.03.2015.
 */
module.exports = function(grunt) {
    //Налаштування збірки Grunt
    var config = {
        //Інформацію про проект з файлу package.json
        pkg: grunt.file.readJSON('package.json'),

        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "Frontend/www/assets/css/main.css": "Frontend/www/assets/less/main.less" // destination file and source file
                }
            }
        },
        //Конфігурація для модуля browserify (перетворює require(..) в код
        browserify: {
            //Загальні налаштування (grunt-browserify)
            options: {

                //brfs замість fs.readFileSync вставляє вміст файлу
                transform: [require('brfs')],
                browserifyOptions: {
                    //Папка з корнем джерельних кодів javascript
                    basedir: "Frontend/src/js/"
                }
            },

            //Збірка з назвою піца
            pizza: {
                src: 'Frontend/src/main.js',
                dest: 'Frontend/www/assets/js/main.js',
            },
            //Збірка з назвою піца
            order: {
                src: 'Frontend/src/order.js',
                dest: 'Frontend/www/assets/js/order.js'
            }
        }
    };

    //Налаштування відстежування змін в проекті
    var watchDebug = {
        options: {
            'no-beep': true
        },
        //Назва завдання будь-яка
        scripts: {
            //На зміни в яких файлах реагувати
            files: ['Frontend/src/**/*.js', 'Frontend/**/*.ejs'],
            //Які завдання виконувати під час зміни в файлах
            tasks: ['browserify:pizza', 'browserify:order']
        },
        styles: {
            files: ['Frontend/www/assets/**/*.less'], // which files to watch
            tasks: ['less'],
            options: {
                nospawn: true
            }
        }
    };


    //Ініціалузвати Grunt
    config.watch = watchDebug;
    grunt.initConfig(config);

    //Сказати які модулі необхідно виокристовувати
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    //Список завданнь по замовчування
    grunt.registerTask('default', [
        'browserify:pizza',
        'browserify:order',
        'less'
        //Інші завдання які необхідно виконати
    ]);

};