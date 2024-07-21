import { createReducer } from "@reduxjs/toolkit";
import { componentReducers } from "./slices/componentSlices";
import store from "./store";

// Define the feature flag configuration type
export type FeatureFlagConfig = {
  [key: string]: {
    isEnabled: boolean;
  };
};

// Create the feature flag configuration object
const defaultFeatureFlagConfig: FeatureFlagConfig = {
  sites: {
    isEnabled: true,
  },
  doors: {
    isEnabled: false,
  },
  controllers: {
    isEnabled: false,
  },
};

// Function to get feature flag config from sessionStorage or default
const getFeatureFlagConfig = (): FeatureFlagConfig => {
  const storedFlags = sessionStorage.getItem("featureFlags");
  if (storedFlags) {
    const parsedFlags = JSON.parse(storedFlags);
    return Object.fromEntries(Object.entries(defaultFeatureFlagConfig).map(([key, value]) => [key, { isEnabled: parsedFlags[key] ?? value.isEnabled }]));
  }
  return defaultFeatureFlagConfig;
};

export const featureFlagConfig = getFeatureFlagConfig();

// Function to update feature flags
export const updateFeatureFlags = (newConfig: Partial<FeatureFlagConfig>) => {
  Object.assign(featureFlagConfig, newConfig);
  const flagStates = Object.fromEntries(Object.entries(featureFlagConfig).map(([key, value]) => [key, value.isEnabled]));
  sessionStorage.setItem("featureFlags", JSON.stringify(flagStates));
};

// Function to inject slices based on feature flags
export const injectFeatureFlaggedSlices = <T extends ReturnType<typeof combineSlices>>(baseSlice: T, config: FeatureFlagConfig, { replaced, newConfig }: { replaced?: boolean; newConfig?: Partial<typeof featureFlagConfig> }): T => {
  const injectedSlice = Object.entries(config).reduce((acc, [key, featureConfig]) => {
    if (!featureConfig || typeof featureConfig !== "object") {
      return acc;
    }

    const { isEnabled } = featureConfig;
    const reducer = componentReducers[key as keyof typeof componentReducers];

    if ((isEnabled && typeof reducer === "function") || (!replaced && isEnabled)) {
      return acc.inject(
        {
          reducerPath: key,
          reducer: reducer,
        },
        { overrideExisting: true }
      );
    } else if (replaced && !isEnabled && newConfig && key in newConfig) {
      return acc.inject(
        {
          reducerPath: key,
          reducer: () => null,
        },
        { overrideExisting: true }
      );
    }

    return acc;
  }, baseSlice);

  return injectedSlice;
};
