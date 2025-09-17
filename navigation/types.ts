export type RootStackParamList = {
  FindWC: { washroomId: number | null };
  WcDetails: { washroomId: number };
  Navigate: {washroomId: number, name: string, destiLat: number, destiLng: number}
  Survey: {washroomId: number};
  Home: undefined;
};