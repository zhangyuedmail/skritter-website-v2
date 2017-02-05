// paste chrome dev tools when a writing prompt is visible to test the input
// testSingleCharInput();
// testMultiCharInput();
var vent = require('vent');

async function testSingleCharInput() {
	const pinyinData = app.fn.pinyin.getData();
	const keys = Object.keys(pinyinData).filter(k => k.length > 2);
	const $readingPrompt = $('#reading-prompt');
	const keysLen = keys.length;
	const subMap = {
		'1': '₁',
        '2': '₂',
	    '3': '₃',
	    '4': '₄',
	    '5': '₅'
	};
	let errors = [];

	await triggerInput($readingPrompt, '');

	for (let i = 0; i < keysLen; i++) {
		let key = keys[i];
		let val = pinyinData[key];

		await triggerInput($readingPrompt, key);

		let promptVal = $readingPrompt.val();

		if (promptVal !== pinyinData[key].pinyin + subMap[key.substring(key.length - 1, key.length)]) {
			errors.push(key);
			console.log(key);
		}

		await triggerInput($readingPrompt, '', true);
	}

	if (errors.length) {
		console.log('There were errors with ' + errors.length + ' inputs:');
		console.log(errors);
	} else {
		console.log('No errors!');
	}
}

async function testMultiCharInput() {
	const pinyinData = app.fn.pinyin.getData();
	let keys = Object.keys(pinyinData).filter(k => k.length > 2);

	// should be 2090 values. But that's not divisible by 3. Instead of adding a bunch of range checking code,
	// let's add one more (valid) value so the loop works!
	keys.push('o1');

	// Shuffle order to make words more inseresting
	// Non-deterministic testing is good, right?
    for (let i = keys.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [keys[i - 1], keys[j]] = [keys[j], keys[i - 1]];
    }

	const $readingPrompt = $('#reading-prompt');
	const keysLen = all ? keys.length : 25;
	const subMap = {
		'1': '₁',
        '2': '₂',
	    '3': '₃',
	    '4': '₄',
	    '5': '₅'
	};
	let errors = [];
	let times = [];

	await triggerInput($readingPrompt, '');

	for (let i = 0; i < keysLen; i+= 3) {
		var t0 = performance.now();
		const key1 = keys[i];
		const val1 = pinyinData[key1].pinyin;
		const tone1 = key1.substr(key1.length - 1, key1.length);

		const key2 = keys[i + 1];
		const val2 = pinyinData[key2].pinyin;
		const tone2 = key2.substr(key2.length - 1, key2.length);

		const key3 = keys[i + 2];
		const val3 = pinyinData[key3].pinyin;
		const tone3 = key3.substr(key3.length - 1, key3.length);

		await triggerInput($readingPrompt, key1 + key2 + key3);

		const promptVal = $readingPrompt.val();
		const finalString = val1 + subMap[tone1] + val2 + subMap[tone2] + val3 + subMap[tone3];
		if (promptVal !== finalString) {
			errors.push(key1 + key2);
			console.log(key1 + key2);
		}

		await triggerInput($readingPrompt, '', true);
		var t1 = performance.now();
		times.push(t1 - t0);
	}

	var avgTime = times.reduce((a, b) => a + b, 0) / times.length;
	console.log('average time: ' + avgTime);
	if (errors.length) {
		console.log('There were errors with ' + errors.length + ' inputs:');
		console.log(errors);
	} else {
		console.log('No errors!');
	}
}

function triggerInput(input, value, empty) {
	return new Promise((resolve, reject) => {
		const toInput = empty ? '' : input.val() + value;
		
		if (empty) {
			input.val('');
			resolve();
			return;
		}

		for (let i = 0; i < toInput.length; i++) {
			input.val(input.val() + toInput[i]);
			vent.trigger('test:processpinyin');
		}

		// timeout needs to be ~5ms for browser to properly repaint and show the input
		// if you care about that. If not, comment out the timeout and let the numbers 
		// crunch faster than you can see!
		// setTimeout(function() {
			resolve();
		// }, 10); 
	});
}