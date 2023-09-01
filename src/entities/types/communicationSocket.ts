import {
  LandmarkDict,
  PostureView,
  ThresholdStrictness,
  ThresholdsAnterior,
  ThresholdsLateral,
} from "./postureProcessing";

export type ErrorDetailsAnterior = {
  elbowsTooFar: boolean;
  userTooClose: boolean;
  userLeaning: boolean;
  shouldersHunched: boolean;
  headHunched: boolean;
  headTurned: boolean;
};

export type ErrorDetailsLateral = {
  headHunched: boolean;
  shouldersHunched: boolean;
};

export type ErrorDetails = ErrorDetailsAnterior | ErrorDetailsLateral;

export interface ResponseData {
  error: boolean;
  message: string;
  details?: ErrorDetails;
}

export interface SocketData {
  postureView: PostureView;
  calibration?: LandmarkDict;
  thresholds: ThresholdsAnterior | ThresholdsLateral;
  strictness: ThresholdStrictness;
  goodFrames: number;
  badFrames: number;
  errorFrames: number;
  startTime: Date;
}

export enum ClientToServerEventNames {
  AnalyzePosture = "analyzePosture",
  AnalyzeCamera = "analyzeCamera",
  SetPostureView = "setPostureView",
  SetCalibration = "setCalibration",
  SetThresholdStrictness = "setThresholdStrictness",
  SetScore = "setScore",
  setStarted = "setStarted",
}

export interface ClientToServerEvents {
  [ClientToServerEventNames.AnalyzePosture]: (data: any) => void;
  [ClientToServerEventNames.AnalyzeCamera]: (data: any) => void;
  [ClientToServerEventNames.SetPostureView]: (data: any) => void;
  [ClientToServerEventNames.SetCalibration]: (data: any) => void;
  [ClientToServerEventNames.SetThresholdStrictness]: (data: any) => void;
  [ClientToServerEventNames.SetScore]: (data: any) => void;
  [ClientToServerEventNames.setStarted]: (data: any) => void;
}

export enum ServerToClientEventNames {
  PostureAnalyzed = "poseDataProcessed",
  CameraAnalyzed = "cameraProcessed",
  PostureViewProcessed = "postureViewProcessed",
  CalibrationProcessed = "calibrationProcessed",
  ThresholdsProcessed = "thresholdsProcessed",
  ScoreProcessed = "scoreProcessed",
}

export interface ServerToClientEvents {
  [ServerToClientEventNames.PostureAnalyzed]: (data: ResponseData) => void;
  [ServerToClientEventNames.CameraAnalyzed]: (data: ResponseData) => void;
  [ServerToClientEventNames.PostureViewProcessed]: (response: ResponseData) => void;
  [ServerToClientEventNames.CalibrationProcessed]: (response: ResponseData) => void;
  [ServerToClientEventNames.ThresholdsProcessed]: (response: ResponseData) => void;
  [ServerToClientEventNames.ScoreProcessed]: (response: ResponseData) => void;
}
