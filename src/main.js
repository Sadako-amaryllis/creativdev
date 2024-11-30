import SceneGravityCubes from "./js/scenarios/GravityCubes/SceneGravityCubes"
import SceneBouncingBubbles from "./js/scenarios/SceneBouncingBubbles"
import GlobalContext from "./js/template/GlobalContext"
import { askMotionAccess } from "./js/Utils/DeviceAccess"

/** motion sensors authorization */
const btn = document.getElementById("btn-access")
btn.addEventListener("click", function () {
    askMotionAccess()
}, false)

/** scenes */
const scene1 = new SceneBouncingBubbles("canvas-scene-1")
const scene2 = new SceneGravityCubes("canvas-scene-2")
const scene3 = new SceneBouncingBubbles("canvas-scene-3")

/** main */
const globalContext = new GlobalContext()
const params = {
    test: 0
}
if (!!globalContext.debug.ui) {
    globalContext.debug.ui.add(params, "test", 0, 10)
}
const time = globalContext.time
const update = () => {
    /** Exemple CSS : animation de bouton */
    const scale_ = 1 + (Math.cos(5 * time.elapsed / 1000) / 2 + 0.5) / 20
    btn.style.transform = `scale(${scale_}, ${1})`

    /** Transition scène 2 → scène 3 */
    const outScene2_down = scene2.cubes.filter(c => c.position.y < -scene2.height / 2)
    outScene2_down.forEach(cubeToRemove => { 
        scene2.removeCube(cubeToRemove) 
        const newBubble = scene3.addBubble(
            cubeToRemove.position.x + scene3.width / 2, 
            0
        )
        newBubble.vy = Math.abs(newBubble.vy) // Monte dans la scène 3
    })

    /** Transition scène 2 → scène 1  */
    const outScene2_up = scene2.cubes.filter(c => c.position.y > scene2.height / 2)
    outScene2_up.forEach(cubeToRemove => { 
        scene2.removeCube(cubeToRemove)
        const newBubble = scene1.addBubble(
            cubeToRemove.position.x + scene1.width / 2,
            scene1.height
        )
        newBubble.vy = -Math.abs(newBubble.vy) // Descend dans la scène 1
    })  

    /** Transition scène 3 → scène 2  */
    const outScene3_up = scene3.bubbles.filter(b => b.position && b.position.y > scene3.height / 2)
    outScene3_up.forEach(bulleToRemove => {
        scene3.removeBubble(bulleToRemove)
        const newCube = scene2.addCube(
            bulleToRemove.position.x + scene2.width / 2,
            scene2.height
        )
        newCube.vy = Math.abs(newCube.vy)
    })

    /** Transition scène 1 → scène 2  */
    const outScene1_down = scene1.bubbles.filter(b => b.position && b.position.y > scene1.height / 2)
    outScene1_down.forEach(bulleToRemove => {
        scene1.removeBubble(bulleToRemove)
        const newCube = scene2.addCube(
            bulleToRemove.position.x + scene2.width / 2,
            scene2.height
        )
        newCube.vy = Math.abs(newCube.vy)
    })

    /** Transition scène 3 → scène 1  */
const outScene3_down = (scene3.bulles || []).filter(c => c.position.y > scene3.height / 2);
outScene3_down.forEach(bulleToRemove => { 
    scene3.removeBubble(bulleToRemove);
    const newBubble = scene1.addBubble(
        bulleToRemove.position.x + scene1.width / 2,
        scene1.height
    );
    newBubble.vy = -Math.abs(newBubble.vy);
});

/** Transition scène 1 → scène 3  */
const outScene1_up = (scene1.bulles || []).filter(c => c.position.y > scene1.height / 2);
outScene1_up.forEach(bulleToRemove => { 
    scene1.removeBubble(bulleToRemove);
    const newBubble = scene3.addBubble(
        bulleToRemove.position.x + scene3.width / 2,
        scene3.height
    );
    newBubble.vy = -Math.abs(newBubble.vy);
});


}
time.on("update", update)