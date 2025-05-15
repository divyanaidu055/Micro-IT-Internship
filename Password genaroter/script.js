 // Password character sets
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~';

const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');

function getOptions() {
    return {
        length: parseInt(document.getElementById('length').value, 10),
        uppercase: document.getElementById('uppercase').checked,
        lowercase: document.getElementById('lowercase').checked,
        numbers: document.getElementById('numbers').checked,
        symbols: document.getElementById('symbols').checked
    };
}

function generatePassword() {
    const opts = getOptions();
    let chars = '';
    if (opts.uppercase) chars += UPPERCASE;
    if (opts.lowercase) chars += LOWERCASE;
    if (opts.numbers) chars += NUMBERS;
    if (opts.symbols) chars += SYMBOLS;
    if (!chars) return '';

    let password = '';
    for (let i = 0; i < opts.length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

generateBtn.addEventListener('click', () => {
    const pwd = generatePassword();
    passwordOutput.value = pwd;
});

copyBtn.addEventListener('click', () => {
    if (!passwordOutput.value) return;
    passwordOutput.select();
    document.execCommand('copy');
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyBtn.textContent = 'Copy';
    }, 1200);
});
