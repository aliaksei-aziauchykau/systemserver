const ObjectId = require("mongoose").Types.ObjectId;

class ValueCheckerUtil {

    static isNullOrEmptyString(value) {
        const result = value === undefined || value === null || value === "";
        return result;
    }

    static isValid(value) {
        const result = value !== null && value !== undefined;
        return result;
    }

    static isValidOrDefault(value, defaultValue) {
        const result = this.isValid(value) ? value : defaultValue;
        return result;
    }

    static isValidOrDefaultReturn(value, returnValue, defaultValue = null) {
        const result = this.isValid(value) ? returnValue : defaultValue;
        return result;
    }

    static isValidArguments(args, returnValue = true, defaultValue = null) {
        const hasInvalid = args.some(arg => !this.isValid(arg));
        const result = hasInvalid ? defaultValue : returnValue;
        return result;
    }

    static isValidParamsByCondition(args, condition, message, statusCode) {
        const invalidParams = Object.keys(args).filter(key => condition(args[key], key));
        return { 
            success: invalidParams.length === 0, 
            message: `${message}: ${invalidParams.join(", ")}`,
            statusCode: statusCode || 400
        };
    }

    static isValidParams(args) {
        const result = this.isValidParamsByCondition(args, value => !this.isValid(value), "Request missed the next params")
        return result;
    }

    static isValidObjectIds(args) {
        const result = this.isValidParamsByCondition(args, value => 
            (value.length !== 24 && value.length !== 12) 
            || value.length !== 24 || !(new ObjectId(value).equals(value)), "Request has the invalid params")
        return result;
    }

    static isValidQueryParams(args) {
        const success = Object.keys(args).some(key => 
            key === "helpQueryParams" && args[key] === "true");
        const message = "There are the next query params";
            return { 
                success: !success, 
                message: `${message}: ${Object.keys(args).join(", ")}`,
                statusCode: 400
            };
    }

    static CheckInputParams(response, argIds, argParams, argQueryParams) {
        const validators = [
            this.isValidOrDefaultReturn(argParams, () => this.isValidParams(argParams)),
            this.isValidOrDefaultReturn(argIds, () => this.isValidObjectIds(argIds)),
            this.isValidOrDefaultReturn(argQueryParams, () => this.isValidQueryParams(argQueryParams)),
        ].filter(Boolean);

        for(let validator of validators) {
            const validParamsCheck = validator();
            if(!validParamsCheck.success) {
                response.status(validParamsCheck.statusCode).json({ message: validParamsCheck.message });
                return false;
            }
        }

        return true;
    }

    static ClearObject(obj) {
        Object.keys(obj).filter(key => !this.isValid(obj[key])).forEach(key => delete obj[key]); 
        return obj;
    }
}

module.exports = ValueCheckerUtil