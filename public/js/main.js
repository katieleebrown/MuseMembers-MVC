// Variables
const deleteBtn = document.querySelectorAll('.del')
const orgSearch = document.getElementById('organizationSearch')
const pickMuseumList = document.getElementById('chooseMuseum')
const orgNameForm = document.getElementById('displayOrgNameForm')
const orgAddressForm = document.getElementById('displayOrgAddressForm')
const addOrgNote = document.getElementById('museumSearchTag')
const orgDetailsForm = document.getElementById('selectedOrgInfoForm')
const mapContainer = document.getElementById('mapContainer')
const mapSearch = document.querySelector('#searchMap')


// Event Listeners
Array.from(deleteBtn).forEach((el) => {
    el.addEventListener('click', deleteTodo)
})
pickMuseumList.addEventListener('click', displaySearch)
mapSearch.addEventListener('click', showMapDetails)


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

// Display Organization Search or Update Display for Partner Museum
function displaySearch() {
    if (pickMuseumList.selectedIndex > 0) {
        if ('other' === pickMuseumList.options[pickMuseumList.selectedIndex].value) {
            orgSearch.classList.remove('hidden')
            orgDetailsForm.classList.add('hidden')
            addOrgNote.classList.remove('hidden')
        } else if ('caryChildrensMuseum' === pickMuseumList.options[pickMuseumList.selectedIndex].value) {
            orgNameForm.innerText = `Cary Children's Museum`;
            orgAddressForm.innerText = `100 N Main St, Cary NC 27516`
            partnerMuseumFormDisplay()
        } else if ('museumOfClimateSciences' === pickMuseumList.options[pickMuseumList.selectedIndex].value) {
            orgNameForm.innerText = `Museum of Climate Sciences`;
            orgAddressForm.innerText = `500 Sunshine Ln, Raleigh, NC 27202`
            partnerMuseumFormDisplay()
        } else if ('cityOfOaks' === pickMuseumList.options[pickMuseumList.selectedIndex].value) {
            orgNameForm.innerText = `City of Oaks Historical Center`;
            orgAddressForm.innerText = `1587 Sir Walter Ln, Raleigh, NC 27601`
            partnerMuseumFormDisplay()
        } else if ('ncFarmPark' === pickMuseumList.options[pickMuseumList.selectedIndex].value) {
            orgNameForm.innerText = `North Carolina Farm Park & Zoo`;
            orgAddressForm.innerText = `186 Cattlebrush Rd. Durham, NC 27606`
            partnerMuseumFormDisplay()
        }
    }
}

// Display toggles for partner museums
function partnerMuseumFormDisplay() {
    addOrgNote.classList.add('hidden')
    mapContainer.classList.add('hidden')
    orgDetailsForm.classList.remove('hidden')
}

// For Search API - this displays correct divs. API call and subsequent display is in index.ts
function showMapDetails() {
    mapContainer.classList.remove('hidden')
    orgDetailsForm.classList.remove('hidden')
}