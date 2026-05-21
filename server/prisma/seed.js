const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// US State → Region mapping
const STATE_REGIONS = {
  // West
  AK: "West", AZ: "West", CA: "West", CO: "West", HI: "West",
  ID: "West", MT: "West", NM: "West", NV: "West", OR: "West",
  UT: "West", WA: "West", WY: "West",
  // Midwest
  IA: "Midwest", IL: "Midwest", IN: "Midwest", KS: "Midwest",
  MI: "Midwest", MN: "Midwest", MO: "Midwest", ND: "Midwest",
  NE: "Midwest", OH: "Midwest", SD: "Midwest", WI: "Midwest",
  // Northeast
  CT: "Northeast", DC: "Northeast", DE: "Northeast", MA: "Northeast",
  MD: "Northeast", ME: "Northeast", NH: "Northeast", NJ: "Northeast",
  NY: "Northeast", PA: "Northeast", RI: "Northeast", VT: "Northeast",
  // South
  AL: "South", AR: "South", FL: "South", GA: "South", KY: "South",
  LA: "South", MS: "South", NC: "South", OK: "South", SC: "South",
  TN: "South", TX: "South", VA: "South", WV: "South",
};

const temples = [
  // ─── ARIZONA ─────────────────────────────────────────────────────────────
  {
    name: "Arizona International Buddhist Meditation Center",
    state: "Arizona",
    address: "432 South Temple St., Mesa, AZ 85204",
    chiefMonk: "Ven. Siyambalagoda Ananda Thero",
    phone: "+1 480 626 4153",
    email: "info@meditationforyou.org",
    regionTag: STATE_REGIONS["AZ"],
  },

  // ─── CALIFORNIA ──────────────────────────────────────────────────────────
  {
    name: "Sri Ratana International Buddhist Center",
    state: "California",
    address: "2780 West Lincoln Ave, Anaheim, CA 92801",
    chiefMonk: "Ven. Bogolle Sumana Thero",
    phone: "+1 714 821 8576",
    email: "ratanavihara@gmail.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Mindfulness Meditation Center (Los Angeles Buddhist Vihara)",
    state: "California",
    address: "1023 N. Glendora Avenue, Covina, CA 91724",
    chiefMonk: "Ven. Dhammapeethi Thero",
    phone: "+1 626 364 7497",
    email: "vbuddhist@yahoo.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Mahamevnawa Dhammawood Buddhist Meditation Center of California",
    state: "California",
    address: "9917 Mission Boulevard, Jurupa Valley, CA 92509",
    chiefMonk: "Ven. Aludeniye Subodhi Thero",
    phone: "+1 714 884 3894",
    email: "mahamevnawa.california@gmail.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Dharma Vijaya Buddhist Vihara",
    state: "California",
    address: "1847 Crenshaw Blvd, Los Angeles, CA 90019",
    chiefMonk: "Ven. Dr. Walpola Piyananda Nayaka Maha Thero",
    phone: "+1 323 737 5084",
    email: "dharmavijya@gmail.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Kansas Buddhist Vihara",
    state: "California",
    address: "1847 Crenshaw Blvd, Los Angeles, CA 90019",
    chiefMonk: "Ven. Maitipe Wimalasara Thero",
    phone: "+1 310 435 1845",
    email: "Kansas@buddhistvihara.us",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "International Buddhist Meditation Center (IBMC)",
    state: "California",
    address: "928 South New Hampshire Ave, Los Angeles, CA 90006",
    chiefMonk: "Ven. Hewanpola Shanthi Thero",
    phone: "+1 213 389 8856",
    email: "ibmc@urbandharma.org",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Sambuddhaloka Buddhist Viharaya",
    state: "California",
    address: "23916 Hemlock Avenue, Moreno Valley, CA 92557",
    chiefMonk: "Ven. Wathogala Saranasiri Thero",
    phone: "+1 951 485 6644",
    email: "sbvihara@gmail.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Dharmapala Institute",
    state: "California",
    address: "409 S. Temple Drive, Milpitas, CA 95035",
    chiefMonk: "Ven. Kannadeniye Santa Thero",
    phone: "+1 408 934 3985",
    email: "temple@buddhistvihara.net",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Sarathchandra Buddhist Center",
    state: "California",
    address: "10717 Oxnard Street, North Hollywood, CA 91606",
    chiefMonk: "Ven. Ambalantota Kolitha Maha Nayaka Thero",
    phone: "+1 818 760 8361",
    email: "sarathchandrabuddhistcenter@yahoo.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Los Angeles Buddhist Vihara",
    state: "California",
    address: "920 North Summit Ave, Pasadena, CA 91103",
    chiefMonk: "Ven. Ahangama Dharmarama Thero",
    phone: "+1 626 797 6144",
    email: "labuddhistvihara@yahoo.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Sri Lankarama Buddhist Temple",
    state: "California",
    address: "398 Giano Ave, Rowland Heights, CA 91748",
    chiefMonk: "Ven. Aluthnuwara Sumanatissa Thero",
    phone: "+1 626 913 0775",
    email: "sumanatissa@yahoo.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Berkeley Buddhist Vihara",
    state: "California",
    address: "6200 Columbia Avenue, Richmond, CA 94804",
    chiefMonk: "Ven. Kahataruppe Wimalaratana Thero",
    phone: "+1 510 526 0230",
    email: "info@berkeleyvihara.org",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Maithree Vihara Buddhist Meditation Center",
    state: "California",
    address: "10819 Penrose Street, Sun Valley, CA 91352",
    chiefMonk: "Ven. Aparekke Punnyasiri Thero",
    phone: "+1 818 768 9382",
    email: "maithreevihara@gmail.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Buddha Vihara – Santa Clara",
    state: "California",
    address: "402 Knowles Avenue, Santa Clara, CA 95050",
    chiefMonk: "Ven. Kahanda Amarabuddhi Thero",
    phone: "+1 408 246 9921",
    email: "pansala@yahoo.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Thapowanaye International Buddhist Center",
    state: "California",
    address: "10450 Darling Road, Ventura, CA 93004",
    chiefMonk: "Ven. Thapowanaye Sutadhara Thero",
    phone: "+1 805 758 2028",
    email: "sutadhara@gmail.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "ABS Temple & Meditation Center",
    state: "California",
    address: "423 Glide Avenue, West Sacramento, CA 95691",
    chiefMonk: "Ven. Madawala Seelawimala Thero",
    phone: "+1 916 371 8535",
    email: "abstemple@gmail.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Shanthi Nikethanaya",
    state: "California",
    address: "22543 Marlin Place, West Hills, CA 91307",
    chiefMonk: "Ven. Shantha Shobhana Thero",
    phone: "+1 818 710 8474",
    email: null,
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Aranya Bodhi Hermitage",
    state: "California",
    address: "Sonoma Coast, Jenner, CA 95450",
    chiefMonk: "Ayya Tathaaloka Bhikkhuni",
    phone: "+1 707 340 4281",
    email: "awakeningforest@gmail.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Shanthi Vihara Buddhist Center",
    state: "California",
    address: "1750 North Mountain Ave, Pomona, CA 91767",
    chiefMonk: "Ven. Ambanpola Seelaratana Thero",
    phone: "+1 909 267 9705",
    email: "stenipita@yahoo.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Karuna Buddhist Vihara",
    state: "California",
    address: "28 Bassett Street #227, San Jose, CA 95110",
    chiefMonk: "Bhikkhuni Santussika",
    phone: "+1 408 888 1132",
    email: "info@karunabv.org",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "Lotus Meditation and Education Center",
    state: "California",
    address: "1446 Summit Ridge Drive, Diamond Bar, CA 91765",
    chiefMonk: "Ven. Bhikkhuni Susila",
    phone: "+1 909 861 1582",
    email: "baolienthienvien@yahoo.com",
    regionTag: STATE_REGIONS["CA"],
  },
  {
    name: "San Diego Buddhist Vihara & Meditation Center",
    state: "California",
    address: "9620 McCool Lane, Santee, CA 92071",
    chiefMonk: "Ven. Pannila Sudatta",
    phone: "+1 323 534 6919",
    email: "sdbvihara@gmail.com",
    regionTag: STATE_REGIONS["CA"],
  },

  // ─── COLORADO ────────────────────────────────────────────────────────────
  {
    name: "Colorado Buddhist Vihara",
    state: "Colorado",
    address: "1252 Sable Blvd., Aurora, CO 80011",
    chiefMonk: "Ven. Dr. Pitakotte Seelaratana Maha Thero",
    phone: "+1 323 899 8821",
    email: "cbvihara1@gmail.com",
    regionTag: STATE_REGIONS["CO"],
  },

  // ─── CONNECTICUT ─────────────────────────────────────────────────────────
  {
    name: "Connecticut Buddhist Vihara",
    state: "Connecticut",
    address: "1421 John Fitch Blvd., South Windsor, CT 06074",
    chiefMonk: "Rev. Kurunegoda Dammaloka Thero",
    phone: "+1 857 707 8215",
    email: null,
    regionTag: STATE_REGIONS["CT"],
  },

  // ─── DISTRICT OF COLUMBIA ────────────────────────────────────────────────
  {
    name: "Washington Buddhist Vihara",
    state: "District of Columbia",
    address: "5017 16th Street NW, Washington DC 20011",
    chiefMonk: "Ven. Maharagama Dhammasiri Nayaka Thero",
    phone: "+1 202 723 0773",
    email: "buddhistviharadc@gmail.com",
    regionTag: STATE_REGIONS["DC"],
  },

  // ─── FLORIDA ─────────────────────────────────────────────────────────────
  {
    name: "Samadhi Buddhist Meditation Center",
    state: "Florida",
    address: "5908 67th Avenue, Pinellas Park, FL 33781",
    chiefMonk: "Ven. Bhikkhuni Sudarshana",
    phone: "+1 727 744 4377",
    email: "floridasamadhimc@gmail.com",
    regionTag: STATE_REGIONS["FL"],
  },
  {
    name: "Blue Lotus Buddhist Meditation Center",
    state: "Florida",
    address: "714 Shamrock Blvd, Venice, FL 34292",
    chiefMonk: "Most Venerable Bhante Sujatha Thero",
    phone: "+1 815 451 2897",
    email: "serenitybuddhists@gmail.com",
    regionTag: STATE_REGIONS["FL"],
  },
  {
    name: "Dhamma-wheel Meditation Society",
    state: "Florida",
    address: "1518 South Haven Drive, Clearwater, FL 33764",
    chiefMonk: "Ven. Baddegama Dhammawansha Thero",
    phone: "+1 727 242 7239",
    email: "thedwms@gmail.com",
    regionTag: STATE_REGIONS["FL"],
  },
  {
    name: "Florida Buddhist Vihara",
    state: "Florida",
    address: "2208 May Dell Drive, Tampa, FL 33619",
    chiefMonk: "Ven. Morathota Ananda Thero",
    phone: "+1 813 621 1337",
    email: "floridafbv@gmail.com",
    regionTag: STATE_REGIONS["FL"],
  },
  {
    name: "Mahamevnawa Meditation Monastery Florida",
    state: "Florida",
    address: "11727 N Ola Avenue, Tampa, FL 33612",
    chiefMonk: "Ven. Polgahawela Ariyananda Thero",
    phone: "+1 813 961 5296",
    email: "info@mahamevnawaflorida.org",
    regionTag: STATE_REGIONS["FL"],
  },

  // ─── GEORGIA ─────────────────────────────────────────────────────────────
  {
    name: "Georgia Buddhist Vihara",
    state: "Georgia",
    address: "3153 Miller Road, Stonecrest, Lithonia, GA 30038",
    chiefMonk: "Ven. Panamwela Wajirabuddhi Thero",
    phone: "+1 770 987 8442",
    email: "gbvihara@gmail.com",
    regionTag: STATE_REGIONS["GA"],
  },

  // ─── ILLINOIS ────────────────────────────────────────────────────────────
  {
    name: "Chicago Buddhist Vihara & Meditation Center",
    state: "Illinois",
    address: "5313 Route 34, Oswego, IL 60543",
    chiefMonk: "Ven. Sumanawansa Thero",
    phone: "+1 630 855 8249",
    email: "info@chicagobuddhistvihara.org",
    regionTag: STATE_REGIONS["IL"],
  },
  {
    name: "Blue Lotus Buddhist Temple",
    state: "Illinois",
    address: "221 Dean Street, Woodstock, IL 60098",
    chiefMonk: "Ven. Peradeniye Sujatha Nayaka Thero",
    phone: "+1 815 337 7378",
    email: "office@bluelotustemple.org",
    regionTag: STATE_REGIONS["IL"],
  },

  // ─── INDIANA ─────────────────────────────────────────────────────────────
  {
    name: "Indiana Buddhist Vihara",
    state: "Indiana",
    address: "7528 Thompson Road, Hoagland, IN 46745",
    chiefMonk: "Ven. Talangama Dewananda Thero",
    phone: "+1 260 447 5269",
    email: "indianabuddhistvihara@gmail.com",
    regionTag: STATE_REGIONS["IN"],
  },

  // ─── KANSAS ──────────────────────────────────────────────────────────────
  {
    name: "Kansas Meditation Center",
    state: "Kansas",
    address: "3011 George Washington Blvd, Wichita, KS 67210",
    chiefMonk: "Ven. Aluthgama Dhammajothi Thero",
    phone: "+1 405 600 4832",
    email: "info@kansasmeditationcenter.org",
    regionTag: STATE_REGIONS["KS"],
  },

  // ─── MASSACHUSETTS ───────────────────────────────────────────────────────
  {
    name: "Dhamma Cetiya Buddhist Vihara",
    state: "Massachusetts",
    address: "91 De Soto Road, Boston, MA 02132",
    chiefMonk: "Rev. Gotami Bhikkhuni",
    phone: "+1 617 325 3159",
    email: "dhamma.cetiya.buddhist.vihara@rcn.com",
    regionTag: STATE_REGIONS["MA"],
  },
  {
    name: "Boston Buddhist Vihara (New England Buddhist Vihara & Meditation Center)",
    state: "Massachusetts",
    address: "162 Old Upton Road, Grafton, MA 01519",
    chiefMonk: "Ven. Aluthgama Dhammajothi Thero",
    phone: "+1 508 839 5038",
    email: "information@nebvmc.org",
    regionTag: STATE_REGIONS["MA"],
  },

  // ─── MARYLAND ────────────────────────────────────────────────────────────
  {
    name: "Nisala Arana Buddhist Monastery",
    state: "Maryland",
    address: "34 Brighton Drive, Gaithersburg, MD 20877",
    chiefMonk: "Ven. Ginthota Wimala Thero",
    phone: "+1 301 956 9691",
    email: "nisalaaranadeerpark@gmail.com",
    regionTag: STATE_REGIONS["MD"],
  },
  {
    name: "Sri Sambuddhaloka Buddhist Meditation Center",
    state: "Maryland",
    address: "15325 National Pike, Hagerstown, MD 21740",
    chiefMonk: "Ven. Karaputugala Indrarathana Thero",
    phone: "+1 347 283 0211",
    email: "kindaratana@gmail.com",
    regionTag: STATE_REGIONS["MD"],
  },
  {
    name: "Mahamevnawa Buddhist Meditation Center",
    state: "Maryland",
    address: "5004 Stone Rd, Rockville, MD 20853",
    chiefMonk: "Ven. Ratnapure Vajira Thero",
    phone: "+1 202 709 2885",
    email: "mahamevnawadc@gmail.com",
    regionTag: STATE_REGIONS["MD"],
  },
  {
    name: "Maryland Buddhist Vihara",
    state: "Maryland",
    address: "2600 Elmont Street, Silver Spring, MD 20902",
    chiefMonk: "Ven. Katugastota Uparatana Nayaka Thero",
    phone: "+1 301 946 9437",
    email: "uparatana@gmail.com",
    regionTag: STATE_REGIONS["MD"],
  },
  {
    name: "Pannasiha Lion of Wisdom Meditation Center",
    state: "Maryland",
    address: "25725 Long Corner Rd, Gaithersburg, MD 20882",
    chiefMonk: "Bhante Yogavachara Rahula",
    phone: "+1 909 276 2291",
    email: "info@lionwisdom.org",
    regionTag: STATE_REGIONS["MD"],
  },

  // ─── MICHIGAN ────────────────────────────────────────────────────────────
  {
    name: "Great Lakes Buddhist Vihara",
    state: "Michigan",
    address: "21491 Beech Road, Southfield, MI 48033",
    chiefMonk: "Ven. Brahmanagama Muditha Thero",
    phone: "+1 248 353 8155",
    email: "webmaster@glbvihara.org",
    regionTag: STATE_REGIONS["MI"],
  },

  // ─── MINNESOTA ───────────────────────────────────────────────────────────
  {
    name: "Minnesota Buddhist Vihara",
    state: "Minnesota",
    address: "3401 North 4th Street, Minneapolis, MN 55412",
    chiefMonk: "Ven. Witiyala Seevali Thero",
    phone: "+1 612 522 1811",
    email: "mnbvusa@yahoo.com",
    regionTag: STATE_REGIONS["MN"],
  },
  {
    name: "Triple Gem of the North MN Buddhist Center",
    state: "Minnesota",
    address: "212 N Chestnut Street, Chaska, MN 55318",
    chiefMonk: "Ven. Peradeniye Sathindriya Thero",
    phone: "+1 612 227 8188",
    email: "bhantes@triplegem.org",
    regionTag: STATE_REGIONS["MN"],
  },

  // ─── MISSOURI ────────────────────────────────────────────────────────────
  {
    name: "Missouri Buddhist Meditation Center (Bodhi Meditation Center of Missouri)",
    state: "Missouri",
    address: "7102 North Hanley Road, Hazelwood, MO 63042",
    chiefMonk: "Ven. Tawalama Bodhiseeha Thero",
    phone: "+1 314 395 3440",
    email: "bmcm2008@gmail.com",
    regionTag: STATE_REGIONS["MO"],
  },

  // ─── NEVADA ──────────────────────────────────────────────────────────────
  {
    name: "Nevada Buddhist Vihara",
    state: "Nevada",
    address: "2040 Abeles Lane, Las Vegas, NV 89115",
    chiefMonk: "Ven. Alawala Subhuthi Thero",
    phone: "+1 702 457 7938",
    email: "subuala@yahoo.com",
    regionTag: STATE_REGIONS["NV"],
  },

  // ─── NEW JERSEY ──────────────────────────────────────────────────────────
  {
    name: "The Mahamevnawa Bhavana Monastery of New Jersey",
    state: "New Jersey",
    address: "241 Deans Rhode Hall Road, Monroe Township, NJ 08831",
    chiefMonk: "Ven. Godakawela Damitha Thero",
    phone: "+1 732 562 8412",
    email: "info@mahamevnausa.org",
    regionTag: STATE_REGIONS["NJ"],
  },
  {
    name: "New Jersey Buddhist Vihara",
    state: "New Jersey",
    address: "4299 NJ-27, Princeton, NJ 08540",
    chiefMonk: "Ven. Hungampola Sirirathana Nayaka Thero",
    phone: "+1 732 821 9346",
    email: "njbvihara@yahoo.com",
    regionTag: STATE_REGIONS["NJ"],
  },
  {
    name: "Samadhi Buddhist Foundation",
    state: "New Jersey",
    address: "176 Tices Lane, East Brunswick, NJ 08816",
    chiefMonk: "Ven. Madawala Punnnaji Thero",
    phone: "+1 732 452 0587",
    email: "info@samadhinj.org",
    regionTag: STATE_REGIONS["NJ"],
  },

  // ─── NEW YORK ────────────────────────────────────────────────────────────
  {
    name: "The Long Island Buddhist Meditation Center",
    state: "New York",
    address: "5268 Sound Avenue, Riverhead, NY 11901",
    chiefMonk: "Ven. Kottawe Nanda Thero",
    phone: "+1 631 828 6296",
    email: "bhante@libmc.org",
    regionTag: STATE_REGIONS["NY"],
  },
  {
    name: "New York Buddhist Vihara",
    state: "New York",
    address: "21422 Spencer Avenue, Queens Village, NY 11427",
    chiefMonk: "Ven. Aluthgama Dhammajothi Thero",
    phone: "+1 718 468 4262",
    email: "info@nybv.us",
    regionTag: STATE_REGIONS["NY"],
  },
  {
    name: "Mahamevnawa Meditation Center of New York",
    state: "New York",
    address: "230 Decker Avenue, Staten Island, NY 10302",
    chiefMonk: "Ven. Mathurata Sirinivasa Thero",
    phone: "+1 718 720 7091",
    email: "secretary.mahamevnawa.ny@gmail.com",
    regionTag: STATE_REGIONS["NY"],
  },
  {
    name: "Staten Island Buddhist Vihara",
    state: "New York",
    address: "115 John Street, Staten Island, NY 10302",
    chiefMonk: "Ven. Heenbunne Kondanna Thero",
    phone: "+1 718 556 2051",
    email: "administrator@sibv.org",
    regionTag: STATE_REGIONS["NY"],
  },

  // ─── NORTH CAROLINA ──────────────────────────────────────────────────────
  {
    name: "North Carolina Buddhist Temple",
    state: "North Carolina",
    address: "1017 Patterson Road, Durham, NC 27704",
    chiefMonk: "Ven. Yatiyana Wajirapala Thero",
    phone: "+1 919 827 4389",
    email: "wajip7@yahoo.com",
    regionTag: STATE_REGIONS["NC"],
  },

  // ─── SOUTH CAROLINA ──────────────────────────────────────────────────────
  {
    name: "Carolina Buddhist Vihara",
    state: "South Carolina",
    address: "113 Woodridge Circle, Greenville, SC 29607",
    chiefMonk: "Ven. Sudinna Bhikkhuni",
    phone: "+1 864 329 9961",
    email: "greenvillebv@gmail.com",
    regionTag: STATE_REGIONS["SC"],
  },

  // ─── OHIO ─────────────────────────────────────────────────────────────────
  {
    name: "Cleveland Buddhist Vihara and Meditation Center",
    state: "Ohio",
    address: "695 Vernon Odom Blvd, Akron, OH 44320",
    chiefMonk: "Ven. Udawatte Thero",
    phone: "+1 440 771 3178",
    email: "clebvihara@gmail.com",
    regionTag: STATE_REGIONS["OH"],
  },
  {
    name: "Ohio Buddhist Vihara",
    state: "Ohio",
    address: "1831 Miles Road, Cincinnati, OH 45231",
    chiefMonk: "Ven. Koppakande Sumanajothi Thero",
    phone: "+1 513 825 4961",
    email: "info@ohiovihara.org",
    regionTag: STATE_REGIONS["OH"],
  },

  // ─── OKLAHOMA ────────────────────────────────────────────────────────────
  {
    name: "Oklahoma Buddhist Vihara",
    state: "Oklahoma",
    address: "4820 N Portland Avenue, Oklahoma City, OK 73112",
    chiefMonk: "Ven. Higunwala Piyaratana Thero",
    phone: "+1 405 810 6528",
    email: "infookbuddhistcenter@gmail.com",
    regionTag: STATE_REGIONS["OK"],
  },

  // ─── OREGON ──────────────────────────────────────────────────────────────
  {
    name: "Oregon Buddhist Vihara",
    state: "Oregon",
    address: "150 SE Walnut Street, Hillsboro, OR 97123",
    chiefMonk: "Ven. Pallebage Chandasiri Nayaka Thero",
    phone: "+1 503 681 3031",
    email: "oregonbuddhistvihara@live.com",
    regionTag: STATE_REGIONS["OR"],
  },

  // ─── PENNSYLVANIA ────────────────────────────────────────────────────────
  {
    name: "Pennsylvania Meditation Center (International Buddhist Society of PA)",
    state: "Pennsylvania",
    address: "1999 South Valley Road, Crystal Spring, PA 15536",
    chiefMonk: "Ven. Huruluwewe Chandrawansa Thero",
    phone: "+1 814 735 4458",
    email: "admin@pabuddhistvihara.net",
    regionTag: STATE_REGIONS["PA"],
  },
  {
    name: "Pittsburgh Buddhist Center",
    state: "Pennsylvania",
    address: "111 Rte. 908, Natrona Heights, PA 15065",
    chiefMonk: "Ven. Soorakkulame Pemaratana Thero",
    phone: "+1 724 295 2525",
    email: "info@pittsburghbuddhistcenter.org",
    regionTag: STATE_REGIONS["PA"],
  },
  {
    name: "Blue Lotus Buddhist Temple & Meditation Center in Pennsylvania",
    state: "Pennsylvania",
    address: "51 N Pitt St, Carlisle, PA 17013",
    chiefMonk: "Ven. Somananda Thero",
    phone: "+1 815 322 6657",
    email: "blueltpa@gmail.com",
    regionTag: STATE_REGIONS["PA"],
  },

  // ─── TEXAS ───────────────────────────────────────────────────────────────
  {
    name: "Dallas Fort Worth Buddhist Vihara (Texas Buddhist Meditation Center)",
    state: "Texas",
    address: "11209 Brownfield Drive, Burleson, TX 76028",
    chiefMonk: "Ven. Thawalama Punnaji Thero",
    phone: "+1 817 551 9580",
    email: "tbmc01@gmail.com",
    regionTag: STATE_REGIONS["TX"],
  },
  {
    name: "Austin Buddhist Center",
    state: "Texas",
    address: "5816 Ross Road, Del Valle, TX 78617",
    chiefMonk: "Ven. Pandit Eluwapola Gnanaratana Nayaka Thero",
    phone: "+1 512 247 7490",
    email: "austinbuddhistcenter@gmail.com",
    regionTag: STATE_REGIONS["TX"],
  },
  {
    name: "Houston Buddhist Vihara",
    state: "Texas",
    address: "8727 Radio Road, Houston, TX 77075",
    chiefMonk: "Ven. Pannila Ananda Nayaka Thero",
    phone: "+1 713 944 1334",
    email: "sumangalathero@hotmail.com",
    regionTag: STATE_REGIONS["TX"],
  },
  {
    name: "Austin Buddhist Vihara",
    state: "Texas",
    address: "1501 Mangrum Street, Pflugerville, TX 78660",
    chiefMonk: "Ven. Kehelovitigama Subodha Thero",
    phone: "+1 512 990 5501",
    email: "secretary@austintemple.org",
    regionTag: STATE_REGIONS["TX"],
  },
  {
    name: "Lone Star Buddhist Meditation Center (Mahamevnawa)",
    state: "Texas",
    address: "11223 Wind Pine Lane, Tomball, TX 77375",
    chiefMonk: "Ven. Sarananda Thero",
    phone: "+1 281 547 8314",
    email: "info@houstonbuddhist.org",
    regionTag: STATE_REGIONS["TX"],
  },
  {
    name: "Metta House Meditation Center",
    state: "Texas",
    address: "2355 Pecos Boulevard, Beaumont, TX 77702",
    chiefMonk: "Ven. Kassapa Thero",
    phone: "+1 409 960 8369",
    email: "Tbsna@tbsna.org",
    regionTag: STATE_REGIONS["TX"],
  },

  // ─── VIRGINIA ────────────────────────────────────────────────────────────
  {
    name: "Dhamma Hadaya – Virginia Buddhist Temple",
    state: "Virginia",
    address: "6745 Davis Ford Rd, Manassas, VA 20111",
    chiefMonk: "Ven. Thanthirimale Mahanama Thero",
    phone: "+1 202 569 0358",
    email: null,
    regionTag: STATE_REGIONS["VA"],
  },

  // ─── WASHINGTON ──────────────────────────────────────────────────────────
  // (Listed under "West Virginia" in source doc but address is Spokane, WA)
  {
    name: "Vietnamese Buddhist Temple (Spokane)",
    state: "Washington",
    address: "5025 N. Regal Street, Spokane, WA 99217",
    chiefMonk: "Ven. Kekanadure Dhammasiri Thero",
    phone: "+1 509 484 4331",
    email: "Kekanadura@yahoo.com",
    regionTag: STATE_REGIONS["WA"],
  },

  // ─── WEST VIRGINIA ───────────────────────────────────────────────────────
  {
    name: "Bhavana Society",
    state: "West Virginia",
    address: "Route 1, Box 218-3, Back Creek Road, High View, WV 26808",
    chiefMonk: "Ven. Dr. Henepola Gunaratana Nayaka Thero",
    phone: "+1 304 856 3241",
    email: "info@bhavanasociety.org",
    regionTag: STATE_REGIONS["WV"],
  },
];

async function main() {
  console.log(`🌱 Seeding ${temples.length} Sri Lankan Buddhist temples...`);

  let created = 0;
  let skipped = 0;

  for (const temple of temples) {
    const existing = await prisma.temple.findFirst({
      where: { name: temple.name, state: temple.state },
    });

    if (existing) {
      console.log(`  ⏭  Skipping (already exists): ${temple.name}`);
      skipped++;
      continue;
    }

    await prisma.temple.create({ data: temple });
    console.log(`  ✅ Created: ${temple.name} [${temple.regionTag}]`);
    created++;
  }

  console.log(`\n🎉 Done! ${created} created, ${skipped} skipped.`);

  // Print region summary
  const regionCounts = {};
  for (const t of temples) {
    regionCounts[t.regionTag] = (regionCounts[t.regionTag] || 0) + 1;
  }
  console.log("\n📊 Temple count by region:");
  for (const [region, count] of Object.entries(regionCounts).sort()) {
    console.log(`   ${region.padEnd(12)} ${count}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
