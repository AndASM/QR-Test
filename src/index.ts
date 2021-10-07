import App from "./App"
import "./styles/index.scss"

async function main() {
    (window as any).application = new App()
    await (window as any).application.run()
}

window.addEventListener("load", main)
