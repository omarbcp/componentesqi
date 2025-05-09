const style = `
<style>
.qi_contenedor_modal {
    position: fixed;
    width: 100%;
    display: flex;
    flex-direction: row;
    z-index: 9999;
}
.qi_contenedor_modal .qi_modal {
    max-width: 345px;
    position: fixed;
    background: #FFFFFF;
    box-shadow: 0px 8px 16px rgba(0, 67, 206, 0.1);
    width: 100%;
    z-index: 2;
    border-radius: 8px;
    font-family: 'Flexo';
    overflow:hidden;
}
.qi_contenedor_modal form-captcha {
    display: none;
}
.qi_contenedor_modal .qi_modal > button {
    position: absolute;
    right: 6px;
    top: 12px;
    background: transparent;
    border: unset;
    z-index: 2;
    cursor: pointer;
}
    @media (max-width:768px) {
    .qi_contenedor_modal {
        padding: 0px 12px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: rgb(32 46 68 / 85%);
        top: 0px;
        left: 0px;
    }
    .qi_contenedor_modal .qi_modal.cerrar {
        opacity: 1;
        animation: fadeOut 1s ease-out forwards;
    }

    .qi_contenedor_modal .qi_modal.mostrar {
        opacity: 0;
        animation: fadeIn 1s ease-in forwards;
    }
}
@media (min-width:769px) {
    .qi_contenedor_modal {
        padding: 0px 12px;
        display: flex;
        flex-direction: row;
        justify-content: end;
    }
    .qi_contenedor_modal .qi_modal.cerrar {
        animation: slide-down 1s;
        bottom: -100%;
    }
    .qi_contenedor_modal .qi_modal.mostrar {
        bottom: 10px;
        animation: slide-up 1s;
        right: 10px;
    }
}
/*EFECTOS*/
@keyframes slide-down {
    0% {bottom: 16px;}
    100% {bottom: -100%;}
}
@keyframes slide-up {
    0% {bottom: -100%;}
    80% {bottom: 60px;}
    100% {bottom: 16px;}
}
@keyframes fadeIn {
    from {opacity: 0;}
    to {opacity: 1;}
}
@keyframes fadeOut {
    from {opacity: 1;}
    to {opacity: 0;}
}
@keyframes typing {
    from { width: 0 }
    to { width: 100% }
}
@keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: orange; }
}
</style>
`
class QIModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const svgButton = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M0.209705 0.387101L0.292893 0.292893C0.653377 -0.0675907 1.22061 -0.0953203 1.6129 0.209705L1.70711 0.292893L7 5.585L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893C14.0976 0.683418 14.0976 1.31658 13.7071 1.70711L8.415 7L13.7071 12.2929C14.0676 12.6534 14.0953 13.2206 13.7903 13.6129L13.7071 13.7071C13.3466 14.0676 12.7794 14.0953 12.3871 13.7903L12.2929 13.7071L7 8.415L1.70711 13.7071C1.31658 14.0976 0.683418 14.0976 0.292893 13.7071C-0.0976311 13.3166 -0.0976311 12.6834 0.292893 12.2929L5.585 7L0.292893 1.70711C-0.0675907 1.34662 -0.0953203 0.779392 0.209705 0.387101L0.292893 0.292893L0.209705 0.387101Z"
                    fill="#ff7800" />
            </svg>`
        this.contenedor = document.createElement('div')
        this.modal = document.createElement('div')
        this.buttonCerrar = document.createElement('button')
        this.buttonCerrar.innerHTML = svgButton
        this.contenedor.classList.add('qi_contenedor_modal')
        this.modal.classList.add('qi_modal')
        this.shadowRoot.innerHTML = style;
        this.modal.appendChild(this.buttonCerrar)
        this.contenedor.appendChild(this.modal)
    }
    static get observedAttributes(){
        return ["data-qi-modal"];
    }
    attributeChangedCallback(nameAttr, oldValue, newValue){
        console.log(nameAttr, oldValue, newValue);
    }
    connectedCallback(){
        console.log("Elemento conectado al DOM");
        this.shadowRoot.appendChild(this.contenedor);
        this.buttonCerrar.addEventListener('click', () => {this.hide()})
    }
    addCSS(css){
        const style = document.createElement('style')
        style.textContent = css
        this.shadowRoot.appendChild(style)
        this.shadowRoot.insertBefore(style, this.contenedor)
    }
    /**
     * @param {string[]} data
     */
    set data(data){
        const step = document.createElement('qi-step')
        data.forEach(e=>{step.appendChild(e)})
        this.modal.appendChild(step)
        this.view()
    }
    view(){
        this.modal.classList.add('mostrar')
    }
    hide(){
        this.modal.classList.remove('mostrar')
        this.modal.classList.add('cerrar')
        this.taggeo({label:"cerrar"})
    }
    taggeo(taggeoCustom){
        const taggeoDataDefault = {
            channel : "ViaBCP",
            group : "ViaBCP",
            name: "Click",
            event:"trackAction",
            category:"Modal",
            version:"Seguros"
        }
        const taggeo = {...taggeoDataDefault, ...taggeoCustom};

        if(typeof digitalData !== 'undefined'){
            let dataTaggeo = {
                trackAction : {
                    action: {group: taggeo.group,category: taggeo.category,name: taggeo.name,label: taggeo.label},
                    metadata: {key: "Producto",value: taggeo.product},
                    event: "trackAction"
                },
                trackElement: {
                    element:{container:taggeo.container,type:taggeo.type,name:taggeo.name},
                    event:"trackElement"
                },
                trackError:{
                    error:{code:"VIABCP-HOME-VIAJES",message:taggeo.message},
                    event:"trackError"
                }
            }
            if(dataTaggeo[taggeo.event]){
                digitalData.push(dataTaggeo[taggeo.event])
            } else {
                console.log('no se encontro evento de taggeo')
            }
        } else {
            console.log('no se encontro digitalData')
        }
    }
}
customElements.define('qi-modal', QIModal);
//FUNCIONES GENERALES
class QIHTMLElement {
    constructor(tagName='div') {
        this.element = document.createElement(tagName)
    }
    addchildren(listElement){
        listElement.forEach((e)=>{e && this.element.appendChild(e)})
        return this;
    }
    addClass(data) {
        if(typeof data == 'string'){
            this.element.classList.add(data);
        } else {
            data.forEach((className)=>{this.element.classList.add(className)})
        }
        return this;
    }
    setAttribute(attributes) {
        for (const [key, value] of Object.entries(attributes)) {this.element.setAttribute(key, value)}
        return this;
    }
    setText(text) {
        this.element.textContent = text;
        return this;
    }
    setHTML(html) {
        this.element.innerHTML = html;
        return this;
    }
    appendChild(child) {
        if (child instanceof QIHTMLElement) {
            this.element.appendChild(child.element);
        } else if (child instanceof Node) {
            this.element.appendChild(child);
        } else {
            throw new Error("El hijo debe ser una instancia de QIHTMLElement o Node.");
        }
        return this;
    }
    appendTo(parent) {
        if (parent instanceof QIHTMLElement) {
            parent.element.appendChild(this.element);
        } else if (parent instanceof Node) {
            parent.appendChild(this.element);
        } else {
            throw new Error("El padre debe ser una instancia de QIHTMLElement o Node.");
        }
        return this;
    }
    getElement() {
        return this.element;
    }
}
const builHTML = (data) =>{
    const tag = data.hasOwnProperty('tag') ? data.tag : 'div'
    const node = new QIHTMLElement(tag)
    data.hasOwnProperty('clase') && node.addClass(data.clase)
    data.hasOwnProperty('content') && node.setHTML(data.content)
    data.hasOwnProperty('attrib') && node.setAttribute(data.attrib)
    return node.getElement()
}
const builButtons = (data)=>{
    const allButtons = []
    data.content.forEach(button =>{
        const parametro = button.hasOwnProperty('parametro') ? button.parametro : button.label
        const newButton = new QIHTMLElement('button').addClass(button.clases).setText(button.label).getElement()
        newButton.onclick = ()=>{button.functions(parametro)}
        allButtons.push(newButton)
    })
    const sectionButton = new QIHTMLElement().addClass(data.clase).addchildren(allButtons).getElement()
    return sectionButton
}
const builMaster = (data)=>{
    const containerELement = []
        data.forEach((element,index) =>{
            if(element.hasOwnProperty('type')){
                containerELement.push(element.type(element))
            } else {
                console.error("Body["+index+"] sin propiedad type")
            }
        })
    return containerELement
}