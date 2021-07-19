"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var login_1 = require("./api/login");
var start_1 = require("./api/start");
var bankBusiness_1 = require("./api/bankBusiness");
var manBusiness_1 = require("./api/manBusiness");
var over_1 = require("./api/over");
var ping_1 = require("./api/ping");
var bankruptcy_1 = require("./api/bankruptcy");
wx.onSocketError(function (err) {
    console.log('socket失败');
    console.error(err);
});
exports.default = {
    login: login_1.default,
    start: start_1.default,
    bankBusiness: bankBusiness_1.default,
    manBusiness: manBusiness_1.default,
    over: over_1.default,
    bankruptcy: bankruptcy_1.default,
    ping: ping_1.default
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZFNvY2tldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlbmRTb2NrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBK0I7QUFDL0IscUNBQStCO0FBQy9CLG1EQUE2QztBQUM3QyxpREFBMkM7QUFDM0MsbUNBQTZCO0FBQzdCLG1DQUE2QjtBQUM3QiwrQ0FBeUM7QUFFekMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxVQUFBLEdBQUc7SUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXJCLENBQUMsQ0FBQyxDQUFBO0FBRUYsa0JBQWU7SUFDYixLQUFLLGlCQUFBO0lBQ0wsS0FBSyxpQkFBQTtJQUNMLFlBQVksd0JBQUE7SUFDWixXQUFXLHVCQUFBO0lBQ1gsSUFBSSxnQkFBQTtJQUNKLFVBQVUsc0JBQUE7SUFDVixJQUFJLGdCQUFBO0NBQ0wsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsb2dpbiBmcm9tICcuL2FwaS9sb2dpbidcbmltcG9ydCBzdGFydCBmcm9tICcuL2FwaS9zdGFydCdcbmltcG9ydCBiYW5rQnVzaW5lc3MgZnJvbSAnLi9hcGkvYmFua0J1c2luZXNzJ1xuaW1wb3J0IG1hbkJ1c2luZXNzIGZyb20gJy4vYXBpL21hbkJ1c2luZXNzJ1xuaW1wb3J0IG92ZXIgZnJvbSAnLi9hcGkvb3ZlcidcbmltcG9ydCBwaW5nIGZyb20gJy4vYXBpL3BpbmcnXG5pbXBvcnQgYmFua3J1cHRjeSBmcm9tICcuL2FwaS9iYW5rcnVwdGN5J1xuXG53eC5vblNvY2tldEVycm9yKGVyciA9PiB7XG4gIGNvbnNvbGUubG9nKCdzb2NrZXTlpLHotKUnKTtcbiAgY29uc29sZS5lcnJvcihlcnIpO1xuICBcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbG9naW4sXG4gIHN0YXJ0LFxuICBiYW5rQnVzaW5lc3MsXG4gIG1hbkJ1c2luZXNzLFxuICBvdmVyLFxuICBiYW5rcnVwdGN5LFxuICBwaW5nXG59Il19