"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSE_LANDMARKS = exports.THRESHOLD_VALUES_LATERAL = exports.THRESHOLD_VALUES_ANTERIOR = exports.ThresholdStrictnessSchema = exports.PostureViewSchema = exports.PostureView = exports.LandmarkDictSchema = exports.LandmarkSchema = void 0;
const yup = __importStar(require("yup"));
exports.LandmarkSchema = yup.object().shape({
    x: yup.number().required(),
    y: yup.number().required(),
    z: yup.number().required(),
    visibility: yup.number().min(0).max(1), // Adjust validation as needed
});
exports.LandmarkDictSchema = yup.object().shape({
    landmarks: yup.lazy((value) => yup
        .object()
        .shape(Object.keys(value || {}).reduce((shape, key) => {
        // This condition ensures the key is a number
        if (!isNaN(Number(key))) {
            return Object.assign(Object.assign({}, shape), { [key]: exports.LandmarkSchema });
        }
        return shape;
    }, {}))
        .required()
        .test("has-keys", "must have at least one key-value pair", (value) => value && Object.keys(value).length > 0)),
});
var PostureView;
(function (PostureView) {
    PostureView["ANTERIOR"] = "anterior";
    PostureView["LATERAL"] = "lateral";
})(PostureView || (exports.PostureView = PostureView = {}));
exports.PostureViewSchema = yup.string().oneOf(Object.values(PostureView)).required();
exports.ThresholdStrictnessSchema = yup.string().oneOf(["Gentle", "Moderate", "Strict"]).required();
exports.THRESHOLD_VALUES_ANTERIOR = {
    Gentle: {
        ALIGNMENT_SHOULDERS_THRESHOLD: 0.055,
        ALIGNMENT_EYES_THRESHOLD: 0.075,
        LEAN_THRESHOLD: 0.1,
        SHOULDER_ELBOW_DEGREE_THRESHOLD: 27.5,
    },
    Moderate: {
        ALIGNMENT_SHOULDERS_THRESHOLD: 0.035,
        ALIGNMENT_EYES_THRESHOLD: 0.05,
        LEAN_THRESHOLD: 0.07,
        SHOULDER_ELBOW_DEGREE_THRESHOLD: 22.5,
    },
    Strict: {
        ALIGNMENT_SHOULDERS_THRESHOLD: 0.025,
        ALIGNMENT_EYES_THRESHOLD: 0.025,
        LEAN_THRESHOLD: 0.03,
        SHOULDER_ELBOW_DEGREE_THRESHOLD: 17.5,
    },
};
exports.THRESHOLD_VALUES_LATERAL = {
    Gentle: {
        NECK_INCLINATION_THRESHOLD: 25,
        TORSO_INCLINATION_THRESHOLD: 7,
    },
    Moderate: {
        NECK_INCLINATION_THRESHOLD: 20,
        TORSO_INCLINATION_THRESHOLD: 5,
    },
    Strict: {
        NECK_INCLINATION_THRESHOLD: 15,
        TORSO_INCLINATION_THRESHOLD: 3,
    },
};
exports.POSE_LANDMARKS = {
    NOSE: 0,
    LEFT_EYE: 2,
    RIGHT_EYE: 5,
    LEFT_EAR: 7,
    RIGHT_EAR: 8,
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12,
    LEFT_ELBOW: 13,
    RIGHT_ELBOW: 14,
    LEFT_HIP: 23,
    RIGHT_HIP: 24,
};
//# sourceMappingURL=postureProcessing.js.map