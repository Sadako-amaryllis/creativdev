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

        /** Scène 3 - Gestion des bulles qui sortent de l'écran */
        const outScene3_up = scene3.bubbles.filter(b => { return b.y < 0 })
        const outScene3_down = scene3.bubbles.filter(b => { return b.y > scene3.height })
    
        outScene3_up.forEach(bubbleToRemove => { scene3.removeBubble(bubbleToRemove) })
        outScene3_down.forEach(bubbleToRemove => { scene3.removeBubble(bubbleToRemove) })
    
        outScene3_up.forEach(bubbleToMove => {
            scene2.addCube(bubbleToMove.x - scene2.width / 2, -scene2.height / 2)
        })
    
        outScene3_down.forEach(bubbleToMove => {
            const newBubble_ = scene1.addBubble(bubbleToMove.x, 0)
            newBubble_.vy = bubbleToMove.vy
            newBubble_.vx = bubbleToMove.vx
        })
        
       /** Scène 1 - Gestion des bulles qui sortent de l'écran */
       const outScene1_up = scene1.bubbles.filter(b => { return b.y < 0 })
       const outScene1_down = scene1.bubbles.filter(b => { return b.y > scene1.height })
   
       outScene1_up.forEach(bubbleToRemove => { scene1.removeBubble(bubbleToRemove) })
       outScene1_down.forEach(bubbleToRemove => { scene1.removeBubble(bubbleToRemove) })
   
       outScene1_up.forEach(bubbleToMove => {
           const newBubble_ = scene3.addBubble(bubbleToMove.x, scene3.height)
           newBubble_.vx = bubbleToMove.vx
           newBubble_.vy = bubbleToMove.vy
       })
   
       outScene1_down.forEach(bubbleToMove => {
           scene2.addCube(bubbleToMove.x - scene2.width / 2, scene2.height / 2)
       })
   

}
time.on("update", update)