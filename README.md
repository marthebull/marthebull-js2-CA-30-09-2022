# marthebull-js2-CA-30-09-2022

CA for JavaScript 2, implementere funksjonalitet på sosialmedie plattfrom

Netlify link:
dev-branch
https://timely-unicorn-ff32cd.netlify.app/
main-branch (denne er tom siden jeg ikke har merget enda)
https://enchanting-caramel-0fe287.netlify.app/

Github Link:
Dev-branch
https://github.com/marthebull/marthebull-js2-CA-30-09-2022/tree/js2-develop

Trello:
https://trello.com/b/VPeuflNm/js2-ca

Filter og søk:
Filter og søk er kombinert i søkefelt, det tar hensyn til søker i både navn, tittel og body/content.

Poste post:
Har lagt inn en link til placeholderbilde, slik at man får postet posten med eller "uten" bilde. Jeg er klar over at linken er feil, men jeg har valgt å beholden slik fordi da ser det ut som at posten ble postet uten bilde. Ellers blir placeholderbildet synlig på alle poster som blir postet uten bilde.

Ville ha denne create new post-seksjonen sticky på siden, så selvom man scroller i postene så forbli denne på skjermen. Dette funket ikke, sikkert noe med bootstrap jeg ikke skjønner.

Login:
Hvis skriver feil brukenavn eller passord kommer det en feilmelding om "inavlid email og password", får ikke beskjed om noe mer spesifikt enn det. Gir mer spesifikke feilmeldinger på register-siden.

Annet:
Har valgt å beholde consol logger midlertidig, bare kommentert dem ut.

Forbedringspotensiale/ting jeg vil gjøre senere:

- Slette accesstoken når en logger ut
- Bli sendt til login siden om man ikke er logget inn, men likevel ender på home-feed siden.
- Sortere poster til latest first på profil side
- Validering på create-post formet, slik at man ikke får poste tomme poster (dette funket tidligere, litt usikker på hva som er feilen nå)
- Legge til kommmentarfelt på poster
