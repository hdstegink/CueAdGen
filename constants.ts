
import { RagExample } from './types';

export interface AccountManager {
  name: string;
  email: string;
}

export const ACCOUNT_MANAGERS: AccountManager[] = [
  { name: "Hidde", email: "hidde.stegink@persgroep.net" },
  { name: "Kim", email: "kim.groen@persgroep.net" },
  { name: "Rosanne", email: "rosanne.brandjes@persgroep.net" },
  { name: "Jeremy", email: "jeremy.van.der.breggen@persgroep.net" },
  { name: "Kevin", email: "kevin.schmidt@persgroep.net" },
  { name: "Rutger", email: "rutger.praamstra@persgroep.net" },
  { name: "Gunar", email: "gunar.miltenburg@persgroep.net" },
  { name: "Karel", email: "karel.scheerder@persgroep.net" }
];

export const RAG_DATASET: RagExample[] = [
  {
    "id": "kamera_express_01",
    "brand": "Kamera Express",
    "category": "Retail",
    "duration_type": "20s",
    "tags": ["Sales", "Energiek", "Cashback", "Elektronica"],
    "transcript": "Wil jij betere foto's maken? Profiteer dan nu van de cashback actie! Tot wel 500 euro retour op camera's. Mis het niet. Ga snel naar Kamera-Express.nl."
  },
  {
    "id": "amazon_01",
    "brand": "Amazon",
    "category": "Brand",
    "duration_type": "30s",
    "tags": ["Storytelling", "Gemak", "Assortiment", "Rustig"],
    "transcript": "Klaar voor de zomer? Van zwembad tot zonnebrand. Wij hebben alles in huis. Morgen al bezorgd. Bestel nu simpel bij Amazon."
  },
  {
    "id": "independer_01",
    "brand": "Independer",
    "category": "Service",
    "duration_type": "10s",
    "tags": ["Tag-on", "Autoriteit", "Financieel", "Kort"],
    "transcript": "Niet te veel betalen? Check nu je zorgpremie. En stap direct over. Gewoon even checken. Op Independer.nl."
  },
  {
    "id": "aldi_01",
    "brand": "ALDI",
    "category": "Retail",
    "duration_type": "10s",
    "tags": ["Hard Sales", "Prijs", "Food", "Product Focus"],
    "transcript": "Nu bij Aldi. De lekkerste slagersgehaktballen. 4 stuks voor maar 1,99. Dat is Aldi. Natuurlijk wel."
  },
  {
    "id": "gbvweco_01",
    "brand": "GBVweco",
    "category": "Niche",
    "duration_type": "10s",
    "tags": ["Seizoen", "Vuurwerk", "Urgentie", "Gratis"],
    "transcript": "Het grootste vuurwerk assortiment van Nederland. Bestel nu op vuurwerk punt nl en krijg gratis vuurwerk in de voorverkoop. Vuurwerk punt nl."
  },
  {
    "id": "beterbed_01",
    "brand": "Beter Bed",
    "category": "Wonen",
    "duration_type": "10s",
    "tags": ["Probleem/Oplossing", "Actie", "Slapen"],
    "transcript": "Goed slapen begint bij Beter Bed. Profiteer nu van 2e matras voor de halve prijs. Beter Bed. Beter slapen, beter leven."
  },
  {
    "id": "ohra_01",
    "brand": "OHRA",
    "category": "Service",
    "duration_type": "5s",
    "tags": ["Tag-on", "Zorg", "Kerst", "Ultra-kort"],
    "transcript": "Zorgeloze Kerst? Regel je zorgzaken direct via de OHRA app. OHRA."
  },
  {
    "id": "euromaster_01",
    "brand": "Euromaster",
    "category": "Service",
    "duration_type": "15s",
    "tags": ["Auto", "Veiligheid", "Vertrouwen"],
    "transcript": "Je auto is in goede handen bij Euromaster. Voor onderhoud, banden en APK. En kies je voor Continental banden? Dan ga je altijd veilig de weg op. Euromaster. Omdat je veilig wilt thuiskomen."
  },
  {
    "id": "lebara_01",
    "brand": "Lebara",
    "category": "Telecom",
    "duration_type": "15s",
    "tags": ["Snelheid", "Online", "Sim Only"],
    "transcript": "Sim Only van Lebara. Dat is aangesloten op het best geteste netwerk. En alles online geregeld. Binnen 1 minuut via Lebara.nl. Lebara. Niet te stoppen."
  },
  {
    "id": "ikea_01",
    "brand": "IKEA",
    "category": "Wonen",
    "duration_type": "15s",
    "tags": ["Inspiratie", "Sfeer", "Thuis", "Collectie"],
    "transcript": "Haal alles uit je huis. Ontdek de nieuwe collectie van Ikea. Voor slimme opbergers en een frisse look. Zo maak je van je huis, echt je thuis. Ikea."
  },
  {
    "id": "bol_01",
    "brand": "Bol",
    "category": "Retail",
    "duration_type": "15s",
    "tags": ["Urgentie", "Dagdeal", "Schaarste", "E-commerce"],
    "transcript": "Het is de Bol 7-daagse. Met vandaag: scoor hoge korting op heel veel verzorging. Alles voor een stralende look. Alleen vandaag. Op = op. Bol. De winkel van ons allemaal."
  },
  {
    "id": "abnamro_01",
    "brand": "ABN AMRO",
    "category": "B2B",
    "duration_type": "20s",
    "tags": ["Zakelijk", "Toekomst", "Advies", "Corporate"],
    "transcript": "Ondernemen is vooruitkijken. Kansen zien waar anderen stoppen. Bij ABN AMRO begrijpen we dat. Daarom staan onze experts klaar met advies voor jouw groei. Of je nu wilt verduurzamen of uitbreiden. ABN AMRO. Voor ieder begin."
  },
  {
    "id": "hornbach_01",
    "brand": "Hornbach",
    "category": "DIY",
    "duration_type": "20s",
    "tags": ["Mannelijk", "Klussen", "SFX", "Humor"],
    "transcript": "[SFX: Zaaggeluiden] Alles voor jouw project. Of je nu gaat verbouwen of renoveren. Hornbach heeft alles op voorraad. Met de laagste prijsgarantie. En professioneel advies. Yippiejajayippieyippieyeah. Er is altijd iets te doen."
  },
  {
    "id": "kleertjes_01",
    "brand": "Kleertjes.com",
    "category": "Retail",
    "duration_type": "20s",
    "tags": ["Kids", "Promo", "Stapelen", "Tag-on"],
    "transcript": "Het is Kids Festival bij Kleertjes.com. Shop nu de nieuwe collectie met 15% korting. En... Profiteer ook van 5 euro extra korting op alle Pampers. Dat tikt lekker aan. Kleertjes.com."
  },
  {
    "id": "bioscoopbon_01",
    "brand": "Nationale Bioscoopbon",
    "category": "Cadeau",
    "duration_type": "15s",
    "tags": ["Sinterklaas", "Inhaker", "Beleving"],
    "transcript": "[Sinterklaasmuziek] Wie zoet is krijgt lekkers... maar wat geef je dit year? Geef een beleving in het donker. De Nationale Bioscoopbon. Het leukste cadeau voor in de schoen of op pakjesavond."
  },
  {
    "id": "nocnsf_01",
    "brand": "NOC*NSF",
    "category": "Non-profit",
    "duration_type": "15s",
    "tags": ["Event", "Sport", "Oranje", "Support"],
    "transcript": "Het WK Roeien is in volle gang. Onze helden van TeamNL strijden voor goud. Soms win je, soms verlies je. Maar wij staan achter ze. Moedig ze aan. TeamNL. Samen zijn we één."
  },
  {
    "id": "rodekruis_01",
    "brand": "Rode Kruis",
    "category": "Non-profit",
    "duration_type": "20s",
    "tags": ["Emotie", "Hulp", "Kerst", "Doneren"],
    "transcript": "Niemand mag alleen zijn tijdens de feestdagen. Toch zitten duizenden mensen in de kou. Zonder eten, zonder hulp. Het Rode Kruis komt in actie. Help ons helpen. Geef voor een ander. Ga naar rodekruis.nl en doneer. Bedankt."
  },
  {
    "id": "milieudefensie_01",
    "brand": "Milieudefensie",
    "category": "Non-profit",
    "duration_type": "20s",
    "tags": ["Maatschappelijk", "Actie", "Strijdbaar", "Klimaat"],
    "transcript": "De grote vervuilers gaan gewoon door. Maar wij ook. Samen met jou starten we een nieuwe klimaatzaak. Want onze toekomst is niet te koop. Doe mee en sluit je aan bij Milieudefensie. Ga naar milieudefensie.nl."
  },
  {
    "id": "blaklader_01",
    "brand": "Blåkläder",
    "category": "B2B / Workwear",
    "duration_type": "15s",
    "tags": ["Vakmensen", "Kwaliteit", "Garantie", "Stoer"],
    "transcript": "Hé vakman. Of je nu bouwt, schildert of installeert. Jij levert vakwerk. En dat verwacht je ook van je werkkleding. Kies daarom voor Blåkläder. Professionele werkkleding met levenslange garantie op de naden. Blåkläder. Als je kleding maar goed zit."
  },
  {
    "id": "biketotaal_01",
    "brand": "Bike Totaal",
    "category": "Retail / Service",
    "duration_type": "20s",
    "tags": ["Seizoen", "Onderhoud", "Fietsen", "Gratis extra"],
    "transcript": "De zon schijnt. Tijd om te fietsen. Maar is jouw fiets er al klaar voor? Ga naar Bike Totaal voor de onderhoudsbeurt. En ontvang gratis het Fietspaspoort. Voor altijd inzicht in je onderhoud en reparaties. Maak nu een afspraak op BikeTotaal.nl. Bike Totaal. Totaal fietsplezier."
  },
  {
    "id": "bol_02_sint",
    "brand": "Bol",
    "category": "E-commerce",
    "duration_type": "15s",
    "tags": ["Sinterklaas", "Retourneren", "Service", "Ontzorgen"],
    "transcript": "Sint tip van Bol. Iets dubbel gekregen? Geen punt. Bij Bol heb je 30 dagen bedenktijd. En kun je gratis retourneren. Dus ruil dat dubbele cadeau makkelijk om voor iets anders. Bol. De winkel van ons allemaal."
  },
  {
    "id": "aldi_02_pasen",
    "brand": "ALDI",
    "category": "Retail",
    "duration_type": "10s",
    "tags": ["Pasen", "Actie", "Food", "Prijs"],
    "transcript": "Nu bij Aldi. Alles voor een vrolijk Pasen. Zoals luxe stol van 2,99 voor 1,99. En alle gourmet mini's. 3 halen, 2 betalen. Dat is Aldi. Natuurlijk wel."
  },
  {
    "id": "beterbed_02",
    "brand": "Beter Bed",
    "category": "Wonen",
    "duration_type": "15s",
    "tags": ["Slapen", "Korting", "Probleem/Oplossing", "Gezondheid"],
    "transcript": "Wist je dat je dag wordt bepaald door je nacht? Begin je dag goed met Beter Bed. En profiteer nu van 50% korting op boxsprings. Kijk op Beterbed.nl. Beter Bed. Beter slapen, beter leven."
  },
  {
    "id": "50plusmobiel_01",
    "brand": "50+ Mobiel",
    "category": "Telecom",
    "duration_type": "20s",
    "tags": ["Niche", "Prijszekerheid", "Sim Only", "Overstappen"],
    "transcript": "Ben je 50 plus? En betaal je te veel voor je mobiele abonnement? Stap dan nu over naar 50+ Mobiel. Wij bieden voordelige Sim Only abonnementen met 2 jaar geen prijsstijgingen. Ga snel naar 50plusmobiel.nl. 50+ Mobiel. Slimme keuze."
  },
  {
    "id": "bouwgarant_01",
    "brand": "BouwGarant",
    "category": "Service / Bouw",
    "duration_type": "20s",
    "tags": ["Vertrouwen", "Verbouwen", "Keurmerk", "Zekerheid"],
    "transcript": "Ga je verbouwen? Dan wil je zekerheid. Kies voor een aannemer met het BouwGarant keurmerk. Dan ben je verzekerd tegen faillissement en gebreken. Kijk voor een vakman in de buurt op Bouwgarant.nl. BouwGarant. De zekerheid van je leven."
  },
  {
    "id": "diabetesfonds_01",
    "brand": "Diabetes Fonds",
    "category": "Non-profit / Goede Doelen",
    "duration_type": "20s",
    "tags": ["Collecte", "Gezondheid", "Onderzoek", "Urgentie"],
    "transcript": "Diabetes sloopt je gezondheid. En 1,2 miljoen Nederlanders hebben het. We kunnen genezing dichterbij brengen. Maar daar is geld voor nodig. Geef daarom aan de collectant. Of scan de QR-code op de bus. Samen maken we een vuist tegen diabetes. Diabetes Fonds."
  },
  {
    "id": "bruna_01",
    "brand": "Bruna",
    "category": "Retail",
    "duration_type": "15s",
    "tags": ["Najaar", "Cadeau", "PostNL", "Service"],
    "transcript": "De avonden worden langer. Tijd voor een goed boek. Kom naar Bruna voor de mooiste verhalen en de leukste cadeaus. En moet je nog een pakketje wegbrengen? Dat kan ook gewoon bij het PostNL punt in de winkel. Bruna. Ontdek het najaar."
  },
  {
    "id": "aanhuis_01",
    "brand": "Woninginrichting-Aanhuis.nl",
    "category": "Wonen",
    "duration_type": "20s",
    "tags": ["Interieur", "Ontzorgen", "Advies", "Make-over"],
    "transcript": "Is je huis toe aan een make-over? Maar weet je niet waar je moet beginnen? Ga naar Woninginrichting-Aanhuis.nl. Wij regelen alles. Van vloer tot gordijn. En van advies tot montage. Wij maken van je huis weer een thuis. Woninginrichting-Aanhuis.nl. Alles voor je woning."
  },
  {
    "id": "rijksoverheid_01_levens",
    "brand": "Rijksoverheid",
    "category": "Overheid / Info",
    "duration_type": "25s",
    "tags": ["Burgerzaken", "Informatie", "Life Events", "Betrouwbaar"],
    "transcript": "Trouwen, een kind krijgen, of met pensioen gaan. Belangrijke momenten in je leven. Maar wat moet je eigenlijk regelen met de overheid? Op Rijksoverheid.nl/levensgebeurtenissen vind je een persoonlijk overzicht. Zo weet je precies waar je aan toe bent. Rijksoverheid. Voor wie verder kijkt."
  },
  {
    "id": "tlc_01",
    "brand": "TLC",
    "category": "Media",
    "duration_type": "15s",
    "tags": ["Entertainment", "Emotie", "Reality", "Ziggo"],
    "transcript": "Echte verhalen. Echte mensen. Van tranen van geluk tot drama in de jurk. Je ziet het op TLC. Kijk nu naar de nieuwste seizoenen van je favoriete programma's. TLC. Gratis te zien bij Ziggo op kanaal 14."
  },
  {
    "id": "uwv_01",
    "brand": "UWV",
    "category": "Overheid / Diensten",
    "duration_type": "20s",
    "tags": ["Werk", "Persoonlijk verhaal", "Hulp", "Toekomst"],
    "transcript": "Dit is Gerard. Gerard zocht nieuw werk, maar wist niet wat bij hem paste. Via het UWV kreeg hij loopbaanadvies. En nu? Nu is Gerard blij. Want hij werkt als beveiliger. Zoek jij ook een nieuwe richting? Kijk wat kan op UWV.nl/werk. UWV. Werken aan perspectief."
  },
  {
    "id": "burgerking_01",
    "brand": "Burger King",
    "category": "QSR / Food",
    "duration_type": "15s",
    "tags": ["Smaak", "Nieuw", "Crunchy", "Fastfood"],
    "transcript": "Ben jij klaar voor de ultieme crunch? Proef nu de nieuwe Ultimate Chicken van Burger King. Malse kip, verse sla en onze geheime saus. Echt om je vingers bij af te likken. Taste is King. Alleen bij Burger King."
  },
  {
    "id": "easyjet_01",
    "brand": "EasyJet",
    "category": "Travel",
    "duration_type": "15s",
    "tags": ["Urgentie", "Vliegen", "Korting", "Call-to-Action"],
    "transcript": "Let op. De EasyJet Big Orange Sale eindigt bijna. Boek nu je tickets voor de zomer met tot wel 20% korting. Maar wacht niet te lang. Want op is op. Ga snel naar EasyJet.com. EasyJet. Europe by us."
  },
  {
    "id": "dominos_01",
    "brand": "Domino's",
    "category": "QSR / Food",
    "duration_type": "10s",
    "tags": ["Actie", "Stunt", "Prijs", "Hoge Energie"],
    "transcript": "Het is Stuntweek bij Domino's! Alle medium pizza's voor bodemprijzen. Bestel nu online. Wacht niet, want deze week gaat snel. Domino's. Oh wat lekker."
  },
  {
    "id": "eneco_01_voordeel",
    "brand": "Eneco",
    "category": "Energie / Service",
    "duration_type": "20s",
    "tags": ["Duurzaam", "Besparen", "Slim", "App"],
    "transcript": "Slim omgaan met energie. Dat is goed voor de wereld én je portemonnee. Met Eneco Voordeelmomenten krijg je een seintje als de stroomprijs laag is. Dus: wasmachine aan? Nu! Check de Eneco app. Eneco. We doen het nu."
  },
  {
    "id": "independent_films_01_nysm3",
    "brand": "Independent Films (Q-Movies)",
    "category": "Entertainment / Film",
    "duration_type": "20s",
    "tags": ["Bioscoop", "Spanning", "Trailer", "Uitgaan"],
    "transcript": "[SFX: Mysterieuze muziek] De grootste illusionisten ter wereld zijn terug. Voor hun meest gevaarlijke truc ooit. Now You See Me 3. Niets is wat het lijkt. Vanaf donderdag in de bioscoop. Ga voor tickets naar de website."
  },
  {
    "id": "chocomel_01_sugarfree",
    "brand": "Chocomel",
    "category": "FMCG / Food",
    "duration_type": "15s",
    "tags": ["Smaak", "Introductie", "Gezondheid", "Genieten"],
    "transcript": "Heb je trek in de enige echte? Maar wil je even minderen met suiker? Goed nieuws. Er is nu Chocomel 0% suiker toegevoegd. Dezelfde romige smaak die je kent. Maar dan zonder de suiker. Chocomel 0%. De enige echte."
  },
  {
    "id": "fbto_01_zorg_nieuwjaar",
    "brand": "FBTO",
    "category": "Verzekering / Zorg",
    "duration_type": "20s",
    "tags": ["Eindejaar", "Keuzevrijheid", "Overstappen", "Modulair"],
    "transcript": "Het nieuwe jaar komt eraan. Tijd om je zorgverzekering te checken. Bij FBTO bepaal jij het lekker zelf. Zet modules aan of uit wanneer jij dat wilt. Zo betaal je alleen voor wat je nodig hebt. Bereken je premie op FBTO.nl. FBTO. Jij kiest."
  },
  {
    "id": "esso_01_win",
    "brand": "Esso",
    "category": "Retail / Automotive",
    "duration_type": "20s",
    "tags": ["Winactie", "Loyalty", "Tanken", "Prijzen"],
    "transcript": "Sluit het jaar winnend af bij Esso. Tank nu en maak kans op duizenden prijzen. Van brandstoftegoed tot een gloednieuwe auto. Scan je Esso Extra kaart of app bij elke tankbeurt. Hoe vaker je tankt, hoe meer kans. Esso. Snel weer op weg."
  },
  {
    "id": "eboekhouden_01",
    "brand": "e-Boekhouden.nl",
    "category": "B2B / Software",
    "duration_type": "10s",
    "tags": ["Ondernemers", "Gratis proberen", "Gemak", "Starters"],
    "transcript": "Startende ondernemer? Maak het jezelf makkelijk. Met e-Boekhouden.nl. Nu de eerste 15 maanden helemaal gratis. Eenvoudig en snel je boekhouding geregeld. Ga naar e-Boekhouden.nl."
  },
  {
    "id": "karwei_01_flexa",
    "brand": "Karwei",
    "category": "DIY / Wonen",
    "duration_type": "15s",
    "tags": ["Verf", "Korting", "Voorjaar", "Klus"],
    "transcript": "Het voorjaar begint bij Karwei. Geef je huis kleur met Flexa. Deze week krijg je 40% korting op alle Flexa verf en lak. Mengverf of kant-en-klaar. Karwei. De bouwmarkt met smaak."
  },
  {
    "id": "jumbo_01_top1500",
    "brand": "Jumbo",
    "category": "Retail / Event",
    "duration_type": "20s",
    "tags": ["Muziek", "Borrel", "Feest", "Samenwerking"],
    "transcript": "Luister naar de Qmusic Top 1500. En vier het mee met Jumbo. Haal alles in huis voor een gezellige borrel tijdens de lijst der lijsten. Van kaasplankje tot bitterbal. Jumbo. En... Proost!"
  },
  {
    "id": "jumbo_02_daslekker",
    "brand": "Jumbo",
    "category": "Retail",
    "duration_type": "20s",
    "tags": ["Boodschappen", "Aanbieding", "Weekactie", "Food"],
    "transcript": "Hallo Jumbo. Deze week scoor je weer de beste deals. Zoals vers gesneden groente, 2e halve prijs. En alle wasmiddelen 1 plus 1 gratis. Dat is pas lekker boodschappen doen. Jumbo."
  },
  {
    "id": "lidl_01_agf",
    "brand": "Lidl",
    "category": "Retail / Vers",
    "duration_type": "15s",
    "tags": ["Groente & Fruit", "Kwaliteit", "Prijs", "Vers"],
    "transcript": "Lidl is voor de 10e keer uitgeroepen tot de beste in groente en fruit. En dat proef je. Haal deze week extra voordelig Hollandse bloemkool en mandarijnen in huis. De hoogste kwaliteit voor de laagste prijs. Lidl."
  },
  {
    "id": "douwe_egberts_01",
    "brand": "Douwe Egberts",
    "category": "FMCG / Koffie",
    "duration_type": "20s",
    "tags": ["Energie", "Ochtend", "Thuis", "Genieten"],
    "transcript": "[SFX: Stuiterbal geluiden/Kinderen] Is jouw huis 's ochtends ook net een stuiterbal? Neem even een momentje voor jezelf. Met de vertrouwde geur van Douwe Egberts. Daar kikker je van op. Douwe Egberts. En dan is er koffie."
  },
  {
    "id": "la_cubanita_01",
    "brand": "La Cubanita",
    "category": "Horeca / Uitgaan",
    "duration_type": "20s",
    "tags": ["Tapas", "Actie", "Film", "Vrienden"],
    "transcript": "April is Filmmaand bij La Cubanita! Kom onbeperkt tapas eten en ontvang een gratis bioscoopkaartje voor een film naar keuze. Trommel je vrienden op en reserveer snel. La Cubanita. La vida es bella."
  },
  {
    "id": "kaartje2go_01",
    "brand": "Kaartje2go",
    "category": "Service / Seizoen",
    "duration_type": "15s",
    "tags": ["Kerst", "Persoonlijk", "Gemak", "Kaarten"],
    "transcript": "Wie stuur jij een kaartje deze Kerst? Maak het extra persoonlijk met je eigen foto. Of kies uit duizenden designs. Voor 20:00 uur besteld, vandaag nog op de post. De leukste kerstkaarten maak je bij Kaartje2go.nl."
  },
  {
    "id": "mattsleeps_01_bf",
    "brand": "Matt Sleeps",
    "category": "Retail / Slapen",
    "duration_type": "10s",
    "tags": ["Black Friday", "Actie", "Urgentie", "Online"],
    "transcript": "Slecht geslapen? Wakker worden! Het is Black Friday bij Matt Sleeps. Scoor nu de allerbeste deal op het beste matras van Nederland. Maar wacht niet te lang. Matt Sleeps. De tijd tikt."
  },
  {
    "id": "minjenv_01_weerbaarheid",
    "brand": "Ministerie van Justitie & Veiligheid",
    "category": "Overheid / Maatschappelijk",
    "duration_type": "25s",
    "tags": ["Drugscriminaliteit", "Jongeren", "Waarschuwing", "Serieus"],
    "transcript": "Criminelen ronselen jongeren voor klusjes in de drugshandel. Snel geld, zeggen ze. Maar voor je het weet, zit je vast in een wereld vol geweld. Zie jij signalen? Of maak je je zorgen om iemand? Kijk wat je kunt doen op de website. Een veilig Nederland maken we samen."
  },
  {
    "id": "plintenfabriek_01",
    "brand": "Plintenfabriek.nl",
    "category": "Wonen / Niche",
    "duration_type": "20s",
    "tags": ["Verbouwen", "Specialist", "Afwerking", "Online"],
    "transcript": "Nieuwe vloer gelegd? Vergeet de afwerking niet. Plintenfabriek.nl heeft voor elke vloer de perfecte plint. Van modern tot klassiek. En direct uit voorraad leverbaar. Maak je huis helemaal af. Ga naar Plintenfabriek.nl."
  },
  {
    "id": "makro_01_kerst",
    "brand": "Makro",
    "category": "Groothandel / B2B",
    "duration_type": "15s",
    "tags": ["Kerst", "Ondernemers", "Horeca", "Food"],
    "transcript": "Ondernemers opgelet. De feestdagen staan voor de deur. Bij Makro vind je alles voor een geslaagde Kerst. Van de mooiste kerstpakketten tot het meest luxe wild en gevogelte. Doe het groots dit jaar. Doe het met Makro."
  },
  {
    "id": "life_outdoor_01",
    "brand": "Life Outdoor Living",
    "category": "Tuin / Wonen",
    "duration_type": "20s",
    "tags": ["Tuinmeubelen", "Lente/Zomer", "Genieten", "Luxe"],
    "transcript": "De zon gaat weer schijnen. Is jouw tuin er al klaar voor? Ontdek the nieuwe collectie van Life Outdoor Living. Exclusieve tuinmeubelen waar design en comfort samenkomen. Creëer jouw ultieme buitenplaats. Life Outdoor Living. Geniet van het buitenleven."
  },
  {
    "id": "mcdonalds_01_smartmenu",
    "brand": "McDonald's",
    "category": "QSR / Food",
    "duration_type": "15s",
    "tags": ["Value", "Jongeren", "Prijs", "Snack"],
    "transcript": "Trek in iets lekkers, maar even low budget? Check het SmartMenu van McDonald's. Chili Chicken, Cheeseburger of medium frietjes. Altijd voor een slimme prijs. Stel nu jouw menu samen. McDonald's. I'm lovin' it."
  },
  {
    "id": "nvm_01",
    "brand": "NVM",
    "category": "Diensten / Wonen",
    "duration_type": "20s",
    "tags": ["Huizenmarkt", "Vertrouwen", "Expertise", "Makelaar"],
    "transcript": "Een huis kopen of verkopen is een grote stap. Dat doe je niet zomaar. Schakel daarom een NVM makelaar in. Voor deskundig advies en zekerheid in deze markt. Zo sta je sterker. NVM. Thuis in de woningmarkt."
  },
  {
    "id": "mediamarkt_01_airfryer",
    "brand": "MediaMarkt",
    "category": "Retail / Elektronica",
    "duration_type": "15s",
    "tags": ["Product Focus", "Hard Sales", "Aanbieding", "Philips"],
    "transcript": "MediaMarkt Super Sale! Pak nu je voordeel. De Philips Airfryer XXL. Bakken zonder vet voor het hele gezin. Nu tijdelijk voor een bodemprijs. Op is op. Ren naar de winkel of bestel online. MediaMarkt. Ik ben toch niet gek."
  },
  {
    "id": "rabobank_01_beleggen",
    "brand": "Rabobank",
    "category": "Financiën / Bank",
    "duration_type": "20s",
    "tags": ["Beleggen", "Gemak", "Toekomst", "Experts"],
    "transcript": "Wil je meer uit je spaargeld halen? Maar heb je geen tijd om de beurs te volgen? Kies voor Rabo Beheerd Beleggen. Onze experts gaan voor je aan de slag. Jij bepaalt je doel, wij doen de rest. Rabobank. Growing a better world together."
  },
  {
    "id": "pinklady_01_launch",
    "brand": "Pink Lady",
    "category": "FMCG / Vers",
    "duration_type": "15s",
    "tags": ["Smaak", "Verleiding", "Gezond", "Emotie"],
    "transcript": "[SFX: Knapperige hap in appel] Hmm... Pink Lady. Laat je verleiden door de unieke smaak. Zoet, sappig en onweerstaanbaar knapperig. Pink Lady. Meer dan een appel. Een beleving."
  },
  {
    "id": "reumanederland_01",
    "brand": "ReumaNederland",
    "category": "Non-profit / Gezondheid",
    "duration_type": "20s",
    "tags": ["Onderzoek", "Urgentie", "Steun", "Pijn"],
    "transcript": "Reuma remt je af. Elke dag weer. Lopen, werken, sporten... niets is vanzelfsprekend. ReumaNederland strijdt voor een leven zonder pijn. Help mee en steun belangrijk onderzoek. Ga naar reumanederland.nl."
  },
  {
    "id": "stage_moulinrouge_01",
    "brand": "Stage Entertainment (Moulin Rouge)",
    "category": "Entertainment / Musical",
    "duration_type": "15s",
    "tags": ["Uitgaan", "Spektakel", "Ticketverkoop", "Music"],
    "transcript": "[Muziek: Lady Marmalade beat] Betreed een wereld vol glitter en glamour. Moulin Rouge! De Musical. Het grootste spektakel van het jaar. Nu te zien in het Beatrix Theater Utrecht. Bestel snel je tickets op moulinrouge.nl."
  },
  {
    "id": "sony_jt_01",
    "brand": "Sony Music (Justin Timberlake)",
    "category": "Entertainment / Muziek",
    "duration_type": "10s",
    "tags": ["Album Release", "Artist Focus", "Nu te beluisteren", "Fanbase"],
    "transcript": "[Muziek: Fragment Justin Timberlake] Hij is terug. Justin Timberlake. Met zijn gloednieuwe album. Luister 'm nu op Spotify of Apple Music. Sony Music."
  },
  {
    "id": "denhaag_01_winter",
    "brand": "The Hague & Partners",
    "category": "City Marketing / Travel",
    "duration_type": "20s",
    "tags": ["Toerisme", "Stad", "Sfeer", "Dagje uit"],
    "transcript": "Heb jij zin in een koninklijke winter? Kom naar Den Haag. Ontdek de verlichte binnenstad, shop in de leukste boetiekjes en waai uit op het strand. The Hague. Have a Royal Winter. Kijk op denhaag.com."
  },
  {
    "id": "sloggi_01",
    "brand": "Sloggi (Triumph)",
    "category": "Fashion / Retail",
    "duration_type": "15s",
    "tags": ["Comfort", "Ondergoed", "Innovatie", "Vrouwen"],
    "transcript": "Ervaar het ultieme vrijheidsgevoel. Met Sloggi Zero Feel. Geen beugels, geen naden, geen gedoe. Alleen puur comfort. Je voelt niet dat je het draagt. Sloggi. The unfeelable feeling."
  },
  {
    "id": "westfield_01_xmas",
    "brand": "Westfield Mall of the Netherlands",
    "category": "Retail / Mall",
    "duration_type": "15s",
    "tags": ["Shopping", "Kerst", "Experience", "Groots"],
    "transcript": "De magie van Kerst begint bij Westfield Mall of the Netherlands. Alle cadeaus onder één dak. Oneindig shoppen, dineren en beleven. Maak van je kerstinkopen een feestje. Kom naar Leidschendam. Westfield. More to discover."
  },
  {
    "id": "wakkerdier_01",
    "brand": "Wakker Dier",
    "category": "Non-profit / Activisme",
    "duration_type": "20s",
    "tags": ["Dierenwelzijn", "Confronterend", "Bewustwording", "Supermarkt"],
    "transcript": "Kip is het meest mishandelde stukje vlees van Nederland. Veel supermarkten verkopen nog steeds plofkip. Dat kan echt niet meer. Help de dieren en kies bewust. Kijk welke supermarkten wel goed bezig zijn op Wakkerdier.nl."
  },
  {
    "id": "takko_01",
    "brand": "Takko Fashion",
    "category": "Retail / Fashion",
    "duration_type": "15s",
    "tags": ["Budget", "Gezin", "Korting", "Kleding"],
    "transcript": "Op zoek naar nieuwe looks voor het hele gezin? Bij Takko Fashion slaag je altijd. En nu extra voordelig. Profiteer van 20% korting op alle jassen en truien. Dat staat je goed. Takko Fashion."
  },
  {
    "id": "wibra_01",
    "brand": "Wibra",
    "category": "Retail / Budget",
    "duration_type": "15s",
    "tags": ["Huishouden", "Prijs", "Slim", "Schoonmaak"],
    "transcript": "Schoonmaken hoeft niet duur te zijn. Bij Wibra vind je alles voor een fris huis. Van de bekende Dasty ontvetter tot microvezeldoekjes. Topkwaliteit voor een Wibra prijsje. Wibra. Dat doe je goed."
  },
  {
    "id": "x2o_01_pasen",
    "brand": "X2O Badkamers",
    "category": "Wonen / Sanitair",
    "duration_type": "15s",
    "tags": ["Pasen", "Badkamer", "Korting", "Renovatie"],
    "transcript": "Vrolijk Pasen bij X2O Badkamers. Profiteer tijdens de Paasdeals van extra korting op douches, baden en meubels. Maak van je badkamer een wellness paleisje. Kom naar the showroom of kijk op x2o.nl. X2O. Meer badkamer voor je geld."
  },
  {
    "id": "yakult_01_balance",
    "brand": "Yakult",
    "category": "FMCG / Gezondheid",
    "duration_type": "15s",
    "tags": ["Ochtend", "Weerstand", "Balans", "Gewoonte"],
    "transcript": "Goed voor jezelf zorgen begint van binnen. Start je dag met een kleintje Yakult. Vol unieke bacteriën die je darmflora ondersteunen. Voel je goed, elke dag weer. Yakult. Working on a healthy society."
  },
  {
    "id": "xxxlutz_01_bf",
    "brand": "XXXLutz",
    "category": "Wonen / Retail",
    "duration_type": "15s",
    "tags": ["Black Friday", "Actie", "Schreeuwerig", "Meubels"],
    "transcript": "Het is Black Shopping Week bij XXXLutz! Profiteer van XXXL kortingen op banken, bedden en kasten. Alles moet weg. Kom naar de winkel met de rode stoel. Of bestel online. XXXLutz. De XXXL woonwinkel."
  },
  {
    "id": "younited_01",
    "brand": "Younited",
    "category": "Financiën / Fintech",
    "duration_type": "15s",
    "tags": ["Lenen", "Snelheid", "Online", "Krediet"],
    "transcript": "Plannen om te verbouwen? Of een nieuwe auto op het oog? Bij Younited regel je jouw lening 100% online. Snel, simpel en tegen een scherpe rente. Check direct hoeveel jij kunt lenen op younited-credit.nl. Let op: geld lenen kost geld."
  }
];
