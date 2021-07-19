"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketResponse = exports.wsRequest = void 0;
function wsRequest(data) {
    return JSON.stringify(data);
}
exports.wsRequest = wsRequest;
function getSocketResponse(rawData) {
    var res = JSON.parse(rawData);
    if (res.status === 0) {
        return {
            flag: res.data.flag,
            props: res.data.props
        };
    }
    else {
        throw new Error('接口请求错误');
    }
}
exports.getSocketResponse = getSocketResponse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0VXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzb2NrZXRVdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxTQUFnQixTQUFTLENBQUMsSUFBUztJQUNqQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDN0IsQ0FBQztBQUZELDhCQUVDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQUMsT0FBZTtJQUMvQyxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQy9CLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDcEIsT0FBTztZQUNMLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUk7WUFDbkIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSztTQUN0QixDQUFBO0tBQ0Y7U0FBSztRQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDMUI7QUFDSCxDQUFDO0FBVkQsOENBVUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gd3NSZXF1ZXN0KGRhdGE6IGFueSkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNvY2tldFJlc3BvbnNlKHJhd0RhdGE6IHN0cmluZyk6IHtmbGFnOiBzdHJpbmcsIHByb3BzOiBhbnl9IHtcbiAgY29uc3QgcmVzID0gSlNPTi5wYXJzZShyYXdEYXRhKVxuICBpZiAocmVzLnN0YXR1cyA9PT0gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBmbGFnOiByZXMuZGF0YS5mbGFnLFxuICAgICAgcHJvcHM6IHJlcy5kYXRhLnByb3BzXG4gICAgfVxuICB9ZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCfmjqXlj6Por7fmsYLplJnor68nKVxuICB9XG59XG4iXX0=