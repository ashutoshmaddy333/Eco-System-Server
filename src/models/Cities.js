const citiesByState = {
  "Andhra Pradesh": [
      "Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Rajahmundry", 
      "Kakinada", "Chittoor", "Nellore", "Kurnool", "Ongole", "Eluru", 
      "Bhimavaram", "Machilipatnam", "Anantapur", "Kadapa", "Guntakal", 
      "Adoni", "Gudivada", "Tenali", "Nandyal", "Narasaraopet", "Hindupur", 
      "Srikakulam", "Dharmavaram", "Palasa", "Piduguralla", "Peddapuram", 
      "Tadepalligudem", "Kadiri", "Autonagar", "Pithapuram", "Tadipatri", 
      "Vinukonda", "Sattenapalli", "Kavali", "Gorantla", "Rajamahendravaram", 
      "Proddatur", "Vizianagaram", "Madanapalle", "Punganur", "Atmakur", 
      "Jammalamadugu", "Yerraguntla", "Rajampet", "Badvel", "Rayachoti", 
      "Kodur", "Mydukur", "Vemula", "Pendlimarri", "Koilkuntla", "Pamidi"
  ],
  "Arunachal Pradesh": [
      "Itanagar", "Tawang", "Bomdila", "Pasighat", "Ziro", "Tezu", 
      "Roing", "Daporijo", "Along", "Namsai", "Aalo", "Seppa", 
      "Dirang", "Anini", "Mechuka", "Hayuliang", "Vijoynagar", 
      "Wakro", "Yingkiong", "Singu", "Dambuk", "Mebo", "Mariyang"
  ],
  "Assam": [
      "Guwahati", "Dispur", "Jorhat", "Silchar", "Dibrugarh", "Nagaon", 
      "Tezpur", "Karimganj", "Hailakandi", "Golaghat", "Barpeta", 
      "Dhemaji", "Dhubri", "Goalpara", "Haflong", "Kokrajhar", 
      "Lakhimpur", "Morigaon", "Nalbari", "Sibsagar", "Tinsukia", 
      "North Gauhati", "Rangia", "Naugachia", "Bongaigaon", "Mangaldai"
  ],
  "Bihar": [
      "Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Ara", "Begusarai", 
      "Darbhanga", "Purnia", "Katihar", "Munger", "Bettiah", "Hajipur", 
      "Saharsa", "Sasaram", "Dehri", "Siwan", "Motihari", "Jamalpur", 
      "Buxar", "Jehanabad", "Aurangabad", "Lakhisarai", "Sheikhpura", 
      "Jamui", "Kishanganj", "Madhepura", "Madhubani", "Samastipur", 
      "Sitamarhi", "Supaul", "Arwal", "Nawada", "Nalanda"
  ],
  "Chhattisgarh": [
      "Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", 
      "Ambikapur", "Jagdalpur", "Raigarh", "Kanker", "Dhamtari", 
      "Kawardha", "Jashpurnagar", "Kunkuri", "Champa", "Chirmiri", 
      "Kondagaon", "Bemetara", "Balod", "Gariaband", "Sukma"
  ],
  "Goa": [
      "Panaji", "Margao", "Vasco da Gama", "Ponda", "Mapusa", 
      "Calangute", "Candolim", "Mormugao", "Bicholim", "Pernem", 
      "Quepem", "Sanguem", "Sanquelim", "Cuncolim", "Curchorem", 
      "Valpoi"
  ],
  "Gujarat": [
      "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", 
      "Junagadh", "Bhavnagar", "Jamnagar", "Gandhidham", "Anand", 
      "Porbandar", "Morbi", "Surendranagar", "Mehsana", "Godhra", 
      "Navsari", "Bharuch", "Amreli", "Veraval", "Ankleshwar", 
      "Vapi", "Nadiad", "Kalol", "Bardoli", "Virar"
  ],
  "Haryana": [
      "Chandigarh", "Gurugram", "Faridabad", "Panipat", "Ambala", 
      "Rohtak", "Hisar", "Karnal", "Sonipat", "Yamuna Nagar", 
      "Panchkula", "Kurukshetra", "Rewari", "Sirsa", "Bhiwani", 
      "Kaithal", "Fatehabad", "Jind", "Mahendragarh", "Narnaul"
  ],
  "Himachal Pradesh": [
      "Shimla", "Manali", "Dharamshala", "Kullu", "Mandi", "Palampur", 
      "Solan", "Chamba", "Kangra", "Nahan", "Bilaspur", "Hamirpur", 
      "Una", "Sundernagar", "Nurpur", "Kasauli", "Dalhousie", 
      "Mcleodganj", "Pragpur", "Baijnath"
  ],
  "Jharkhand": [
      "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", 
      "Hazaribagh", "Giridih", "Ramgarh", "Medininagar", "Chirkunda", 
      "Dumka", "Godda", "Gumla", "Khunti", "Koderma", "Lohardaga", 
      "Pakur", "Palamu", "Sahebganj", "Simdega"
  ],
  "Karnataka": [
      "Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi", 
      "Kalaburagi", "Davanagere", "Hubballi", "Vijayapura", "Mandya", 
      "Shivamogga", "Tumakuru", "Raichur", "Chikkamagaluru", "Hassan", 
      "Bidar", "Kolar", "Udupi", "Hospet", "Ballari"
  ],
  "Kerala": [
      "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", 
      "Alappuzha", "Kannur", "Palakkad", "Kottayam", "Malappuram", 
      "Thalassery", "Kayamkulam", "Manjeri", "Cherthala", "Vadakara", 
      "Ottappalam", "Thodupuzha", "Kasaragod", "Punalur"
  ],
  "Madhya Pradesh": [
      "Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", 
      "Sagar", "Dewas", "Satna", "Ratlam", "Burhanpur", 
      "Morena", "Bhind", "Vidisha", "Mandsaur", "Khargone", 
      "Neemuch", "Pithampur", "Hoshangabad", "Chhatarpur", "Damoh"
  ],
  "Maharashtra": [
      "Mumbai", "Pune", "Nagpur", "Nashik", "Thane", 
      "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded", 
      "Ahmednagar", "Ulhasnagar", "Sangli", "Jalgaon", "Akola", 
      "Latur", "Dhule", "Chandrapur", "Parbhani", "Satara"
  ],
  "Manipur": [
      "Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching", 
      "Tamenglong", "Ukhrul", "Chandel", "Senapati", "Jiribam"
  ],
  "Meghalaya": [
      "Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", 
      "Baghmara", "Nongpoh", "Mairang", "Mawlai"
  ],
  "Mizoram": [
      "Aizawl", "Lunglei", "Saiha", "Serchhip", "Champhai", 
      "Kolasib", "Mamit", "Darlawn", "Thenzawl", "Vairengte"
  ],
  "Nagaland": [
      "Kohima", "Dimapur", "Mokokchung", "Tuensang", "Mon", 
      "Wokha", "Zunheboto", "Longleng", "Peren", "Kiphire"
  ],
  "Odisha": [
      "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", 
      "Puri", "Balasore", "Baragarh", "Jharsuguda", "Kendrapara", 
      "Jeypore", "Anugul", "Dhenkanal", "Koraput", "Rayagada"
  ],
  "Punjab": [
      "Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", 
      "Mohali", "Bathinda", "Firozpur", "Moga", "Pathankot", 
      "Kapurthala", "Khanna", "Mandi Gobindgarh", "Hoshiarpur"
  ],
  "Rajasthan": [
      "Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", 
      "Bikaner", "Alwar", "Bharatpur", "Sikar", "Mount Abu", 
      "Chittorgarh", "Ganganagar", "Jhalawar", "Jhunjhunu", "Nagaur"
  ],
  "Sikkim": [
      "Gangtok", "Namchi", "Pelling", "Yuksom", "Ravangla", 
      "Soreng", "Mangan", "Geyzing", "Nayabazar", "Singtam"
  ],
  "Tamil Nadu": [
      "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", 
      "Tirunelveli", "Erode", "Vellore", "Kancheepuram", "Thanjavur", 
      "Tiruvottiyur", "Dindigul", "Avadi", "Nagercoil", "Kanyakumari"
  ],
  "Telangana": [
      "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", 
      "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet"
  ],
  "Tripura": [
      "Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", 
      "Ambassa", "Kumarghat", "Teliamura", "Santir Bazar", "Khowai"
  ],
  "Uttar Pradesh": [
      "Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", 
      "Meerut", "Ghaziabad", "Bareilly", "Moradabad", "Aligarh", 
      "Gorakhpur", "Muzaffarnagar", "Mathura", "Jhansi", "Ayodhya"
  ],
  "Uttarakhand": [
      "Dehradun", "Haridwar", "Rishikesh", "Nainital", "Mussoorie", 
      "Almora", "Rudraprayag", "Chamoli", "Uttarkashi", "Tehri", 
      "Pauri", "Roorkee", "Kashipur"
  ],
  "West Bengal": [
      "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", 
      "Bardhaman", "Malda", "Kharagpur", "Haldia", "Ranaghat", 
      "Baharampur", "Habra", "Raiganj", "Jalpaiguri"
  ],
   "Andaman and Nicobar Islands": [
          "Port Blair", "Havelock", "Neil Island", "Rangat", 
          "Mayabunder", "Diglipur", "Car Nicobar"
      ],
      "Chandigarh": ["Chandigarh"],
      "Dadra and Nagar Haveli and Daman and Diu": [
          "Daman", "Diu", "Silvassa", "Dadra"
      ],
      "Delhi": ["New Delhi", "Delhi"],
      "Jammu and Kashmir": [
          "Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", 
          "Kupwara", "Pulwama", "Shopian", "Ganderbal"
      ],
      "Ladakh": ["Leh", "Kargil", "Drass", "Turtuk"],
      "Puducherry": ["Puducherry", "Karaikal", "Oulgaret", "Mahé", "Yanam"]
  
};


module.exports = citiesByState;