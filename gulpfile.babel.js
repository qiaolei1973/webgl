import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import gutil from 'gulp-util';
import clean from 'gulp-clean';
import express from 'express';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import webpackConfig from './webpack/webpack.config';

const EXPERIMENTS_DIR = path.join(__dirname, 'src/experiments');

const getExperiments = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(EXPERIMENTS_DIR, (error, items) => {
            if (error) {
                return reject(error);
            }
            return resolve(items);
        });
    });
};

const build = experiments => {
    return new Promise((resolve, reject) => {
        const config = webpackConfig(experiments, 'build');
        const compiler = webpack(config);
        compiler.run((error, stats) => {
            if (error) {
                return reject(error);
            }
            gutil.log('[webpack:build]', stats.toString({ colors: true }));
            return resolve(config);
        });
    });
};

const dev = experiments => {
    const PORT = 8001;
    const HOST = 'localhost';
    return new Promise((resolve, reject) => {
        const config = webpackConfig(experiments, 'serve');
        const compiler = webpack(config);
        const devServerConfig = {
            stats: { colors: true },
            setup: experiment => {
                experiment.use('/dist', express.static('./src'));
            }
        };
        new WebpackDevServer(compiler, devServerConfig).listen(PORT, HOST, error => {
            if (error) {
                return reject(error);
            }
            gutil.log('[webpack:serve]', `http://${HOST}:${PORT}`);
            return resolve();
        });
    });
};

gulp.task('clean', () => gulp.src(['./dist', './index.html'], { read: false }).pipe(clean()));

gulp.task('build', ['clean'], cb => {
    getExperiments()
        .then(build)
        .catch(cb);
});

gulp.task('dev', cb => {
    getExperiments()
        .then(dev)
        .catch(cb);
});
