import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import store from "./store";
import { fetchAllEntities, selectAllEntities } from "./slices/entitiesSlice";

import type { AppDispatch } from "./store";

const EntitiesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sites, doors, controllers, branches, areaGroups, areas, events, siteNotes, technicians } = useSelector(selectAllEntities);

  useEffect(() => {
    dispatch(fetchAllEntities());
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
      <h2>Branches:</h2>
      <ul>
        {branches?.map((branch) => (
          <li key={branch.id}>{branch.name}</li>
        ))}
      </ul>
      <h2>Area Groups:</h2>
      <ul>
        {areaGroups?.map((areaGroup) => (
          <li key={areaGroup.id}>{areaGroup.name}</li>
        ))}
      </ul>
      <h2>Areas:</h2>
      <ul>
        {areas?.map((area) => (
          <li key={area.id}>{area.name}</li>
        ))}
      </ul>
      <h2>Events:</h2>
      <ul>
        {events?.map((event) => (
          <li key={event.id}>
            {event.type} - {event.timestamp}
          </li>
        ))}
      </ul>
      <h2>Site Notes:</h2>
      <ul>
        {siteNotes?.map((note) => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
      <h2>Technicians:</h2>
      <ul>
        {technicians?.map((technician) => (
          <li key={technician.id}>{technician.name}</li>
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
          <EntitiesList />
        </main>
      </div>
    </Provider>
  );
};

export default App;
