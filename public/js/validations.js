function chkNewTodo(e){
    // e.preventDefault();
    var title = document.querySelector("input[name='title']")
    var details = document.querySelector("textarea[name='details']")
    if(Boolean(title.value.trim())&& Boolean(details.value.trim()))
    return true;
    
    // return false
}