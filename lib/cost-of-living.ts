import type { StateColData } from "@/types/fire";
// MERIC 2024 Composite Index. 100 = US national average.
const RAW: StateColData[] = [
  {state:"MS",name:"Mississippi",colIndex:85.7},{state:"OK",name:"Oklahoma",colIndex:87.0},
  {state:"AR",name:"Arkansas",colIndex:87.8},{state:"AL",name:"Alabama",colIndex:88.1},
  {state:"KY",name:"Kentucky",colIndex:88.6},{state:"WV",name:"West Virginia",colIndex:89.4},
  {state:"MO",name:"Missouri",colIndex:89.8},{state:"IA",name:"Iowa",colIndex:90.1},
  {state:"IN",name:"Indiana",colIndex:90.6},{state:"SD",name:"South Dakota",colIndex:91.3},
  {state:"TN",name:"Tennessee",colIndex:91.5},{state:"KS",name:"Kansas",colIndex:91.9},
  {state:"TX",name:"Texas",colIndex:92.1},{state:"NE",name:"Nebraska",colIndex:92.4},
  {state:"OH",name:"Ohio",colIndex:92.7},{state:"GA",name:"Georgia",colIndex:93.1},
  {state:"MI",name:"Michigan",colIndex:93.4},{state:"ND",name:"North Dakota",colIndex:93.5},
  {state:"ID",name:"Idaho",colIndex:94.8},{state:"SC",name:"South Carolina",colIndex:95.0},
  {state:"WI",name:"Wisconsin",colIndex:95.6},{state:"NC",name:"North Carolina",colIndex:96.2},
  {state:"LA",name:"Louisiana",colIndex:96.5},{state:"UT",name:"Utah",colIndex:97.4},
  {state:"MT",name:"Montana",colIndex:97.8},{state:"NM",name:"New Mexico",colIndex:98.2},
  {state:"WY",name:"Wyoming",colIndex:98.5},{state:"AZ",name:"Arizona",colIndex:99.4},
  {state:"MN",name:"Minnesota",colIndex:99.8},{state:"FL",name:"Florida",colIndex:100.3},
  {state:"PA",name:"Pennsylvania",colIndex:100.5},{state:"DE",name:"Delaware",colIndex:101.6},
  {state:"IL",name:"Illinois",colIndex:102.3},{state:"ME",name:"Maine",colIndex:103.1},
  {state:"VA",name:"Virginia",colIndex:103.7},{state:"CO",name:"Colorado",colIndex:104.8},
  {state:"NV",name:"Nevada",colIndex:106.5},{state:"RI",name:"Rhode Island",colIndex:107.2},
  {state:"NH",name:"New Hampshire",colIndex:108.4},{state:"VT",name:"Vermont",colIndex:109.8},
  {state:"OR",name:"Oregon",colIndex:115.4},{state:"WA",name:"Washington",colIndex:111.3},
  {state:"AK",name:"Alaska",colIndex:126.7},{state:"CT",name:"Connecticut",colIndex:126.1},
  {state:"NJ",name:"New Jersey",colIndex:127.4},{state:"MD",name:"Maryland",colIndex:129.3},
  {state:"MA",name:"Massachusetts",colIndex:132.8},{state:"NY",name:"New York",colIndex:139.1},
  {state:"CA",name:"California",colIndex:142.2},{state:"DC",name:"Washington D.C.",colIndex:158.2},
  {state:"HI",name:"Hawaii",colIndex:193.3},
];
export const COL_DATA_UNIQUE: StateColData[] = RAW.sort((a,b)=>a.colIndex-b.colIndex);
export function getColForState(state: string): StateColData | undefined { return COL_DATA_UNIQUE.find((s)=>s.state===state); }

// Alphabetical by state name — use in dropdowns
export const COL_DATA_BY_NAME: StateColData[] = [...COL_DATA_UNIQUE].sort((a, b) =>
  a.name.localeCompare(b.name),
);
