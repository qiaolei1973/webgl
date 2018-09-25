import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const rootDir = path.resolve(__dirname, '..');

const transformIndexExperiments = experimentConfigs => {
    return content => {
        const template = _.template(content);
        return template({ experiments: experimentConfigs });
    };
};

export default (experiments, buildType) => {
    const entry = {};
    const plugins = [];
    const experimentConfigs = [];

    experiments.forEach(experiment => {
        const experimentPath = path.join(rootDir, `src/experiments/${experiment}`);
        if (!fs.lstatSync(experimentPath).isDirectory()) {
            return;
        }
        entry[experiment] = experimentPath;

        const experimentConfig = require(`${experimentPath}/config`).default;
        experimentConfig.id = experiment;
        experimentConfigs.push(experimentConfig);

        plugins.push(
            new HtmlWebpackPlugin({
                template: path.resolve(rootDir, 'public/index.html'),
                filename: `experiments/${experiment}/index.html`,
                chunks: [experiment]
            })
        );
    });
    plugins.push(
        new CopyWebpackPlugin([
            {
                from: path.join(rootDir, 'src/assets'),
                to: path.join(rootDir, 'dist/assets')
            },
            {
                from: path.join(rootDir, 'public/index-experiments.html'),
                to: path.join(rootDir, `dist/index.html`),
                transform: transformIndexExperiments(experimentConfigs)
            }
        ])
    );

    return {
        entry,
        output: {
            path: path.resolve(rootDir, 'dist'),
            filename: 'experiments/[name]/bundle.js',
            // publicPath: path.resolve(rootDir, 'public')
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: 'babel-loader'
                }
            ]
        },
        plugins
    };
};
