import Loader from './loader';
import World from './world';

const loader = new Loader();
loader.load({
    texts:[
        {name:'grass.vert',url:'/shader/grass.frag.glsl'}
    ]
})

const world = new World();
