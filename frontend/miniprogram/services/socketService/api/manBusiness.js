"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socketUtils_1 = require("../../../utils/socketUtils");
var manBusiness = function (props) {
    wx.sendSocketMessage({
        data: socketUtils_1.wsRequest({ path: 'man_business', props: props }),
    });
};
exports.default = manBusiness;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuQnVzaW5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYW5CdXNpbmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBEQUFzRDtBQU90RCxJQUFNLFdBQVcsR0FBRyxVQUFDLEtBQVk7SUFDL0IsRUFBRSxDQUFDLGlCQUFpQixDQUFDO1FBQ25CLElBQUksRUFBRSx1QkFBUyxDQUFDLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7S0FDdEQsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgd3NSZXF1ZXN0IH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvc29ja2V0VXRpbHMnXG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIGFtb3VudDogbnVtYmVyLFxuICByZWNlaXZlVW5pb25JZDogc3RyaW5nXG59XG5cbmNvbnN0IG1hbkJ1c2luZXNzID0gKHByb3BzOiBQcm9wcykgPT4ge1xuICB3eC5zZW5kU29ja2V0TWVzc2FnZSh7XG4gICAgZGF0YTogd3NSZXF1ZXN0KHtwYXRoOiAnbWFuX2J1c2luZXNzJywgcHJvcHM6IHByb3BzfSksXG4gIH0pXG59XG5leHBvcnQgZGVmYXVsdCBtYW5CdXNpbmVzc1xuIl19