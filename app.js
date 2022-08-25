let $ = document.querySelector.bind(document)

let app = {
    data: [],
    dom: {
        titleInput: $('#create-title-input'),
        contentArea: $('#create-content-textarea'),
        save: $('#create-save'),
        show: $('#show'),
    },
    countLine: function (text){
        let lines = text.split('\n')
        return lines.length
    },
    handleEvent: function (dom,data){
        dom.titleInput.onkeyup = function (e){
            if(e.key=='Enter'||e.which==40){
                dom.contentArea.focus()
            }
        }
        dom.contentArea.onkeydown = function (e){
            if(e.key == 'Enter'){
                dom.contentArea.rows++
            }
        }
        dom.save.onclick = function (){
            let titleValue = dom.titleInput.value
            let contentValue = dom.contentArea.value
            dom.titleInput.value = ''
            dom.contentArea.value = ''
            dom.contentArea.rows = 1
            if(contentValue){
                data.unshift({
                    title: titleValue,
                    content: contentValue,
                    img: [],
                })
                app.render(data)
                app.saveData()
            }
        }
        dom.contentArea.onblur = function (){
            if(dom.titleInput.value){
                dom.save.click()
            }
        }
        dom.titleInput.onblur = function (){
            if(dom.contentArea.value){
                dom.save.click()
            }
        }
        dom.show.onclick = function (e){
            let note =  e.target.closest('.show-note')
            let index  = note.getAttribute('index')

            let deleteBtn  = e.target.closest('.show-delete') 
            if(deleteBtn){
                data.splice(index,1)
                app.render(data)
                app.saveData()
            }

            let ghimBtn = e.target.closest('.show-ghim')
            if(ghimBtn){
                let temp = data[index]
                data.splice(index,1)
                data.unshift(temp)
                app.render(data)
                app.saveData()
            }
            
            let textarea = note.querySelector('.show-content-textarea')
            let title =  note.querySelector('.show-title-input')
            title.onblur = function (){
                let titleValue = note.querySelector('.show-title-input').value
                let textareaValue = note.querySelector('.show-content-textarea').value
                data[index] = {
                    title: titleValue,
                    content: textareaValue,
                    img: data[index].img,
                }
                app.render(data)
                app.saveData()
            }
            textarea.onkeydown = function (e){
                if(e.key == 'Enter'){
                    textarea.rows++
                }
            }
            textarea.onblur = function (){
                let titleValue = note.querySelector('.show-title-input').value
                let textareaValue = note.querySelector('.show-content-textarea').value
                data[index] = {
                    title: titleValue,
                    content: textareaValue,
                    img: data[index].img,
                }
                app.render(data)
                app.saveData()
            }
            let inputImg = $('#file-img')
            let addImg = e.target.closest('.show-bonus-img')
            if(addImg){
                inputImg.oninput =  function (){
                    let urlImg = URL.createObjectURL(inputImg.files[0])
                    data[index].img.push(urlImg)
                    app.render(data)
                    app.saveData()
                }
            }
            let can = e.target.closest('.fa-trash-can')
            if(can){
                let imgIndex = can.getAttribute('imgIndex')
                data[index].img.splice(inputImg,1)
                app.render(data)
                app.saveData()
            }
        }
    },
    render: function (data){
        show.innerHTML = data.map((item,index)=>{
            let showImg = ''
            if(item.img){
                showImg = item.img.map((image,index)=>{
                    return `
                        <div class="show-img-block">
                            <img src="${image}" alt="image" class="show-img-item">
                            <i class="fa-regular fa-trash-can" indexImg="${index}"></i>
                        </div>
                    `
                }).join('')
            }
            return `
            <div class="show-note" index="${index}">
                <div class="show-img">
                    ${showImg}
                </div>
                <div class="show-header">
                    <input type="text" placeholder="Tiêu đề" class="show-title-input" value="${item.title}">
                </div>
                <textarea name="" class="show-content-textarea"  rows="${app.countLine(item.content)}" placeholder="Tạo ghi chú...">${item.content}</textarea>
                <div class="show-footer">
                    <div class="show-bonus">
                        <label for="file-img">
                            <span class="show-bonus-img"><i class="fa-regular fa-image"></i></i></span>
                            <input id="file-img" style="display: none;" type="file" accept="image/*" />
                        </label>
                    </div>
                    <div class="show-control">
                        <span class="show-delete">Xóa</span>
                        <span class="show-ghim">Ghim</span>
                    </div>
                </div>
            </div>
            `
        }).join('')
    },
    saveData: function (){
        localStorage.setItem('NoteList',JSON.stringify(this.data))
    },
    getData: function (){
        if(localStorage.getItem('NoteList')){
            this.data = JSON.parse(localStorage.getItem('NoteList'))
        }
    },
    start: async function (){
        this.getData()
        this.render(this.data)
        this.handleEvent(this.dom,this.data)
    }
};app.start();
