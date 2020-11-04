class PTime {
    constructor(initMinute, title) {
        this.title = title
        this.initMinute = initMinute
        this.currentMinute = initMinute
        this.currentSecond = 0
    }

    reset() {
        this.currentMinute = this.initMinute
        this.currentSecond = 0
    }

    decrement() {
        if (this.currentMinute === 0 && this.currentSecond === 0) {
            return;
        }

        if (this.currentSecond === 0) {
            this.currentSecond = 59
            this.currentMinute -= 1 
        } else {
            this.currentSecond -= 1
        }
    }

    getTime() {
        return {
            minute: this.currentMinute,
            second: this.currentSecond
        }
    }

    getTitle() {
        return this.title
    }

    isInit() {
        return this.currentMinute === this.initMinute && this.currentSecond === 0
    }
}



class Pomodoros {
    constructor(selectorDisplay, selectorStart, selectorReset, selectorAlarm, selectorVolume, selectorTitle, selectorNext, cycles, soundOn) {
        this.title = document.querySelector(selectorTitle)
        this.display = document.querySelector(selectorDisplay)
        this.btnStart = document.querySelector(selectorStart)
        this.btnReset = document.querySelector(selectorReset)
        this.btnVolume = document.querySelector(selectorVolume)
        this.alarm = document.querySelector(selectorAlarm)
        this.next = document.querySelector(selectorNext)
        this.isRunning = false
        this.timer = null
        this.current = null
        this.soundOn = soundOn
        this.cycles = cycles
        this.positionInCycles = -1

        this.changeCycle()

        this.btnStart.addEventListener('click', e => {
            this.toogleRunning()
        })
        
        this.btnReset.addEventListener('click', e => {
            this.reset()
        })

        this.next.addEventListener('click', e => {
            this.changeCycle()
        })

        this.btnVolume.addEventListener('click', e => {
            this.toogleSound()
        })
        
        document.addEventListener('keydown', e => {
            if (e.code === 'Space') {
                this.toogleRunning()
                e.preventDefault()
                e.stopPropagation()
            }
        })
        this.show()
        this.showSound()
    }

    show() {
        let time = this.current.getTime()
        let minuteShow = (time.minute < 10) ? `0${time.minute}` : time.minute 
        let secondShow = (time.second < 10) ? `0${time.second}` : time.second 
        this.display.innerText = `${minuteShow}:${secondShow}`
        document.title = `${minuteShow}:${secondShow}`
        if (this.isRunning) {
            this.btnStart.innerText = 'Pause'
        } else if (this.current.isInit()){
            this.btnStart.innerText = 'Start'
        } else {
            this.btnStart.innerText = 'Continue'
        }
    }

    runTimer() {
        this.current.decrement()
        let time = this.current.getTime()

        if (time.minute === 0 && time.second === 0) {
            this.save()
            this.playAlarm()
            this.changeCycle()
            if (this.positionInCycles%2 === 0) {
                this.toogleRunning()
            }
        }
        this.show()
    }

    toogleRunning() {
        this.isRunning = !this.isRunning
        if (this.isRunning) {
            this.timer = setInterval(() => {
                this.runTimer()
            }, 1000)
        } else {
            clearInterval(this.timer)
        }
        this.show()
    }
    
    toogleSound() {
        this.soundOn = !this.soundOn
        this.showSound()
        localStorage.setItem('soundOn', this.soundOn)
    }

    showSound() {
        if (this.soundOn) {
            this.btnVolume.setAttribute('src', 'assets/images/volume-up.svg')
        } else {
            
            this.btnVolume.setAttribute('src', 'assets/images/volume-mute.svg')
        }
    }

    playAlarm() {
        if (this.soundOn) {
            this.alarm.play()
        }
    }

    changeCycle() {
        this.positionInCycles = this.positionInCycles + 1
        if (this.positionInCycles >= this.cycles.length) {
            this.positionInCycles = 0
        }
        if (this.current !== null) {
            this.current.reset()
        }
        this.current = this.cycles[this.positionInCycles]

        let state = Math.floor(this.positionInCycles / 2) + 1
        this.title.innerText = `${this.current.getTitle()} (#${state})`
        document.body.className = this.current.getTitle()
        this.show()
    }

    reset() {
        this.isRunning = false
        clearInterval(this.timer)
        this.current.reset()
        this.show()
    }

    save() {
        let pomodoro = localStorage.getItem('pomodoro')
        if (pomodoro === undefined || pomodoro === null) {
            pomodoro = {}
        } else {
            pomodoro = JSON.parse(pomodoro)
        }
        let date = new Date();
        let dateFormat= date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
        pomodoro[dateFormat] = this.current.getTitle()
        localStorage.setItem('pomodoro', JSON.stringify(pomodoro))
    }
}

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

let cycles = []
for (let i = 1; i <= setup.step * 2; i++ ) {
    if (i%2 != 0) {
        cycles.push(new PTime(setup.concentrate, 'Concentrate'))
    } else if (i == setup.step * 2) {
        cycles.push(new PTime(setup.long, 'Long Pause'))
    } else {
        cycles.push(new PTime(setup.short, 'Short Pause'))
    }
}

let soundOn = localStorage.getItem('soundOn') 
if (soundOn === null) {
    soundOn = true
} else {
    soundOn = soundOn == 'true' ? true : false
    
}
new Pomodoros('#time', '#start', '#reset', '#alarm', '#volume', '#title', '#next', cycles, soundOn)