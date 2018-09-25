import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const rootDir = path.resolve(__dirname, '..');

export default (experiments, buildType) => {
    console.log('experiments: ', experiments);
    const entry = {};
    const plugins = [];

    experiments.forEach(experiment => {
        const experimentPath = path.join(rootDir, `src/experiments/${experiment}`);
        if (!fs.lstatSync(experimentPath).isDirectory()) {
            return;
        }
        entry[experiment] = experimentPath;
        // const plugin = new CopyWebpackPlugin([
        //     {
        //         from: path.join(rootDir, 'src/index-experiment.html'),
        //         to: path.join(rootDir, `dist/experiments/${experiment}/index.html`),
        //         transform: transformIndexExperiment(experiment)
        //     }
        // ]);
        // plugins.push(plugin);
    });

    return {
        entry,
        output: {
            path: path.resolve(rootDir, 'dist'),
            filename: 'dist/experiments/[name]/bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: 'babel-loader'
                }
            ]
        }
    };
};

// export default (experiments, buildType) => {
//     const entry = {};
//     const plugins = [];
//     const experimentConfig = [];
//     experiments.forEach(experiment => {
//         const experimentPath = path.join(rootDir, `src/experiments/${experiment}`);
//         if (!fs.lstatSync(experimentPath.isDirectory())) {
//             return;
//         }
//         entry[experiment] = experimentPath;
//         const plugin = new CopyWebpackPlugin([
//             {
//                 from: path.join(rootDir, 'src/index-experiment.html'),
//                 to: path.join(rootDir, `dist/experiments/${experiment}/index.html`),
//                 transform: transformIndexExperiment(experiment)
//             }
//         ]);
//         plugins.push(plugin);
//     });
//     plugins.push(
//         new CopyWebpackPlugin([
//             {
//                 from: path.join(rootDir, 'src/assets'),
//                 to: path.join(rootDir, 'dist/assets')
//             },
//             {
//                 from: path.join(rootDir, 'src/index-experiments.html'),
//                 to: path.join(rootDir, 'index.html'),
//                 transform: transformIndexExperiments(experimentConfigs)
//             }
//         ])
//     );
// };
