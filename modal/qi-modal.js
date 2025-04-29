class QIModal extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({ mode: 'open' });
        const style = document.createElement('link');
        const svgButton = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M0.209705 0.387101L0.292893 0.292893C0.653377 -0.0675907 1.22061 -0.0953203 1.6129 0.209705L1.70711 0.292893L7 5.585L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893C14.0976 0.683418 14.0976 1.31658 13.7071 1.70711L8.415 7L13.7071 12.2929C14.0676 12.6534 14.0953 13.2206 13.7903 13.6129L13.7071 13.7071C13.3466 14.0676 12.7794 14.0953 12.3871 13.7903L12.2929 13.7071L7 8.415L1.70711 13.7071C1.31658 14.0976 0.683418 14.0976 0.292893 13.7071C-0.0976311 13.3166 -0.0976311 12.6834 0.292893 12.2929L5.585 7L0.292893 1.70711C-0.0675907 1.34662 -0.0953203 0.779392 0.209705 0.387101L0.292893 0.292893L0.209705 0.387101Z"
                    fill="#ff7800" />
            </svg>`
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', 'qi-modal.css');
        this.contenedor = document.createElement('div')
        this.modal = document.createElement('div')
        this.buttonCerrar = document.createElement('button')
        this.buttonCerrar.innerHTML = svgButton
        this.contenedor.classList.add('qi_contenedor_modal')
        this.modal.classList.add('qi_modal')
        this.shadowRoot.appendChild(style);
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
        this.buttonCerrar.addEventListener('click', () => {
            this.hide();
        })
    }
    /**
     * @param {string[]} data
     */
    set data(data){
        const step = document.createElement('qi-step')
        step.innerHTML = data
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
    #taggeo(taggeoCustom){
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
        }
    }
}
customElements.define('qi-modal', QIModal);