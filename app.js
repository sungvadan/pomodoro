class Pomodoros {
    constructor(selectorDisplay, selectorStart, selectorReset, selectorAlarm, selectorVolume, pomodorosMinute, pomodorosSecond) {
        this.display = document.querySelector(selectorDisplay)
        this.btnStart = document.querySelector(selectorStart)
        this.btnReset = document.querySelector(selectorReset)
        this.btnVolume = document.querySelector(selectorVolume)
        this.alarm = document.querySelector(selectorAlarm)
        this.pomodorosMinute = pomodorosMinute
        this.pomodorosSecond = pomodorosSecond
        this.currentMinute = this.pomodorosMinute
        this.currentSecond = this.pomodorosSecond
        this.isRunning = false
        this.timer = null
        this.soundOn = true

        this.btnStart.addEventListener('click', e => {
            this.toogleRunning()
        })
        
        this.btnReset.addEventListener('click', e => {
            this.reset()
        })

        this.btnVolume.addEventListener('click', e => {
            this.toogleSound()
        })
        
        document.addEventListener('keydown', e => {
            if (e.code === 'Enter' || e.code === 'Space') {
                this.toogleRunning()
                e.preventDefault()
                e.stopPropagation()
            } else if (e.code === 'Escape') {
                this.reset()
                e.preventDefault()
                e.stopPropagation()
            }
        })
        this.showTime()
    }

    showTime() {
        let minuteShow = (this.currentMinute < 10) ? `0${this.currentMinute}` : this.currentMinute 
        let secondShow = (this.currentSecond < 10) ? `0${this.currentSecond}` : this.currentSecond 
        this.display.innerText = `${minuteShow}:${secondShow}`
        document.title = `${minuteShow}:${secondShow}`
    }

    runTimer() {
        if (this.currentMinute === 0 && this.currentSecond === 1) {
            this.currentMinute = this.pomodorosMinute
            this.currentSecond = this.pomodorosSecond
            this.save()
            this.toogleRunning()
            if (this.soundOn) {
                this.alarm.play()
            }
        } else if (this.currentSecond === 0) {
            this.currentSecond = 59
            this.currentMinute -= 1 
        } else {
            this.currentSecond -= 1
        }
        this.showTime()
    }

    toogleRunning() {
        this.isRunning = !this.isRunning
        if (this.isRunning) {
            this.timer = setInterval(() => {
                this.runTimer()
            }, 1000)
            this.btnStart.innerText = 'Pause'
        } else {
            clearInterval(this.timer)
            let btnLabel = (this.currentMinute === this.pomodorosMinute && this.currentSecond === this.pomodorosSecond)? 'Start' : 'Continue'
            this.btnStart.innerText = btnLabel
        }
    }
    
    toogleSound() {
        this.soundOn = !this.soundOn
        if (this.soundOn) {
            this.btnVolume.setAttribute('src', 'volume-up.svg')
        } else {
            this.btnVolume.setAttribute('src', 'volume-mute.svg')
        }
    }

    reset() {
        this.isRunning = false
        this.btnStart.innerText = 'Start'
        clearInterval(this.timer)
        this.currentMinute = this.pomodorosMinute
        this.currentSecond = this.pomodorosSecond
        this.showTime()
    }

    save() {
        let pomodoro = localStorage.getItem('pomodoro')
        if (pomodoro === undefined || pomodoro === null) {
            pomodoro = []
        } else {
            pomodoro = JSON.parse(pomodoro)
        }
        let date = new Date();
        let dateFormat= date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
        pomodoro.push(dateFormat)
        localStorage.setItem('pomodoro', JSON.stringify(pomodoro))
    }
}

new Pomodoros('#time', '#start', '#reset', '#alarm', '#volume', 0, 2)