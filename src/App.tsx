import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import store from "./store";
import { fetchAllComponents, selectAllComponents } from "./slices/componentsSlice";

import type { AppDispatch } from "./store";

const ComponentsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sites, doors, controllers } = useSelector(selectAllComponents);

  useEffect(() => {
    dispatch(fetchAllComponents());
  }, [dispatch]);

  return (
    <div>
      <h2>Sites:</h2>
      <ul>
        {sites?.map((site) => (
          <li key={site.id}>{site.name}</li>
        ))}
      </ul>
      <h2>Doors:</h2>
      <ul>
        {doors?.map((door) => (
          <li key={door.id}>{door.name}</li>
        ))}
      </ul>
      <h2>Controllers:</h2>
      <ul>
        {controllers?.map((controller) => (
          <li key={controller.id}>{controller.name}</li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <div className="layout-simple">
        <header>
          <h1>Nested Slices Demo</h1>
        </header>
        <main>
          <ComponentsList />
        </main>
      </div>
    </Provider>
  );
};

export default App;
