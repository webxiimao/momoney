"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socketUtils_1 = require("../../../utils/socketUtils");
var over = function () {
    wx.sendSocketMessage({
        data: socketUtils_1.wsRequest({ path: 'game_over', props: {} }),
    });
};
exports.default = over;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Zlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm92ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwREFBc0Q7QUFFdEQsSUFBTSxJQUFJLEdBQUc7SUFDWCxFQUFFLENBQUMsaUJBQWlCLENBQUM7UUFDbkIsSUFBSSxFQUFFLHVCQUFTLENBQUMsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUMsQ0FBQztLQUNoRCxDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFDRCxrQkFBZSxJQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB3c1JlcXVlc3QgfSBmcm9tICcuLi8uLi8uLi91dGlscy9zb2NrZXRVdGlscydcblxuY29uc3Qgb3ZlciA9ICgpID0+IHtcbiAgd3guc2VuZFNvY2tldE1lc3NhZ2Uoe1xuICAgIGRhdGE6IHdzUmVxdWVzdCh7cGF0aDogJ2dhbWVfb3ZlcicsIHByb3BzOiB7fX0pLFxuICB9KVxufVxuZXhwb3J0IGRlZmF1bHQgb3ZlclxuIl19