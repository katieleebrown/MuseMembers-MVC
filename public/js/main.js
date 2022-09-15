// Variables
const deleteBtn = document.querySelectorAll('.del')
const orgSearch = document.getElementById('organizationSearch')
const pickMuseumList = document.getElementById('chooseMuseum')

// Event Listeners
Array.from(deleteBtn).forEach((el) => {
    el.addEventListener('click', deleteTodo)
})
pickMuseumList.addEventListener('click', displaySearch)

// Delete Membership Function
async function deleteTodo() {
    const todoId = this.parentNode.dataset.id
    try {
        const response = await fetch('todos/deleteTodo', {
            method: 'delete',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}

// Display Organization Search
function displaySearch() {
    if (pickMuseumList.selectedIndex > 0) {
        if ('other' === pickMuseumList.options[pickMuseumList.selectedIndex].value) {
            orgSearch.classList.remove('hidden')
        }
    }
}