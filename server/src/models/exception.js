"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Exception = void 0;
var Exception = /** @class */ (function (_super) {
    __extends(Exception, _super);
    function Exception(message, status) {
        if (status === void 0) { status = 500; }
        var _this = _super.call(this) || this;
        _this.name = 'Express Exception';
        _this.message = message;
        _this.status = status;
        _this.code = status.toString();
        return _this;
    }
    return Exception;
}(Error));
exports.Exception = Exception;
