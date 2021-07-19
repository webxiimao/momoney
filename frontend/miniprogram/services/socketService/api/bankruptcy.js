"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socketUtils_1 = require("../../../utils/socketUtils");
var bankruptcy = function () {
    wx.sendSocketMessage({
        data: socketUtils_1.wsRequest({ path: 'bankruptcy', props: {} }),
    });
};
exports.default = bankruptcy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFua3J1cHRjeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhbmtydXB0Y3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwREFBc0Q7QUFFdEQsSUFBTSxVQUFVLEdBQUc7SUFDakIsRUFBRSxDQUFDLGlCQUFpQixDQUFDO1FBQ25CLElBQUksRUFBRSx1QkFBUyxDQUFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFDLENBQUM7S0FDakQsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsVUFBVSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgd3NSZXF1ZXN0IH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvc29ja2V0VXRpbHMnXG5cbmNvbnN0IGJhbmtydXB0Y3kgPSAoKSA9PiB7XG4gIHd4LnNlbmRTb2NrZXRNZXNzYWdlKHtcbiAgICBkYXRhOiB3c1JlcXVlc3Qoe3BhdGg6ICdiYW5rcnVwdGN5JywgcHJvcHM6IHt9fSksXG4gIH0pXG59XG5leHBvcnQgZGVmYXVsdCBiYW5rcnVwdGN5XG4iXX0=