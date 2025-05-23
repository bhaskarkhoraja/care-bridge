import { Pool } from 'pg'

const countries = [
  {
    id: 1,
    name: 'South Georgia',
    nationality: 'South Georgian South Sandwich Islander',
    shortName: 'GS',
    countryCode: '+500',
  },
  {
    id: 3,
    name: 'Switzerland',
    nationality: 'Swiss',
    shortName: 'CH',
    countryCode: '+41',
  },
  {
    id: 4,
    name: 'Sierra Leone',
    nationality: 'Sierra Leonean',
    shortName: 'SL',
    countryCode: '+232',
  },
  {
    id: 5,
    name: 'Hungary',
    nationality: 'Hungarian',
    shortName: 'HU',
    countryCode: '+36',
  },
  {
    id: 6,
    name: 'Taiwan',
    nationality: 'Taiwanese',
    shortName: 'TW',
    countryCode: '+886',
  },
  {
    id: 7,
    name: 'Wallis and Futuna',
    nationality: 'Wallis and Futuna Islander',
    shortName: 'WF',
    countryCode: '+681',
  },
  {
    id: 9,
    name: 'Pitcairn Islands',
    nationality: 'Pitcairn Islander',
    shortName: 'PN',
    countryCode: '+64',
  },
  {
    id: 10,
    name: 'Ivory Coast',
    nationality: 'Ivorian',
    shortName: 'CI',
    countryCode: '+225',
  },
  {
    id: 11,
    name: 'Tunisia',
    nationality: 'Tunisian',
    shortName: 'TN',
    countryCode: '+216',
  },
  {
    id: 12,
    name: 'Italy',
    nationality: 'Italian',
    shortName: 'IT',
    countryCode: '+39',
  },
  {
    id: 13,
    name: 'Benin',
    nationality: 'Beninese',
    shortName: 'BJ',
    countryCode: '+229',
  },
  {
    id: 14,
    name: 'Indonesia',
    nationality: 'Indonesian',
    shortName: 'ID',
    countryCode: '+62',
  },
  {
    id: 15,
    name: 'Cape Verde',
    nationality: 'Cape Verdian',
    shortName: 'CV',
    countryCode: '+238',
  },
  {
    id: 17,
    name: 'Laos',
    nationality: 'Laotian',
    shortName: 'LA',
    countryCode: '+856',
  },
  {
    id: 18,
    name: 'Caribbean Netherlands',
    nationality: 'Dutch',
    shortName: 'BQ',
    countryCode: '+599',
  },
  {
    id: 19,
    name: 'Uganda',
    nationality: 'Ugandan',
    shortName: 'UG',
    countryCode: '+256',
  },
  {
    id: 20,
    name: 'Andorra',
    nationality: 'Andorran',
    shortName: 'AD',
    countryCode: '+376',
  },
  {
    id: 21,
    name: 'Burundi',
    nationality: 'Burundian',
    shortName: 'BI',
    countryCode: '+257',
  },
  {
    id: 22,
    name: 'South Africa',
    nationality: 'South African',
    shortName: 'ZA',
    countryCode: '+27',
  },
  {
    id: 23,
    name: 'France',
    nationality: 'French',
    shortName: 'FR',
    countryCode: '+33',
  },
  {
    id: 24,
    name: 'Libya',
    nationality: 'Libyan',
    shortName: 'LY',
    countryCode: '+218',
  },
  {
    id: 25,
    name: 'Mexico',
    nationality: 'Mexican',
    shortName: 'MX',
    countryCode: '+52',
  },
  {
    id: 26,
    name: 'Gabon',
    nationality: 'Gabonese',
    shortName: 'GA',
    countryCode: '+241',
  },
  {
    id: 28,
    name: 'North Macedonia',
    nationality: 'Macedonian',
    shortName: 'MK',
    countryCode: '+389',
  },
  {
    id: 29,
    name: 'China',
    nationality: 'Chinese',
    shortName: 'CN',
    countryCode: '+86',
  },
  {
    id: 30,
    name: 'Yemen',
    nationality: 'Yemeni',
    shortName: 'YE',
    countryCode: '+967',
  },
  {
    id: 31,
    name: 'Saint Barthélemy',
    nationality: 'Saint Barthélemy Islander',
    shortName: 'BL',
    countryCode: '+590',
  },
  {
    id: 32,
    name: 'Guernsey',
    nationality: 'Channel Islander',
    shortName: 'GG',
    countryCode: '+44',
  },
  {
    id: 33,
    name: 'Solomon Islands',
    nationality: 'Solomon Islander',
    shortName: 'SB',
    countryCode: '+677',
  },
  {
    id: 35,
    name: 'Faroe Islands',
    nationality: 'Faroese',
    shortName: 'FO',
    countryCode: '+298',
  },
  {
    id: 36,
    name: 'Uzbekistan',
    nationality: 'Uzbekistani',
    shortName: 'UZ',
    countryCode: '+998',
  },
  {
    id: 37,
    name: 'Egypt',
    nationality: 'Egyptian',
    shortName: 'EG',
    countryCode: '+20',
  },
  {
    id: 38,
    name: 'Senegal',
    nationality: 'Senegalese',
    shortName: 'SN',
    countryCode: '+221',
  },
  {
    id: 39,
    name: 'Sri Lanka',
    nationality: 'Sri Lankan',
    shortName: 'LK',
    countryCode: '+94',
  },
  {
    id: 40,
    name: 'Palestine',
    nationality: 'Palestinian',
    shortName: 'PS',
    countryCode: '+970',
  },
  {
    id: 41,
    name: 'Bangladesh',
    nationality: 'Bangladeshi',
    shortName: 'BD',
    countryCode: '+880',
  },
  {
    id: 42,
    name: 'Peru',
    nationality: 'Peruvian',
    shortName: 'PE',
    countryCode: '+51',
  },
  {
    id: 43,
    name: 'Singapore',
    nationality: 'Singaporean',
    shortName: 'SG',
    countryCode: '+65',
  },
  {
    id: 44,
    name: 'Turkey',
    nationality: 'Turkish',
    shortName: 'TR',
    countryCode: '+90',
  },
  {
    id: 45,
    name: 'Afghanistan',
    nationality: 'Afghan',
    shortName: 'AF',
    countryCode: '+93',
  },
  {
    id: 46,
    name: 'Aruba',
    nationality: 'Aruban',
    shortName: 'AW',
    countryCode: '+297',
  },
  {
    id: 47,
    name: 'Cook Islands',
    nationality: 'Cook Islander',
    shortName: 'CK',
    countryCode: '+682',
  },
  {
    id: 49,
    name: 'Zambia',
    nationality: 'Zambian',
    shortName: 'ZM',
    countryCode: '+260',
  },
  {
    id: 50,
    name: 'Finland',
    nationality: 'Finnish',
    shortName: 'FI',
    countryCode: '+358',
  },
  {
    id: 51,
    name: 'Niger',
    nationality: 'Nigerien',
    shortName: 'NE',
    countryCode: '+227',
  },
  {
    id: 52,
    name: 'Christmas Island',
    nationality: 'Christmas Islander',
    shortName: 'CX',
    countryCode: '+61',
  },
  {
    id: 53,
    name: 'Tokelau',
    nationality: 'Tokelauan',
    shortName: 'TK',
    countryCode: '+690',
  },
  {
    id: 54,
    name: 'Guinea-Bissau',
    nationality: 'Guinea-Bissauan',
    shortName: 'GW',
    countryCode: '+245',
  },
  {
    id: 55,
    name: 'Azerbaijan',
    nationality: 'Azerbaijani',
    shortName: 'AZ',
    countryCode: '+994',
  },
  {
    id: 56,
    name: 'Réunion',
    nationality: 'Réunionese',
    shortName: 'RE',
    countryCode: '+262',
  },
  {
    id: 57,
    name: 'Djibouti',
    nationality: 'Djibouti',
    shortName: 'DJ',
    countryCode: '+253',
  },
  {
    id: 58,
    name: 'North Korea',
    nationality: 'North Korean',
    shortName: 'KP',
    countryCode: '+850',
  },
  {
    id: 59,
    name: 'Mauritius',
    nationality: 'Mauritian',
    shortName: 'MU',
    countryCode: '+230',
  },
  {
    id: 62,
    name: 'Colombia',
    nationality: 'Colombian',
    shortName: 'CO',
    countryCode: '+57',
  },
  {
    id: 63,
    name: 'Greece',
    nationality: 'Greek',
    shortName: 'GR',
    countryCode: '+30',
  },
  {
    id: 64,
    name: 'Croatia',
    nationality: 'Croatian',
    shortName: 'HR',
    countryCode: '+385',
  },
  {
    id: 65,
    name: 'Morocco',
    nationality: 'Moroccan',
    shortName: 'MA',
    countryCode: '+212',
  },
  {
    id: 66,
    name: 'Algeria',
    nationality: 'Algerian',
    shortName: 'DZ',
    countryCode: '+213',
  },
  {
    id: 69,
    name: 'Sudan',
    nationality: 'Sudanese',
    shortName: 'SD',
    countryCode: '+249',
  },
  {
    id: 70,
    name: 'Fiji',
    nationality: 'Fijian',
    shortName: 'FJ',
    countryCode: '+679',
  },
  {
    id: 71,
    name: 'Liechtenstein',
    nationality: 'Liechtensteiner',
    shortName: 'LI',
    countryCode: '+423',
  },
  {
    id: 72,
    name: 'Nepal',
    nationality: 'Nepalese',
    shortName: 'NP',
    countryCode: '+977',
  },
  {
    id: 74,
    name: 'Georgia',
    nationality: 'Georgian',
    shortName: 'GE',
    countryCode: '+995',
  },
  {
    id: 75,
    name: 'Pakistan',
    nationality: 'Pakistani',
    shortName: 'PK',
    countryCode: '+92',
  },
  {
    id: 76,
    name: 'Monaco',
    nationality: 'Monegasque',
    shortName: 'MC',
    countryCode: '+377',
  },
  {
    id: 77,
    name: 'Botswana',
    nationality: 'Motswana',
    shortName: 'BW',
    countryCode: '+267',
  },
  {
    id: 78,
    name: 'Lebanon',
    nationality: 'Lebanese',
    shortName: 'LB',
    countryCode: '+961',
  },
  {
    id: 79,
    name: 'Papua New Guinea',
    nationality: 'Papua New Guinean',
    shortName: 'PG',
    countryCode: '+675',
  },
  {
    id: 82,
    name: 'Norfolk Island',
    nationality: 'Norfolk Islander',
    shortName: 'NF',
    countryCode: '+672',
  },
  {
    id: 83,
    name: 'Bouvet Island',
    nationality: '',
    shortName: 'BV',
    countryCode: '+47',
  },
  {
    id: 84,
    name: 'Qatar',
    nationality: 'Qatari',
    shortName: 'QA',
    countryCode: '+974',
  },
  {
    id: 85,
    name: 'Madagascar',
    nationality: 'Malagasy',
    shortName: 'MG',
    countryCode: '+261',
  },
  {
    id: 86,
    name: 'India',
    nationality: 'Indian',
    shortName: 'IN',
    countryCode: '+91',
  },
  {
    id: 87,
    name: 'Syria',
    nationality: 'Syrian',
    shortName: 'SY',
    countryCode: '+963',
  },
  {
    id: 88,
    name: 'Montenegro',
    nationality: 'Montenegrin',
    shortName: 'ME',
    countryCode: '+382',
  },
  {
    id: 89,
    name: 'Eswatini',
    nationality: 'Swazi',
    shortName: 'SZ',
    countryCode: '+268',
  },
  {
    id: 90,
    name: 'Paraguay',
    nationality: 'Paraguayan',
    shortName: 'PY',
    countryCode: '+595',
  },
  {
    id: 91,
    name: 'El Salvador',
    nationality: 'Salvadoran',
    shortName: 'SV',
    countryCode: '+503',
  },
  {
    id: 92,
    name: 'Ukraine',
    nationality: 'Ukrainian',
    shortName: 'UA',
    countryCode: '+380',
  },
  {
    id: 94,
    name: 'Namibia',
    nationality: 'Namibian',
    shortName: 'NA',
    countryCode: '+264',
  },
  {
    id: 95,
    name: 'United Arab Emirates',
    nationality: 'Emirati',
    shortName: 'AE',
    countryCode: '+971',
  },
  {
    id: 96,
    name: 'Bulgaria',
    nationality: 'Bulgarian',
    shortName: 'BG',
    countryCode: '+359',
  },
  {
    id: 97,
    name: 'Greenland',
    nationality: 'Greenlandic',
    shortName: 'GL',
    countryCode: '+299',
  },
  {
    id: 98,
    name: 'Germany',
    nationality: 'German',
    shortName: 'DE',
    countryCode: '+49',
  },
  {
    id: 99,
    name: 'Cambodia',
    nationality: 'Cambodian',
    shortName: 'KH',
    countryCode: '+855',
  },
  {
    id: 100,
    name: 'Iraq',
    nationality: 'Iraqi',
    shortName: 'IQ',
    countryCode: '+964',
  },
  {
    id: 102,
    name: 'Sweden',
    nationality: 'Swedish',
    shortName: 'SE',
    countryCode: '+46',
  },
  {
    id: 103,
    name: 'Cuba',
    nationality: 'Cuban',
    shortName: 'CU',
    countryCode: '+53',
  },
  {
    id: 104,
    name: 'Kyrgyzstan',
    nationality: 'Kirghiz',
    shortName: 'KG',
    countryCode: '+996',
  },
  {
    id: 105,
    name: 'Russia',
    nationality: 'Russian',
    shortName: 'RU',
    countryCode: '+73',
  },
  {
    id: 106,
    name: 'Malaysia',
    nationality: 'Malaysian',
    shortName: 'MY',
    countryCode: '+60',
  },
  {
    id: 107,
    name: 'São Tomé and Príncipe',
    nationality: 'Sao Tomean',
    shortName: 'ST',
    countryCode: '+239',
  },
  {
    id: 108,
    name: 'Cyprus',
    nationality: 'Cypriot',
    shortName: 'CY',
    countryCode: '+357',
  },
  {
    id: 109,
    name: 'Canada',
    nationality: 'Canadian',
    shortName: 'CA',
    countryCode: '+1',
  },
  {
    id: 110,
    name: 'Malawi',
    nationality: 'Malawian',
    shortName: 'MW',
    countryCode: '+265',
  },
  {
    id: 111,
    name: 'Saudi Arabia',
    nationality: 'Saudi Arabian',
    shortName: 'SA',
    countryCode: '+966',
  },
  {
    id: 112,
    name: 'Bosnia and Herzegovina',
    nationality: 'Bosnian, Herzegovinian',
    shortName: 'BA',
    countryCode: '+387',
  },
  {
    id: 113,
    name: 'Ethiopia',
    nationality: 'Ethiopian',
    shortName: 'ET',
    countryCode: '+251',
  },
  {
    id: 114,
    name: 'Spain',
    nationality: 'Spanish',
    shortName: 'ES',
    countryCode: '+34',
  },
  {
    id: 115,
    name: 'Slovenia',
    nationality: 'Slovene',
    shortName: 'SI',
    countryCode: '+386',
  },
  {
    id: 116,
    name: 'Oman',
    nationality: 'Omani',
    shortName: 'OM',
    countryCode: '+968',
  },
  {
    id: 117,
    name: 'Saint Pierre and Miquelon',
    nationality: 'Saint-Pierrais, Miquelonnais',
    shortName: 'PM',
    countryCode: '+508',
  },
  {
    id: 118,
    name: 'Macau',
    nationality: 'Macanese',
    shortName: 'MO',
    countryCode: '+853',
  },
  {
    id: 119,
    name: 'San Marino',
    nationality: 'Sammarinese',
    shortName: 'SM',
    countryCode: '+378',
  },
  {
    id: 120,
    name: 'Lesotho',
    nationality: 'Mosotho',
    shortName: 'LS',
    countryCode: '+266',
  },
  {
    id: 121,
    name: 'Marshall Islands',
    nationality: 'Marshallese',
    shortName: 'MH',
    countryCode: '+692',
  },
  {
    id: 123,
    name: 'Iceland',
    nationality: 'Icelander',
    shortName: 'IS',
    countryCode: '+354',
  },
  {
    id: 124,
    name: 'Luxembourg',
    nationality: 'Luxembourger',
    shortName: 'LU',
    countryCode: '+352',
  },
  {
    id: 125,
    name: 'Argentina',
    nationality: 'Argentine',
    shortName: 'AR',
    countryCode: '+54',
  },
  {
    id: 127,
    name: 'Nauru',
    nationality: 'Nauruan',
    shortName: 'NR',
    countryCode: '+674',
  },
  {
    id: 131,
    name: 'Costa Rica',
    nationality: 'Costa Rican',
    shortName: 'CR',
    countryCode: '+506',
  },
  {
    id: 133,
    name: 'Thailand',
    nationality: 'Thai',
    shortName: 'TH',
    countryCode: '+66',
  },
  {
    id: 134,
    name: 'Haiti',
    nationality: 'Haitian',
    shortName: 'HT',
    countryCode: '+509',
  },
  {
    id: 135,
    name: 'Tuvalu',
    nationality: 'Tuvaluan',
    shortName: 'TV',
    countryCode: '+688',
  },
  {
    id: 136,
    name: 'Honduras',
    nationality: 'Honduran',
    shortName: 'HN',
    countryCode: '+504',
  },
  {
    id: 137,
    name: 'Equatorial Guinea',
    nationality: 'Equatorial Guinean',
    shortName: 'GQ',
    countryCode: '+240',
  },
  {
    id: 139,
    name: 'French Polynesia',
    nationality: 'French Polynesian',
    shortName: 'PF',
    countryCode: '+689',
  },
  {
    id: 140,
    name: 'Belarus',
    nationality: 'Belarusian',
    shortName: 'BY',
    countryCode: '+375',
  },
  {
    id: 141,
    name: 'Latvia',
    nationality: 'Latvian',
    shortName: 'LV',
    countryCode: '+371',
  },
  {
    id: 142,
    name: 'Palau',
    nationality: 'Palauan',
    shortName: 'PW',
    countryCode: '+680',
  },
  {
    id: 144,
    name: 'Philippines',
    nationality: 'Filipino',
    shortName: 'PH',
    countryCode: '+63',
  },
  {
    id: 145,
    name: 'Gibraltar',
    nationality: 'Gibraltar',
    shortName: 'GI',
    countryCode: '+350',
  },
  {
    id: 146,
    name: 'Denmark',
    nationality: 'Danish',
    shortName: 'DK',
    countryCode: '+45',
  },
  {
    id: 147,
    name: 'Cameroon',
    nationality: 'Cameroonian',
    shortName: 'CM',
    countryCode: '+237',
  },
  {
    id: 148,
    name: 'Guinea',
    nationality: 'Guinean',
    shortName: 'GN',
    countryCode: '+224',
  },
  {
    id: 149,
    name: 'Bahrain',
    nationality: 'Bahraini',
    shortName: 'BH',
    countryCode: '+973',
  },
  {
    id: 150,
    name: 'Suriname',
    nationality: 'Surinamer',
    shortName: 'SR',
    countryCode: '+597',
  },
  {
    id: 151,
    name: 'DR Congo',
    nationality: 'Congolese',
    shortName: 'CD',
    countryCode: '+243',
  },
  {
    id: 152,
    name: 'Somalia',
    nationality: 'Somali',
    shortName: 'SO',
    countryCode: '+252',
  },
  {
    id: 153,
    name: 'Czechia',
    nationality: 'Czech',
    shortName: 'CZ',
    countryCode: '+420',
  },
  {
    id: 154,
    name: 'New Caledonia',
    nationality: 'New Caledonian',
    shortName: 'NC',
    countryCode: '+687',
  },
  {
    id: 155,
    name: 'Vanuatu',
    nationality: 'Ni-Vanuatu',
    shortName: 'VU',
    countryCode: '+678',
  },
  {
    id: 156,
    name: 'Saint Helena, Ascension and Tristan da Cunha',
    nationality: 'Saint Helenian',
    shortName: 'SH',
    countryCode: '+290',
  },
  {
    id: 157,
    name: 'Togo',
    nationality: 'Togolese',
    shortName: 'TG',
    countryCode: '+228',
  },
  {
    id: 159,
    name: 'Kenya',
    nationality: 'Kenyan',
    shortName: 'KE',
    countryCode: '+254',
  },
  {
    id: 160,
    name: 'Niue',
    nationality: 'Niuean',
    shortName: 'NU',
    countryCode: '+683',
  },
  {
    id: 162,
    name: 'Rwanda',
    nationality: 'Rwandan',
    shortName: 'RW',
    countryCode: '+250',
  },
  {
    id: 163,
    name: 'Estonia',
    nationality: 'Estonian',
    shortName: 'EE',
    countryCode: '+372',
  },
  {
    id: 164,
    name: 'Romania',
    nationality: 'Romanian',
    shortName: 'RO',
    countryCode: '+40',
  },
  {
    id: 166,
    name: 'Guyana',
    nationality: 'Guyanese',
    shortName: 'GY',
    countryCode: '+592',
  },
  {
    id: 167,
    name: 'Timor-Leste',
    nationality: 'East Timorese',
    shortName: 'TL',
    countryCode: '+670',
  },
  {
    id: 168,
    name: 'Vietnam',
    nationality: 'Vietnamese',
    shortName: 'VN',
    countryCode: '+84',
  },
  {
    id: 169,
    name: 'Uruguay',
    nationality: 'Uruguayan',
    shortName: 'UY',
    countryCode: '+598',
  },
  {
    id: 171,
    name: 'Hong Kong',
    nationality: 'Hong Konger',
    shortName: 'HK',
    countryCode: '+852',
  },
  {
    id: 172,
    name: 'Austria',
    nationality: 'Austrian',
    shortName: 'AT',
    countryCode: '+43',
  },
  {
    id: 174,
    name: 'Turkmenistan',
    nationality: 'Turkmen',
    shortName: 'TM',
    countryCode: '+993',
  },
  {
    id: 175,
    name: 'Mozambique',
    nationality: 'Mozambican',
    shortName: 'MZ',
    countryCode: '+258',
  },
  {
    id: 176,
    name: 'Panama',
    nationality: 'Panamanian',
    shortName: 'PA',
    countryCode: '+507',
  },
  {
    id: 177,
    name: 'Micronesia',
    nationality: 'Micronesian',
    shortName: 'FM',
    countryCode: '+691',
  },
  {
    id: 178,
    name: 'Ireland',
    nationality: 'Irish',
    shortName: 'IE',
    countryCode: '+353',
  },
  {
    id: 180,
    name: 'French Guiana',
    nationality: 'Guianan',
    shortName: 'GF',
    countryCode: '+594',
  },
  {
    id: 183,
    name: 'Central African Republic',
    nationality: 'Central African',
    shortName: 'CF',
    countryCode: '+236',
  },
  {
    id: 184,
    name: 'Burkina Faso',
    nationality: 'Burkinabe',
    shortName: 'BF',
    countryCode: '+226',
  },
  {
    id: 185,
    name: 'Eritrea',
    nationality: 'Eritrean',
    shortName: 'ER',
    countryCode: '+291',
  },
  {
    id: 186,
    name: 'Tanzania',
    nationality: 'Tanzanian',
    shortName: 'TZ',
    countryCode: '+255',
  },
  {
    id: 187,
    name: 'South Korea',
    nationality: 'South Korean',
    shortName: 'KR',
    countryCode: '+82',
  },
  {
    id: 188,
    name: 'Jordan',
    nationality: 'Jordanian',
    shortName: 'JO',
    countryCode: '+962',
  },
  {
    id: 189,
    name: 'Mauritania',
    nationality: 'Mauritanian',
    shortName: 'MR',
    countryCode: '+222',
  },
  {
    id: 190,
    name: 'Lithuania',
    nationality: 'Lithuanian',
    shortName: 'LT',
    countryCode: '+370',
  },
  {
    id: 192,
    name: 'Slovakia',
    nationality: 'Slovak',
    shortName: 'SK',
    countryCode: '+421',
  },
  {
    id: 193,
    name: 'Angola',
    nationality: 'Angolan',
    shortName: 'AO',
    countryCode: '+244',
  },
  {
    id: 194,
    name: 'Kazakhstan',
    nationality: 'Kazakhstani',
    shortName: 'KZ',
    countryCode: '+76',
  },
  {
    id: 195,
    name: 'Moldova',
    nationality: 'Moldovan',
    shortName: 'MD',
    countryCode: '+373',
  },
  {
    id: 196,
    name: 'Mali',
    nationality: 'Malian',
    shortName: 'ML',
    countryCode: '+223',
  },
  {
    id: 198,
    name: 'Armenia',
    nationality: 'Armenian',
    shortName: 'AM',
    countryCode: '+374',
  },
  {
    id: 199,
    name: 'Samoa',
    nationality: 'Samoan',
    shortName: 'WS',
    countryCode: '+685',
  },
  {
    id: 201,
    name: 'Japan',
    nationality: 'Japanese',
    shortName: 'JP',
    countryCode: '+81',
  },
  {
    id: 202,
    name: 'Bolivia',
    nationality: 'Bolivian',
    shortName: 'BO',
    countryCode: '+591',
  },
  {
    id: 203,
    name: 'Chile',
    nationality: 'Chilean',
    shortName: 'CL',
    countryCode: '+56',
  },
  {
    id: 207,
    name: 'Seychelles',
    nationality: 'Seychellois',
    shortName: 'SC',
    countryCode: '+248',
  },
  {
    id: 209,
    name: 'Guatemala',
    nationality: 'Guatemalan',
    shortName: 'GT',
    countryCode: '+502',
  },
  {
    id: 210,
    name: 'Ecuador',
    nationality: 'Ecuadorean',
    shortName: 'EC',
    countryCode: '+593',
  },
  {
    id: 211,
    name: 'Martinique',
    nationality: 'Martinican',
    shortName: 'MQ',
    countryCode: '+596',
  },
  {
    id: 212,
    name: 'Tajikistan',
    nationality: 'Tadzhik',
    shortName: 'TJ',
    countryCode: '+992',
  },
  {
    id: 213,
    name: 'Malta',
    nationality: 'Maltese',
    shortName: 'MT',
    countryCode: '+356',
  },
  {
    id: 214,
    name: 'Gambia',
    nationality: 'Gambian',
    shortName: 'GM',
    countryCode: '+220',
  },
  {
    id: 215,
    name: 'Nigeria',
    nationality: 'Nigerian',
    shortName: 'NG',
    countryCode: '+234',
  },
  {
    id: 217,
    name: 'Kosovo',
    nationality: 'Kosovar',
    shortName: 'XK',
    countryCode: '+383',
  },
  {
    id: 218,
    name: 'Kuwait',
    nationality: 'Kuwaiti',
    shortName: 'KW',
    countryCode: '+965',
  },
  {
    id: 219,
    name: 'Maldives',
    nationality: 'Maldivan',
    shortName: 'MV',
    countryCode: '+960',
  },
  {
    id: 220,
    name: 'South Sudan',
    nationality: 'South Sudanese',
    shortName: 'SS',
    countryCode: '+211',
  },
  {
    id: 221,
    name: 'Iran',
    nationality: 'Iranian',
    shortName: 'IR',
    countryCode: '+98',
  },
  {
    id: 222,
    name: 'Albania',
    nationality: 'Albanian',
    shortName: 'AL',
    countryCode: '+355',
  },
  {
    id: 223,
    name: 'Brazil',
    nationality: 'Brazilian',
    shortName: 'BR',
    countryCode: '+55',
  },
  {
    id: 224,
    name: 'Serbia',
    nationality: 'Serbian',
    shortName: 'RS',
    countryCode: '+381',
  },
  {
    id: 225,
    name: 'Belize',
    nationality: 'Belizean',
    shortName: 'BZ',
    countryCode: '+501',
  },
  {
    id: 226,
    name: 'Myanmar',
    nationality: 'Burmese',
    shortName: 'MM',
    countryCode: '+95',
  },
  {
    id: 227,
    name: 'Bhutan',
    nationality: 'Bhutanese',
    shortName: 'BT',
    countryCode: '+975',
  },
  {
    id: 228,
    name: 'Venezuela',
    nationality: 'Venezuelan',
    shortName: 'VE',
    countryCode: '+58',
  },
  {
    id: 229,
    name: 'Liberia',
    nationality: 'Liberian',
    shortName: 'LR',
    countryCode: '+231',
  },
  {
    id: 231,
    name: 'Poland',
    nationality: 'Polish',
    shortName: 'PL',
    countryCode: '+48',
  },
  {
    id: 233,
    name: 'Brunei',
    nationality: 'Bruneian',
    shortName: 'BN',
    countryCode: '+673',
  },
  {
    id: 234,
    name: 'Comoros',
    nationality: 'Comoran',
    shortName: 'KM',
    countryCode: '+269',
  },
  {
    id: 236,
    name: 'Tonga',
    nationality: 'Tongan',
    shortName: 'TO',
    countryCode: '+676',
  },
  {
    id: 237,
    name: 'Kiribati',
    nationality: 'I-Kiribati',
    shortName: 'KI',
    countryCode: '+686',
  },
  {
    id: 238,
    name: 'Ghana',
    nationality: 'Ghanaian',
    shortName: 'GH',
    countryCode: '+233',
  },
  {
    id: 239,
    name: 'Chad',
    nationality: 'Chadian',
    shortName: 'TD',
    countryCode: '+235',
  },
  {
    id: 240,
    name: 'Zimbabwe',
    nationality: 'Zimbabwean',
    shortName: 'ZW',
    countryCode: '+263',
  },
  {
    id: 242,
    name: 'Mongolia',
    nationality: 'Mongolian',
    shortName: 'MN',
    countryCode: '+976',
  },
  {
    id: 243,
    name: 'Portugal',
    nationality: 'Portuguese',
    shortName: 'PT',
    countryCode: '+351',
  },
  {
    id: 246,
    name: 'Belgium',
    nationality: 'Belgian',
    shortName: 'BE',
    countryCode: '+32',
  },
  {
    id: 247,
    name: 'Israel',
    nationality: 'Israeli',
    shortName: 'IL',
    countryCode: '+972',
  },
  {
    id: 249,
    name: 'Nicaragua',
    nationality: 'Nicaraguan',
    shortName: 'NI',
    countryCode: '+505',
  },
]
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function seedCountries() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    for (const country of countries) {
      await client.query(
        'INSERT INTO country (name, nationality, short_name, country_code) VALUES ($1, $2, $3, $4)',
        [
          country.name,
          country.nationality,
          country.shortName,
          country.countryCode,
        ],
      )
    }

    await client.query('COMMIT')
    console.log('Countries seeded successfully!')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error seeding countries:', err)
  } finally {
    client.release()
  }
}

seedCountries()
