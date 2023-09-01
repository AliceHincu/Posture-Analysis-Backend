import { ErrorDetails, ErrorDetailsAnterior, ErrorDetailsLateral } from "entities/types/communicationSocket";
import { messageFactory } from "./MessageFactory";

/**
 * Using the builder pattern will streamline your code and make it more readable. When we integrate this pattern and combine it with the conditional checks, the goal is to minimize direct string concatenation and control structures related to building the error message.

For better chaining, you can make your builder methods accept conditions as parameters, and build the message based on that condition. This way, you're moving the conditional logic into the builder itself.
 */
export class AnteriorPostureErrorMessageBuilder {
  private static instance: AnteriorPostureErrorMessageBuilder;
  private errorMessage: string;
  private errorDetails: ErrorDetailsAnterior;

  private constructor() {
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

  public static getInstance(): AnteriorPostureErrorMessageBuilder {
    if (!AnteriorPostureErrorMessageBuilder.instance) {
      AnteriorPostureErrorMessageBuilder.instance = new AnteriorPostureErrorMessageBuilder();
    }
    return AnteriorPostureErrorMessageBuilder.instance;
  }

  reset(): AnteriorPostureErrorMessageBuilder {
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

  addElbowsFarMessage(condition: boolean) {
    this.errorDetails.elbowsTooFar = condition;
    if (condition) this.errorMessage += messageFactory.getMessage("ELBOWS_FAR").message;
    return this; // Important: Return the instance for chaining
  }

  addUserCloseMessage(condition: boolean) {
    this.errorDetails.userTooClose = condition;
    if (condition) this.errorMessage += messageFactory.getMessage("CLOSE_TO_SCREEN").message;
    return this;
  }

  addPersonLeanMessage(leanDirection: "LEFT" | "RIGHT" | "STRAIGHT") {
    this.errorDetails.userLeaning = leanDirection !== "STRAIGHT";
    if (leanDirection === "LEFT") {
      this.errorMessage += messageFactory.getMessage("LEANING_LEFT").message;
    } else if (leanDirection === "RIGHT") {
      this.errorMessage += messageFactory.getMessage("LEANING_RIGHT").message;
    }
    return this;
  }

  addHeadStraightMessage(condition: boolean) {
    this.errorDetails.headHunched = condition;
    if (condition) this.errorMessage += messageFactory.getMessage("HEAD_STRAIGHT").message;
    return this;
  }

  addShouldersStraightMessage(condition: boolean) {
    this.errorDetails.shouldersHunched = condition;
    if (condition) this.errorMessage += messageFactory.getMessage("SHOULDERS_STRAIGHT").message;
    return this;
  }

  addBothStraightMessage(condition: boolean) {
    if (condition) this.errorMessage += messageFactory.getMessage("BOTH_STRAIGHT").message;
    return this;
  }

  addHeadTurnedMessage(condition: boolean) {
    this.errorDetails.headTurned = condition;
    if (condition) this.errorMessage += messageFactory.getMessage("HEAD_TURNED").message;
    return this;
  }

  build(): { message: string; details: ErrorDetails } {
    return { message: this.errorMessage, details: this.errorDetails };
  }
}

export class LateralPostureErrorMessageBuilder {
  private static instance: LateralPostureErrorMessageBuilder;
  private errorMessage: string;
  private errorDetails: ErrorDetailsLateral;

  private constructor() {
    this.errorMessage = "";
    this.errorDetails = {
      headHunched: false,
      shouldersHunched: false,
    };
  }

  public static getInstance(): LateralPostureErrorMessageBuilder {
    if (!LateralPostureErrorMessageBuilder.instance) {
      LateralPostureErrorMessageBuilder.instance = new LateralPostureErrorMessageBuilder();
    }
    return LateralPostureErrorMessageBuilder.instance;
  }

  reset(): LateralPostureErrorMessageBuilder {
    this.errorMessage = "";
    this.errorDetails = {
      headHunched: false,
      shouldersHunched: false,
    };
    return this;
  }

  addHeadStraightMessage(condition: boolean) {
    this.errorDetails.headHunched = condition;
    if (condition) this.errorMessage += messageFactory.getMessage("HEAD_STRAIGHT").message;
    return this;
  }

  addShouldersStraightMessage(condition: boolean) {
    this.errorDetails.shouldersHunched = condition;
    if (condition) this.errorMessage += messageFactory.getMessage("SHOULDERS_STRAIGHT").message;
    return this;
  }

  build(): { message: string; details: ErrorDetails } {
    return { message: this.errorMessage, details: this.errorDetails };
  }
}
