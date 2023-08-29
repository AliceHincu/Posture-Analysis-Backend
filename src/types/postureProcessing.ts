import * as yup from "yup";

export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export const LandmarkSchema = yup.object().shape({
  x: yup.number().required(),
  y: yup.number().required(),
  z: yup.number().required(),
  visibility: yup.number().min(0).max(1), // Adjust validation as needed
});

export const LandmarkDictSchema = yup.object().shape({
  landmarks: yup.lazy((value: any) =>
    yup
      .object()
      .shape(
        Object.keys(value || {}).reduce((shape, key) => {
          // This condition ensures the key is a number
          if (!isNaN(Number(key))) {
            return {
              ...shape,
              [key]: LandmarkSchema,
            };
          }
          return shape;
        }, {})
      )
      .required()
      .test("has-keys", "must have at least one key-value pair", (value: any) => value && Object.keys(value).length > 0)
  ),
});

export interface LandmarkDict {
  [x: number]: Landmark;
}

export enum PostureView {
  ANTERIOR = "anterior",
  LATERAL = "lateral",
}

export const PostureViewSchema = yup.string().oneOf(Object.values(PostureView)).required();

export type ThresholdStrictness = "Gentle" | "Moderate" | "Strict";
export const ThresholdStrictnessSchema = yup.string().oneOf(["Gentle", "Moderate", "Strict"]).required();

export interface ThresholdsLateral {
  NECK_INCLINATION_THRESHOLD: number;
  TORSO_INCLINATION_THRESHOLD: number;
}

export interface ThresholdsAnterior {
  ALIGNMENT_SHOULDERS_THRESHOLD: number;
  ALIGNMENT_EYES_THRESHOLD: number;
  LEAN_THRESHOLD: number;
  SHOULDER_ELBOW_DEGREE_THRESHOLD: number;
}

export const THRESHOLD_VALUES_ANTERIOR: Record<ThresholdStrictness, ThresholdsAnterior> = {
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

export const THRESHOLD_VALUES_LATERAL: Record<ThresholdStrictness, ThresholdsLateral> = {
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

export const POSE_LANDMARKS = {
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
