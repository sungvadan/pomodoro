let concentrateElm = document.querySelector('#concentrate')
let shortElm = document.querySelector('#short')
let longElm = document.querySelector('#long')
let stepElm = document.querySelector('#step')

function getValue(elem) {
    let value = elem.value
 
    if (/^\d+$/.test(value) === false || value == 0) {
        value =1         
    }

    elem.value = value

    return parseInt(value)
}

function save(concentrate, short, long, step) {
    localStorage.setItem('setup', JSON.stringify({
        concentrate,
        short,
        long,
        step
    }))
    document.querySelector('.alert').style.display = 'block'
    setTimeout(() => {
        document.querySelector('.alert').style.display = 'none'
        window.location = 'index.html'
    }, 3000);
}

document.querySelector('#save').addEventListener('click', (e) => {
    let concentrate = getValue(concentrateElm)
    let short = getValue(shortElm)
    let long = getValue(longElm)
    let step = getValue(stepElm)
    save(concentrate, short, long, step)
})

document.querySelector('#default').addEventListener('click', (e) => {
    concentrateElm.value = 25
    shortElm.value = 5
    long.value = 30
    step.value = 4
    save(25, 5, 30, 4)
})


let setup = localStorage.getItem('setup')
if (setup === null) {
    setup = {
        concentrate: 25,
        short: 5,
        long: 30,
        step: 4
    }
} else {
    setup = JSON.parse(setup)
}

concentrateElm.value = setup.concentrate
shortElm.value = setup.short
longElm.value = setup.long
stepElm.value = setup.step