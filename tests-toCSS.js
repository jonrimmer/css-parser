var tokenize = require('./tokenizer').tokenize,
	parse = require('./parser').parse,
	ansidiff = require('ansidiff');

var tests = [
	'body { background-color: rgba(0, 10, 20, 0.5); color: blue; }',
	'@media (max-width: 600px) { .facet_sidebar { display: none; } #facet { color: hsl(180, 50%, 70%); -webkit-transition: translate3d(10, 10, 10); } } body { background-color: lightBlue; }',
	'@page :pseudo-class { margin: 2in; }',
	'h1 { animation-duration: 3s; animation-name: slidein; } @keyframes slidein { from { margin-left: 100%; width: 300%; } to { margin-left: 0%; width: 100%; } }',
	'.grad { background-image: linear-gradient(to bottom, hsl(0, 80%, 70%), #bada55); }',
	'#foo { color: red; } #bar:nth-child(n + 1) { color: blue; }',
	'body { background-image: url(\'/img/lolcat.jpg\'); }',
	'@font-face { font-family: BBCBengali; src: url(\'fonts/BBCBengali.ttf\') format("opentype"); unicode-range: U+0-FF; }',
	'body > div + span ~ span { color: red; }',
	'div[attrib=whatevs] { color: black; }'
];

var total = tests.length, failures = 0,
    i, test, tokens, sheet, roundtrippin;

for (i = 0; i < total; i++) {
    test = tests[i];

    tokens = tokenize(test);
    sheet = parse(tokens);
    roundtrippin = sheet.toCSS();

    if (test == roundtrippin) {
        console.log('Test %d of %d: PASS\n', i + 1, total);
    } else {
        console.log('Test %d of %d: FAIL\nCSS: %s\nRoundtripped: %s\n',
            i + 1, total, test, roundtrippin);
        failures++;
    }
}

// Abuse the differ to get colored output
if (failures == 0) {
    console.log(ansidiff.words('%d tests, ', '%d tests, all passed :)'),
                total);
} else {
    console.log(ansidiff.words('%d tests, %d failures :(', '%d tests, '),
                total, failures);
}
