// export const API_ENDPOINT = "http://113.212.87.157:3001/api/api";
// export const API_ENDPOINT_PROFILE = "http://113.212.87.157:3001/api";
// export const POST_DETAIL_ENDPOINT = "https://adonline.in/Post/Detail";
export const CLIENT_URL = "http://localhost:3000";


export const API_ENDPOINT = "https://adonline.in/BETA/api/api";
export const API_ENDPOINT_PROFILE = "https://adonline.in/BETA/api";
export const POST_DETAIL_ENDPOINT = "https://adonline.in/BETA/post/detail";


export const SM_CARD_WIDTH = 180;
export const LG_CARD_WIDTH = 190;
export const XL_CARD_WIDTH = 200;
export const CARD_HEIGHT = 186;

export const LOGEVENTCALL = false;


export const CURRENT_VERSION = "1.9";
export const SECRET_KEY = "adonlinecookiessecret"; // Use a strong key
export const FIREBASE_REALTIME_CHAT_TOKEN = "U2FsdGVkX19zOLhPoF/ncZ3rK0bT61gzUBuvm5mOcMYPM3r4nmm+sSbqogmSnC2a";


export const FRONTEND_VERSION = '1.0.9';

export const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";
export const REACT_APP_RAZORPAY_KEY = "rzp_test_gjG7NNHsNPac03";
// export const REACT_APP_RAZORPAY_KEY = "rzp_live_hCll1OH9kRtg3X"


export const LANGUAGES = [
  { id: 1, value: "en", label: "English" },
  { id: 2, value: "hindi", label: "Hindi" },
  { id: 3, value: "guj", label: "Gujarati" },
];
  
export const CITIES = [
  { id: 1, label: "Ahmedabad", value: "Ahmedabad" },
  { id: 2, label: "Gandhinagar", value: "Gandhinagar" },
  { id: 3, label: "Surat", value: "Surat" },
  { id: 4, label: "Rajkot", value: "Rajkot" },
];

export const Ad_FREQUENCY = [
  { id: 1, title: "Less than 5", value: 5 },
  { id: 2, title: "Less than 10", value: 10 },
  { id: 3, title: "Less than 15", value: 15 },
];

export const TAGS = [
  { key: 0, label: "Suv", value: "Suv" },
  { key: 1, label: "cedan", value: "cedan" },
  { key: 2, label: "Hatchback", value: "Hatchback" },
  { key: 3, label: "MUV", value: "MUV" },
  { key: 4, label: "Convertible", value: "Convertible" },
];

const currentDate = new Date();
export const COOKIES_EXPIRE_TIME = new Date(
  currentDate.setDate(currentDate.getDate() + 30)
);

export const SLIDER_IMAGES = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 2,
    image:
      "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 3,
    image:
      "https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 4,
    image:
      "https://images.pexels.com/photos/757889/pexels-photo-757889.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 5,
    image:
      "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 6,
    image:
      "https://images.pexels.com/photos/906150/pexels-photo-906150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

export const CONTROL_TYPE_ENUM = {
  TextField: "TextField",
  Toggle: "Toggle",
  TextArea: "TextArea",
};
export const acceptedFileTypes: any = ["jpg", "jpeg", "png", "csv"];
export const acceptedImageTypes = ["jpeg", "jpg", "png"];

export const POST_TYPE_ENUM = {
  POST: "POST",
  ADS: "ADS",
};

export const Android_app_url = "https://adonline.in/t/sfa";
export const Android_Website_app_url = "https://bit.ly/3YHsKRI";
export const IOS_app_url = "   https://adonline.in/t/ifa";
export const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029Vb0D2P69hXF8JnXwvx0E";
export const NEW_APPURL = "https://adonline.in/t/sfa";


export const LoginMethod = {
  userVisit: "userVisit",
  userLogin: "userLogin",
};

export const USER_TYPE_ENUM = {
  DemoUser: "UnregisteredUser",
};

export const cryptoSecretKey = "YourStrongPassword123";

export const LanguageEnum = {
  EN: "en-US",
  HI: "hi-IN",
  GU: "gu-IN",
};

export const contactTypesEnum = {
  PHONEWHATSAPP: 1,
  EMAIL: 2,
  TELEGRAM: 4,
  HIDEME: 5,
  PHONE: 6,
  WHATSAPP: 7
};

export const COLUMNS_BREAK_POINT =
  [
    {
      765: 1,
      766: 2,
      1100: 3,
      1800: 4,
      2300: 6,
    },
    {
      750: 2,
      751: 3,
      900: 4,
      1200: 6,
      1800: 7,
      2100: 8,
    }
  ]

  export const RELATEDADS_COLUMNS_BREAK_POINT =
  [
    {
      765: 1,
      766: 2,
      1100: 2,
      1800: 2,
      2300: 2,
    },
    {
      750: 2,
      751: 3,
      900: 3,
      1200: 3,
      1800: 3,
      2100: 6,
    }
  ]
export const locationTypesEnum = {
  STATE: "State",
  VILLAGE: "Village",
  DISTRICT:"District",
  TALUKA: "Taluka",
  AREA:"Area",
};

export const colorMap = {
  darkgray: "#242424",
  white: "#fff",
  lightyellow: "#fff8b8",
  lightblue: "#d4e4ed",
  plum: "#d3bfdb",
  whitesmoke: "#efeff1"
};


export const colorMapping = {
  light: {
    ...colorMap, // Use all colors in light mode
  },
  dark: {
    ...colorMap, // Start with all light colors, then override specific ones
    white: colorMap.darkgray, // Convert white to dark gray in dark mode
    lightyellow: "#44401c" ,
    lightblue: "#20313a",
    plum: "#3a2044",
    whitesmoke: "#3c3c5c",
  }
};

export const GetDesinOption = [
    {
        "id": 2,
        "name": "Grid View",
        "displayorder": 1
    },
    {
        "id": 1,
        "name": "List View",
        "displayorder": 2
    }
  ]

  export const FACEBOOK_GROUPS = [
    {
      link: "https://www.facebook.com/groups/1314477559563145",
      cities: ["devbhumiDwarka"]
    },
    {
      link: "https://www.facebook.com/groups/1754777925279331",
      cities: [
        "girSomnath",
        "jamnagar",
        "junagadh",
        "porbandar",
        "rajkot",
        "amreli"
      ]
    },
    {
      link: "https://www.facebook.com/groups/1754777925279331",
      cities: [
        "bhavnagar",
        "botad",
        "kachchh"
      ]
    },
    {
      link: "https://www.facebook.com/groups/8694544230667698",
      cities: [
        "morbi",
        "surendranagar",
        "ahmedabad"
      ]
    },
    {
      link: "https://www.facebook.com/groups/611236721360463",
      cities: [
        "anand",
        "aravalli",
        "banaskantha",
        "bharuch",
        "chhota Udepur",
        "dahod",
        "dangs",
        "gandhinagar",
        "kheda",
        "mahesana",
        "mahisagar",
        "narmada",
        "navsari",
        "panchmahal",
        "patan",
        "sabarkantha",
        "surat",
        "tapi",
        "vadodara",
        "valsad"
      ]
    }
  ];
  
  
  export const getFacebookGroupLink = (cityName: any) => {
    const lowerCaseCity = cityName.toLowerCase();
    for (const group of FACEBOOK_GROUPS) {
      if (group.cities.some(city => city.toLowerCase() === lowerCaseCity)) {
        return group.link;
      }
    }
    return "https://www.facebook.com/people/AdOnline-Weekly-Ads/61578654893096/"; // No link found for this city
  };

  export const logEvents = {
    User_Search: "User_Search",
    User_Login: "User_Login",
    User_Contact: "User_Contact",
    Share_Post: "Share_Post",
    Create_Post: "Create_Post",
    Edit_Post: "Edit_Post",
    Delete_Post: "Delete_Post",
    Orgonic_Post: "Organic_Post",
    AddedByAdonline_Post: "AddedByAdonline_Post",
    Reposted_Post: "Reposted_Post",
    Edit_Profile: "Edit_Profile",
    Create_PremiumAd: "Create_PremiumAd",
    Edit_PremiumAd: "Edit_PremiumAd",
    Delete_PremiumAd: "Delete_PremiumAd",
    Update_Language: "Update_Language",
    Update_Location: "Update_Location",
    Notification_Click: "Notification_Click",
    New_User: "New_User",
    Returning_User: "Returning_User",
    Visited_User: "Visited_User",
    Fund_Added: "Fund_Added",
    Saved_Post: "Saved_Post",
    Viewed_Post: "Viewed_Post",
    Reported_Post: "Reported_Post",
  } as const;
  

export const NAVIGATION_LINKS = [
  { id: 1, label: 'Home', route: '/' },
  { id: 2, label: 'Favourites', route: '/favourites' },
  { id: 3, label: 'Add New', route: '/add' },
  { id: 4, label: 'My Ads', route: '/my-ads' },
  { id: 5, label: 'About', route: '/about' },
  { id: 6, label: 'Contact', route: '/contact' },
  { id: 7, label: 'Transaction History', route: '/transactionhistory' },
  { id: 8, label: 'User Details', route: '/user-details' },
  { id: 9, label: 'User Activity', route: '/user-activity' },
  { id: 10, label: 'Setting', route: '/setting' },
  { id: 11, label: 'Static Phrases', route: '/static-phrases' },
  { id: 12, label: 'Error Logs', route: '/errorlogs' },
  { id: 13, label: 'User Statistics', route: '/UserStatistics' },
  { id: 14, label: 'City Based Statistics', route: '/CityBasedStatistics' },
  { id: 15, label: 'Shorten Url', route: '/ShortenUrl' },
  { id: 16, label: "Delete Account Page", route: "/delete-account"},
  { id: 17, label: "Refund Policy", route: "/policy/refund"},
  { id: 18, label: "Terms and Conditions", route: "/policy/terms-condition"},
  { id: 19, label: "Pricing", route: "/policy/pricing"},
  { id: 20, label: "Privacy Policy", route: "/policy/privacy"},
  { id: 21, label: "Success", route: "/success"},
  { id: 22, label: "App Notification", route: "/appnotification"},
  { id: 23, label: "App Update", route: "/update"},
  { id: 24, label: "Post Detail", route: "/Post/Detail/:postId"}
];
  
export const stateId = {
  Gujarat : 19038
} as const
export const firebaseConfig = {
  apiKey: "AIzaSyCfejHMuLX1Fon8pjMNSgb1AgPh8ys-EEo",
  authDomain: "adonline-84a70.firebaseapp.com",
  projectId: "adonline-84a70",
  storageBucket: "adonline-84a70.firebasestorage.app",
  messagingSenderId: "612453146634",
  appId: "1:612453146634:web:680423b16c5433614afff3",
  measurementId: "G-V5B4DSKC9B"
};
