import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import store, { updateFeatureFlags, AppDispatch } from "./store";
import { fetchAllComponents, selectAllComponents } from "./slices/componentsSlice";
import { featureFlagConfig, FeatureFlagConfig } from "./featureFlags";

import type { Site } from "./slices/sitesSlice";
import type { Door } from "./slices/doorsSlice";
import type { Controller } from "./slices/controllersSlice";

const FeatureToggle = ({ name, isEnabled, onToggle }: { name: string; isEnabled: boolean; onToggle: () => void }) => (
  <label className="switch">
    <input type="checkbox" checked={isEnabled} onChange={onToggle} />
    <span className="slider"></span>
    {name}
  </label>
);

const ComponentsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const components = useSelector(selectAllComponents);
  const [featureFlags, setFeatureFlags] = useState(() => Object.fromEntries(Object.entries(featureFlagConfig).map(([key, value]) => [key, value.isEnabled])));

  useEffect(() => {
    dispatch(fetchAllComponents());
  }, [dispatch]);

  const handleToggle = (key: keyof FeatureFlagConfig) => {
    const newFlags = {
      ...featureFlags,
      [key]: !featureFlags[key],
    };
    setFeatureFlags(newFlags);
    updateFeatureFlags({
      [key]: {
        ...featureFlagConfig[key],
        isEnabled: newFlags[key],
      },
    });

    // Fetch all components only if the toggle is going from false to true
    if (newFlags[key] && !featureFlags[key]) {
      dispatch(fetchAllComponents());
    }
  };

  return (
    <div>
      <h2>Feature Flags:</h2>
      {Object.entries(featureFlags).map(([key, isEnabled]) => (
        <FeatureToggle key={key} name={key} isEnabled={isEnabled} onToggle={() => handleToggle(key as keyof FeatureFlagConfig)} />
      ))}

      <button onClick={() => dispatch(fetchAllComponents())}>Load All Components</button>
      {components.sites && (
        <>
          <h3>Sites:</h3>
          <ul>
            {components.sites.map((site: Site) => (
              <li key={site.id}>{site.name}</li>
            ))}
          </ul>
        </>
      )}
      {components.doors && (
        <>
          <h3>Doors:</h3>
          <ul>
            {components.doors.map((door: Door) => (
              <li key={door.id}>{door.name}</li>
            ))}
          </ul>
        </>
      )}
      {components.controllers && (
        <>
          <h3>Controllers:</h3>
          <ul>
            {components.controllers.map((controller: Controller) => (
              <li key={controller.id}>{controller.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <main>
          <ComponentsList />
        </main>
      </div>
    </Provider>
  );
};

export default App;
