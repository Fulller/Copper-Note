let $ = document.querySelector.bind(document)

let app = {
    data: [],
    dom: {
        titleInput: $('#create-title-input'),
        contentArea: $('#create-content-textarea'),
        save: $('#create-save'),
        show: $('#show'),
    },
    handleEvent: function (dom,data){
        dom.titleInput.onkeyup = function (e){
            if(e.key=='Enter'||e.which==40){
                dom.contentArea.focus()
            }
        }
        dom.save.onclick = function (){
            let titleValue = dom.titleInput.value
            let contentValue = dom.contentArea.value
            dom.titleInput.value = ''
            dom.contentArea.value = ''
            if(contentValue){
                data.unshift({
                    title: titleValue,
                    content: contentValue
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
            
            let textarea = note.querySelector('.show-content-textarea')
            let title =  note.querySelector('.show-title-input')
            title.onblur = function (){
                let titleValue = note.querySelector('.show-title-input').value
                let textareaValue = note.querySelector('.show-content-textarea').value
                data[index] = {
                    title: titleValue,
                    content: textareaValue
                }
                app.render(data)
                app.saveData()
            }
            textarea.onblur = function (){
                let titleValue = note.querySelector('.show-title-input').value
                let textareaValue = note.querySelector('.show-content-textarea').value
                data[index] = {
                    title: titleValue,
                    content: textareaValue
                }
                app.render(data)
                app.saveData()
            }
        }
    },
    render: function (data){
        show.innerHTML = data.map((item,index)=>{
            return `
            <div class="show-note" index="${index}">
                <div class="show-header">
                    <input type="text" placeholder="Tiêu đề" class="show-title-input" value="${item.title}">
                    <span class="show-delete">Xóa</span>
                </div>
                <textarea name="" class="show-content-textarea"  rows="10" placeholder="Tạo ghi chú...">${item.content}</textarea>
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
    start: function (){
        this.getData()
        this.render(this.data)
        this.handleEvent(this.dom,this.data)
    }
};app.start();