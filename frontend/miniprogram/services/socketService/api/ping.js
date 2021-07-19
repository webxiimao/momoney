"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socketUtils_1 = require("../../../utils/socketUtils");
var ping = function () {
    wx.sendSocketMessage({
        data: socketUtils_1.wsRequest({ path: 'ping' }),
    });
};
exports.default = ping;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwREFBc0Q7QUFFdEQsSUFBTSxJQUFJLEdBQUc7SUFDWCxFQUFFLENBQUMsaUJBQWlCLENBQUM7UUFDbkIsSUFBSSxFQUFFLHVCQUFTLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7S0FDaEMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsSUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgd3NSZXF1ZXN0IH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvc29ja2V0VXRpbHMnXG5cbmNvbnN0IHBpbmcgPSAoKSA9PiB7XG4gIHd4LnNlbmRTb2NrZXRNZXNzYWdlKHtcbiAgICBkYXRhOiB3c1JlcXVlc3Qoe3BhdGg6ICdwaW5nJ30pLFxuICB9KVxufVxuZXhwb3J0IGRlZmF1bHQgcGluZ1xuIl19