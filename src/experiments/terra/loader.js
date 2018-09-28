import { text } from 'd3-fetch';

export default class Loader {
    constructor() {
        this.asset = { images: {}, texts: {}, textures: {} };
    }

    load(assetList) {
        if (assetList.texts) {
            assetList.texts.forEach(textOption => {
                text(textOption.url)
                    .then(data => {
                        console.log('data: ', data);
                    })
                    .catch(err => {
                        console.error('err: ', err);
                    });
            });
        }
    }
}
