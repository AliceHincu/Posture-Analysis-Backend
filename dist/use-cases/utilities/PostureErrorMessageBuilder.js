"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LateralPostureErrorMessageBuilder = exports.AnteriorPostureErrorMessageBuilder = void 0;
const MessageFactory_1 = require("./MessageFactory");
/**
 * Using the builder pattern will streamline your code and make it more readable. When we integrate this pattern and combine it with the conditional checks, the goal is to minimize direct string concatenation and control structures related to building the error message.

For better chaining, you can make your builder methods accept conditions as parameters, and build the message based on that condition. This way, you're moving the conditional logic into the builder itself.
 */
class AnteriorPostureErrorMessageBuilder {
    constructor() {
        this.errorMessage = "";
        this.errorDetails = {
            elbowsTooFar: false,
            userTooClose: false,
            userLeaning: false,
            shouldersHunched: false,
            headHunched: false,
            headTurned: false,
        };
    }
    static getInstance() {
        if (!AnteriorPostureErrorMessageBuilder.instance) {
            AnteriorPostureErrorMessageBuilder.instance = new AnteriorPostureErrorMessageBuilder();
        }
        return AnteriorPostureErrorMessageBuilder.instance;
    }
    reset() {
        this.errorMessage = "";
        this.errorDetails = {
            elbowsTooFar: false,
            userTooClose: false,
            userLeaning: false,
            shouldersHunched: false,
            headHunched: false,
            headTurned: false,
        };
        return this;
    }
    addElbowsFarMessage(condition) {
        this.errorDetails.elbowsTooFar = condition;
        if (condition)
            this.errorMessage += MessageFactory_1.messageFactory.getMessage("ELBOWS_FAR").message;
        return this; // Important: Return the instance for chaining
    }
    addUserCloseMessage(condition) {
        this.errorDetails.userTooClose = condition;
        if (condition)
            this.errorMessage += MessageFactory_1.messageFactory.getMessage("CLOSE_TO_SCREEN").message;
        return this;
    }
    addPersonLeanMessage(leanDirection) {
        this.errorDetails.userLeaning = leanDirection !== "STRAIGHT";
        if (leanDirection === "LEFT") {
            this.errorMessage += MessageFactory_1.messageFactory.getMessage("LEANING_LEFT").message;
        }
        else if (leanDirection === "RIGHT") {
            this.errorMessage += MessageFactory_1.messageFactory.getMessage("LEANING_RIGHT").message;
        }
        return this;
    }
    addHeadStraightMessage(condition) {
        this.errorDetails.headHunched = condition;
        if (condition)
            this.errorMessage += MessageFactory_1.messageFactory.getMessage("HEAD_STRAIGHT").message;
        return this;
    }
    addShouldersStraightMessage(condition) {
        this.errorDetails.shouldersHunched = condition;
        if (condition)
            this.errorMessage += MessageFactory_1.messageFactory.getMessage("SHOULDERS_STRAIGHT").message;
        return this;
    }
    addBothStraightMessage(condition) {
        if (condition)
            this.errorMessage += MessageFactory_1.messageFactory.getMessage("BOTH_STRAIGHT").message;
        return this;
    }
    addHeadTurnedMessage(condition) {
        this.errorDetails.headTurned = condition;
        if (condition)
            this.errorMessage += MessageFactory_1.messageFactory.getMessage("HEAD_TURNED").message;
        return this;
    }
    build() {
        return { message: this.errorMessage, details: this.errorDetails };
    }
}
exports.AnteriorPostureErrorMessageBuilder = AnteriorPostureErrorMessageBuilder;
class LateralPostureErrorMessageBuilder {
    constructor() {
        this.errorMessage = "";
        this.errorDetails = {
            headHunched: false,
            shouldersHunched: false,
        };
    }
    static getInstance() {
        if (!LateralPostureErrorMessageBuilder.instance) {
            LateralPostureErrorMessageBuilder.instance = new LateralPostureErrorMessageBuilder();
        }
        return LateralPostureErrorMessageBuilder.instance;
    }
    reset() {
        this.errorMessage = "";
        this.errorDetails = {
            headHunched: false,
            shouldersHunched: false,
        };
        return this;
    }
    addHeadStraightMessage(condition) {
        this.errorDetails.headHunched = condition;
        if (condition)
            this.errorMessage += MessageFactory_1.messageFactory.getMessage("HEAD_STRAIGHT").message;
        return this;
    }
    addShouldersStraightMessage(condition) {
        this.errorDetails.shouldersHunched = condition;
        if (condition)
            this.errorMessage += MessageFactory_1.messageFactory.getMessage("SHOULDERS_STRAIGHT").message;
        return this;
    }
    build() {
        return { message: this.errorMessage, details: this.errorDetails };
    }
}
exports.LateralPostureErrorMessageBuilder = LateralPostureErrorMessageBuilder;
//# sourceMappingURL=PostureErrorMessageBuilder.js.map