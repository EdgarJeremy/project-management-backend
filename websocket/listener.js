module.exports = {

    _users: [],
    _io: null,

    listen: function(io) {
        this._io = io;
        this._io.on("connection", (socket) => {
            socket.on("disconnect", () => {
                this.removeUser(socket.id);
            });
            socket.on("get_user", (meta) => {
                let back = {};
                back.from = this.findUserById(meta.from);
                back.to = this.findUserById(meta.to);
                socket.emit("on_receive_user_sockets", back);
            });
            socket.on("typing", (meta) => {
                io.sockets.connected[meta.socketTo.socketid].emit("on_receive_typing", meta);
            });
            socket.on("get_all_online", () => {
                socket.emit("on_receive_all_online", this._users);
            })
        });
    },

    addUser: function(user) {
        if(user.socketid) {
            if(!this.findUser(user.socketid)) {
                this._users.push(user);
                this.broadcast("on_receive_all_online", this._users);
                console.log(`Joined : ${user.socketid}`, this._users);
            }
        }
    },

    removeUser: function(socketid) {
        for(let i = 0; i < this._users.length; i++) {
            if(this._users[i].socketid === socketid) {
                this._users.splice(i, 1);
                this.broadcast("on_receive_all_online", this._users);
                console.log(`Kicked : ${socketid}`, this._users);
            }
        }
    },

    findUser: function(socketid) {
        for(let i = 0; i < this._users.length; i++) {
            if(this._users[i].socketid === socketid)
                return this._users[i];
        }
        return false;
    },

    findUserById: function(id_pengguna) {
        for(let i = 0; i < this._users.length; i++) {
            if(this._users[i].id_pengguna === id_pengguna) {
                return this._users[i];
            }
        }
        return false;
    },

    findSocket: function(socketid) {
        return this._io.sockets.connected[socketid];
    },

    findSocketById: function(id_pengguna) {
        for(let i = 0; i < this._users.length; i++) {
            if(this._users[i].id_pengguna == id_pengguna) {
                return this._io.sockets.connected[this._users[i].socketid];
            }
        }
        return null;
    },

    broadcast: function(event, data) {
        this._io.emit(event, data);
    }

}