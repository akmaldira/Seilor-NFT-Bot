const puppeteer = require('puppeteer-extra');
const dappeteer = require('@chainsafe/dappeteer');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const readline = require('readline');

puppeteer.use(StealthPlugin());

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function main(seed) {
    const browser = await dappeteer.launch(puppeteer, { 
        headless: false, 
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
        metamaskVersion: 'v10.15.0', 
        defaultViewport: null
    });
    console.log('Setup wallet...\nUsing seed', seed);
    const metamask = await dappeteer.setupMetamask(browser,{seed: seed})
    const switchNetwork = async () => {
        try {
            await metamask.addNetwork({networkName: "Binance Smart Chain",rpc: "https://bsc-dataseed1.defibit.io/",chainId: "56",symbol: "BNB"})
        } catch (err) {
            var inputs = await metamask.page.$$( 'input.form-field__input' );
            for (let input of inputs) {
                await input.click({ clickCount: 3 });
                await metamask.page.keyboard.press('Backspace');
            }
            await switchNetwork();
        }
    }

    await switchNetwork();
    await metamask.switchNetwork('Binance Smart Chain');
    const page = await browser.newPage();
    console.log('Opening web');
    const goTo = async () => {
        try {
            await page.goto('https://alpha.omniflix.tv/interactive-videos/6350df4932e06561269a047b');
        } catch (err) {
            await goTo();
        }
    }
    await goTo();
    await page.waitForXPath('//*[@id="root"]/div/div/div[1]/div[2]/div/button');
    connect = await page.$x('//*[@id="root"]/div/div/div[1]/div[2]/div/button');
    await connect[0].click();
    await page.waitForXPath('/html/body/div[2]/div[3]/div/div[1]/button[2]');
    metamaskConnect = await page.$x('/html/body/div[2]/div[3]/div/div[1]/button[2]');
    await metamaskConnect[0].click();
    await page.waitForXPath('/html/body/div[2]/div[3]/div/div/div/div[3]/div');
    network = await page.$x('/html/body/div[2]/div[3]/div/div/div/div[3]/div');
    await network[0].click();
    await metamask.approve({allAccounts: false});
    page.bringToFront();
    await page.waitForXPath('//*[@id="scroll-bar"]/div/div[2]/div[1]/div[3]/button[1]');
    playBtn = await page.$x('//*[@id="scroll-bar"]/div/div[2]/div[1]/div[3]/button[1]');
    playBtn[0].click();
    console.log('Connect wallet success');
    await sleep(2000);
    await metamask.sign();
    page.bringToFront();
    const answer = async (answ, id) => {
        try {
            x = await page.$x(`//span[contains(., '${answ}')]`);
            await x[0].click();

            submit = await page.$x((`//*[@id="interaction_buttons-${id}"]/div/div/button`));
            
            submit[0].click();
        } catch (err) {
            if (err.message === 'Node is either not clickable or not an HTMLElement') {
                await answer(answ, id);
            }
        }
    }

    const playHandle = async (sleep, time) => {
        v = await page.$eval("#video-player", element=> element.getAttribute("class"));
        let className = v.split(' ');
        if (className[className.length - 2] === 'vjs-user-inactive' && className[className.length - 1] === 'vjs-paused' || className[className.length - 2] === 'vjs-paused') {
            await sleep(1000)
            x = await page.$x('//*[@id="scroll-bar"]/div/div[2]/div[1]/div[3]/button[1]');  
            x[0].click()
            .then(async () => {
                await sleep(1000);
                await metamask.sign();
                await page.bringToFront();

            })
            .catch((err) => {
            })
                
        }
        sleep(time);
    }
    await sleep(28000);
    await answer('Layer 1 Blockchain', 0);
    console.log('1. Done');
    await playHandle(sleep, 8000);

    await answer('Twin-Turbo', 1);
    console.log('2. Done');
    await playHandle(sleep, 17000);

    await answer('Vortex protocol', 2);
    console.log('3. Done');
    await playHandle(sleep, 15000);

    await answer('5M', 3);
    console.log('4. Done');
    await playHandle(sleep, 15000);

    await answer('Jay Jog, Dan Edlebeck', 4);
    console.log('5. Done');
    await playHandle(sleep, 10000);

    await answer('22,000 ops', 5);
    console.log('6. Done');
    await playHandle(sleep, 6000)

    await answer('30,000', 6);
    console.log('7. Done');
    await playHandle(sleep, 6000)

    await answer('Atlantis', 7);
    console.log('8. Done');
    await playHandle(sleep, 6000)

    await answer('www.seinetwork.io', 8);
    console.log('9. Done');
    await playHandle(sleep, 10000)

    await answer('@SeiNetwork', 9);
    console.log('10. Done');
    await playHandle(sleep, 10000);
    
    fs.appendFile('resultlo.txt', `\n${seed}|Done`, function (err) {
        if (err) throw err;
        console.log('Saved to resultlo.txt\n\n');
    });
    await sleep(10000);

    browser.close();
}

(async () => {
    const fileStream = fs.createReadStream('seedwallet.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const seed of rl) {
        await main(seed);
    }
})();
