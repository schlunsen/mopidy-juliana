let singleton;

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

class WSController {
    constructor(domain, token, app) {
        this.token = token;
        this.$store = app.store;
        this.$app = app.store;

        this.api_domain = `${domain}/mopidy/ws/`
        
        this.connected = false;

        this.liveDataIds =  {}

        this.joinedStables = {};


        this.disconnect_retries = 0;

        if (!singleton) {
            singleton = this;
            this.init()
        }

        return singleton
    }
    init() {
        
        

        this.socket = new WebSocket(this.api_domain)

        this.socket.onmessage = this.onmessage.bind(this);
        this.socket.onopen = this.onconnect.bind(this)
        this.socket.onclose =  (e) => {
            
            
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(() => {
                this.init();
            }, 1000);
        }




    }

    // XXX 
    async isConnected() {
        let that = this;
        return new Promise(resolve => {
            let checkConnectedInterval = setInterval(() => {

                if (that.connected) {
                    clearInterval(checkConnectedInterval)
                    resolve()
                }
                
            }, 500);

        });
    }

    

    sendMessage(msg) {
        let data = {
            
        }

        this.socket.send(JSON.stringify(data))
    }

    

    log(message, logType = "default") {
        if (this.console) {
            this.console.log(message, logType)
        }
    }

    onmessage(msg) {
        this.log(msg)
        let data = JSON.parse(msg.data)

        this.log(data, 'default')
        

    }
    onconnect() {
        this.connected = true;
    }

    getSocket() {
        return this.socket;
    }





    disconnect() {
        EventBus.$emit('socket_disconnected');
        this.socket.off('disconnect', this.disconnect)
        setTimeout(() => {
            
            this.socket = null;
            this.init()
        }, 1000)

    }
}




export {
    WSController
}
