//DressingRoom.js
module.exports = {
    RequestRoom: function () {
        roomWaitTime = GenerateRandomRooms(3);
        return roomWaitTime;
    }
}

function GenerateRandomRooms(highValue) {
    return Math.ceil(Math.random() * highValue)
}