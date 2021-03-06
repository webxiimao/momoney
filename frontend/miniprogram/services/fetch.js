"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = exports.get = exports.WsUrl = exports.BaseUrl = exports.host = void 0;
exports.host = '172.20.10.3';
exports.BaseUrl = "http://" + exports.host + ":9000";
exports.WsUrl = "ws://" + exports.host + ":8888";
var fetch = function (options) {
    var url = options.url, data = options.data, method = options.method;
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: data,
            method: method,
            complete: function (res) {
                var data = res.data;
                if (data.status !== 0) {
                    reject(data);
                }
                else {
                    resolve(data);
                }
            }
        });
    });
};
var get = function (url, data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, fetch({ url: url, data: data, method: "GET" })];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.get = get;
var post = function (url, data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, fetch({ url: url, data: data, method: "POST" })];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.post = post;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmZXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRYSxRQUFBLElBQUksR0FBRyxhQUFhLENBQUE7QUFFcEIsUUFBQSxPQUFPLEdBQUcsWUFBVSxZQUFJLFVBQU8sQ0FBQTtBQUMvQixRQUFBLEtBQUssR0FBRyxVQUFRLFlBQUksVUFBTyxDQUFBO0FBRXhDLElBQU0sS0FBSyxHQUFHLFVBQUMsT0FBZ0I7SUFDckIsSUFBQSxHQUFHLEdBQW1CLE9BQU8sSUFBMUIsRUFBRSxJQUFJLEdBQWEsT0FBTyxLQUFwQixFQUFFLE1BQU0sR0FBSyxPQUFPLE9BQVosQ0FBWTtJQUNyQyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07UUFDakMsRUFBRSxDQUFDLE9BQU8sQ0FBQztZQUNULEdBQUcsS0FBQTtZQUNILElBQUksTUFBQTtZQUNKLE1BQU0sUUFBQTtZQUNOLFFBQVEsRUFBUixVQUFTLEdBQVE7Z0JBQ2YsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtnQkFDckIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtvQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO2lCQUNiO3FCQUFNO29CQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtpQkFDZDtZQUNILENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQUVNLElBQU0sR0FBRyxHQUFHLFVBQU8sR0FBVyxFQUFFLElBQVM7OztvQkFDdkMsV0FBTSxLQUFLLENBQUMsRUFBRSxHQUFHLEtBQUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQTtvQkFBaEQsV0FBTyxTQUF5QyxFQUFBOzs7S0FDakQsQ0FBQTtBQUZZLFFBQUEsR0FBRyxPQUVmO0FBRU0sSUFBTSxJQUFJLEdBQUcsVUFBTyxHQUFXLEVBQUUsSUFBUzs7O29CQUN4QyxXQUFNLEtBQUssQ0FBQyxFQUFFLEdBQUcsS0FBQSxFQUFFLElBQUksTUFBQSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFBO29CQUFqRCxXQUFPLFNBQTBDLEVBQUE7OztLQUNsRCxDQUFBO0FBRlksUUFBQSxJQUFJLFFBRWhCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFd4IGZyb20gXCJ0eXBlcy93eC9pbmRleFwiXG4vLyDor7fmsYLlupNcbmludGVyZmFjZSBPcHRpb25zIHtcbiAgdXJsOiBzdHJpbmcsXG4gIGRhdGE6IGFueSxcbiAgW2tleTogc3RyaW5nXTogYW55XG59XG5cbmV4cG9ydCBjb25zdCBob3N0ID0gJzE3Mi4yMC4xMC4zJ1xuXG5leHBvcnQgY29uc3QgQmFzZVVybCA9IGBodHRwOi8vJHtob3N0fTo5MDAwYFxuZXhwb3J0IGNvbnN0IFdzVXJsID0gYHdzOi8vJHtob3N0fTo4ODg4YFxuXG5jb25zdCBmZXRjaCA9IChvcHRpb25zOiBPcHRpb25zKSA9PiB7XG4gIGNvbnN0IHsgdXJsLCBkYXRhLCBtZXRob2QgfSA9IG9wdGlvbnNcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB3eC5yZXF1ZXN0KHtcbiAgICAgIHVybCxcbiAgICAgIGRhdGEsXG4gICAgICBtZXRob2QsXG4gICAgICBjb21wbGV0ZShyZXM6IGFueSl7XG4gICAgICAgIGNvbnN0IGRhdGEgPSByZXMuZGF0YVxuICAgICAgICBpZiAoZGF0YS5zdGF0dXMgIT09IDApIHtcbiAgICAgICAgICByZWplY3QoZGF0YSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKGRhdGEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgZ2V0ID0gYXN5bmMgKHVybDogc3RyaW5nLCBkYXRhOiBhbnkpID0+IHtcbiAgcmV0dXJuIGF3YWl0IGZldGNoKHsgdXJsLCBkYXRhLCBtZXRob2Q6IFwiR0VUXCIgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHBvc3QgPSBhc3luYyAodXJsOiBzdHJpbmcsIGRhdGE6IGFueSkgPT4ge1xuICByZXR1cm4gYXdhaXQgZmV0Y2goeyB1cmwsIGRhdGEsIG1ldGhvZDogXCJQT1NUXCIgfSlcbn1cbiJdfQ==