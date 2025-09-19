export type RootStackParamList = {
  FindWC: { washroomId: number | null };
  WcDetails: { washroomId: number };
  Navigate: {washroomId: number, name: string, destiLat: number, destiLng: number}
  Survey: {washroomId: number};
  Home: undefined;
  AddWC: undefined;
  Test: undefined;
  Register: undefined;
  Login: undefined;
  Stack: { screen?: keyof RootStackParamList; params?: any };
  Tabs: {
  screen?: "Home" | "FindWC" | "Logout";
  params?: {
    washroomId?: number;
  };
};

};