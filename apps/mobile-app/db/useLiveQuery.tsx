// TODO: example how to re-render automatically if the data is updated

// // EXAMPLE OF re render data if changes
// import { useLiveQuery, drizzle } from "drizzle-orm/expo-sqlite";
// import { openDatabaseSync } from "expo-sqlite";
// import { Text } from "react-native";
// import * as schema from "./schema";

// const expo = openDatabaseSync("db.db", { enableChangeListener: true }); // <-- enable change listeners
// const db = drizzle(expo);

// const App = () => {
//   // Re-renders automatically when data changes
//   const { data } = useLiveQuery(db.select().from(schema.votes));
//   return <Text>{JSON.stringify(data)}</Text>;
// };

// export default App;
