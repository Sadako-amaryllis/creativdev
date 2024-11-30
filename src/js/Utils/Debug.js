import { GUI } from "dat.gui"

export default class Debug {
    constructor() {
        this.ui = null
        this.active = window.location.hash === "#debug"
        this.params = {
            speed: 1  // Valeur initiale pour le paramètre speed
        }

        if (this.active) {
            this.createGUI()
        }
    }

    // Méthode pour activer l'interface de débogage et créer les contrôles
    createGUI() {
        this.ui = new GUI()
        
        // Ajout du paramètre 'speed' avec un intervalle de -1 à 1
        this.ui.add(this.params, "speed", -1, 1).name("Speed").onChange(value => {
            console.log("Speed changed to:", value)
            // Vous pouvez ici mettre à jour la logique de votre scène ou animation
            // Par exemple, appliquer le changement de vitesse dans vos calculs
        })

        // Affichage de l'UI en mode débogage
        this.ui.open()
    }

    // Activation/désactivation de l'UI
    set active(isUI) {
        if (isUI && !!!this.ui) {
            this.createGUI()
        }
    }

    set domDebug(content) {
        document.getElementById("debug").innerHTML = content
    }
}